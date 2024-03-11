#!/usr/bin/env -S npx tsx

import { Verse } from "@operativa/verse";
import { Migrator } from "@operativa/verse-migrations";
import { PrettyConsoleLogger } from "@operativa/verse/utils/logging";
import { indent } from "@operativa/verse/utils/utils";
import camelcase from "camelcase";
import chalk from "chalk";
import { highlight } from "cli-highlight";
import Table from "cli-table";
import * as console from "console";
import * as fs from "fs";
import yargs, { ArgumentsCamelCase, Argv, CommandModule } from "yargs";
import { hideBin } from "yargs/helpers";

const logo =
  "  ██╗   ██╗ ███████╗ ██████╗  ███████╗ ███████╗\n" +
  "  ██║   ██║ ██╔════╝ ██╔══██╗ ██╔════╝ ██╔════╝\n" +
  "  ██║   ██║ █████╗   ██████╔╝ ███████╗ █████╗  \n" +
  "  ╚██╗ ██╔╝ ██╔══╝   ██╔══██╗ ╚════██║ ██╔══╝  \n" +
  "   ╚████╔╝  ███████╗ ██║  ██║ ███████║ ███████╗\n" +
  "    ╚═══╝   ╚══════╝ ╚═╝  ╚═╝ ╚══════╝ ╚══════╝\n";

const modelDesc = "Outputs a JSON representation of the model.";
const useHelp = " Use --help for more information.";

class ModelCommand implements CommandModule {
  command = "model";
  describe = modelDesc;

  builder(args: Argv) {
    return args.usage(`${modelDesc}\n\nUsage: $0 model`).strict();
  }

  async handler(args: ArgumentsCamelCase) {
    if (!(await help(args))) {
      console.log(highlight((await loadVerse()).metadata.model.toJSON(), { language: "json" }));
    }
  }
}

const queryDesc = "Executes a verse query expression and outputs the results.";

class QueryCommand implements CommandModule {
  command = "query [expr]";
  describe = queryDesc;

  builder(args: Argv) {
    return args
      .usage(`${queryDesc}\n\nUsage: $0 query <expr>`)
      .positional("expr", {
        describe:
          "The verse query expression to execute. The expression must start with the 'from' keyword. e.g. 'from.todos'",
        type: "string",
      })
      .strict();
  }

  async handler(args: ArgumentsCamelCase) {
    if (await help(args)) {
      return;
    }

    const expr = args["expr"] as string;

    if (!expr) {
      throw new Error(`No verse query expression provided.${useHelp}`);
    }

    if (!expr.startsWith("from.")) {
      throw new Error(`The query expression must start with 'from'.${useHelp}`);
    }

    let fn: any;

    try {
      fn = eval(`$v => $v.${expr}`);
    } catch (e: any) {
      throw new Error(`Invalid query expression: '${expr}': ${e.message}`);
    }

    const verse = await loadVerse();

    let results = [];

    try {
      results = await fn(verse).toArray();
    } catch (e: any) {
      throw new Error(`Error executing query: ${e}`);
    }

    const format = (value: any) =>
      Array.isArray(value) || value instanceof Object ? JSON.stringify(value, null, " ") : value;

    let head: string[] = ["0 rows"];
    let rows: string[][] = [];

    if (results.length > 0) {
      const row = results[0];

      if (row instanceof Object && !Array.isArray(row)) {
        head = Object.keys(row).map(k => camelcase(k, { pascalCase: true }));
        rows = results.map((r: any) => Object.values(r).map(v => format(v)) as string[]);
      } else {
        head = ["Result"];
        rows = results.map((r: any) => [format(r)]);
      }
    }

    const table = new Table({
      head,
      style: { head: ["cyan"] },
    });

    table.push(...rows);

    console.log(indent(table.toString(), 4));
  }
}

const migrationsDesc = "Commands for managing migrations for the target database.";

class MigrationsCommand implements CommandModule {
  command = "migrations";
  describe = "Commands for managing migrations for the target database.";

  builder(args: Argv) {
    return args
      .usage(`${migrationsDesc}\n\nUsage: $0 migrations <command> [options]`)
      .command(new MigrationsApplyCommand())
      .command(new MigrationsCreateCommand())
      .command(new MigrationsDropCommand())
      .command(new MigrationsStatusCommand())
      .strict();
  }

  async handler(argv: ArgumentsCamelCase) {
    if (!(await help(argv)) && !argv["command"]) {
      throw new Error(`No migrations command provided.${useHelp}`);
    }
  }
}

const applyDesc = "Upgrade the target database by applying any pending migrations.";

class MigrationsApplyCommand implements CommandModule {
  command = "apply";
  describe = applyDesc;

  builder(args: Argv) {
    return args
      .usage(`${applyDesc}\n\nUsage: $0 migrations apply`)
      .option("script", {
        alias: "s",
        type: "boolean",
        desc: "Outputs a SQL script instead of applying the migrations.",
      })
      .option("verbose", { alias: "V", type: "boolean" })
      .strict();
  }

  async handler(args: ArgumentsCamelCase) {
    if (await help(args)) {
      return;
    }

    const migrator = await createMigrator(args["verbose"] as boolean);
    let applied = false;

    if (args["script"]) {
      const script = await migrator.script();

      if (script.length > 0) {
        console.log(highlight(script, { language: "postgres", ignoreIllegals: true }));
        applied = true;
      }
    } else {
      await migrator.migrate(m => {
        console.log(` ✅  Applied migration: '${m.name}'.`);
        applied = true;
      });
    }

    if (!applied) {
      console.log(" ✅  No migrations to apply.");
    }
  }
}

const createDesc = "Creates a new migration file.";

class MigrationsCreateCommand implements CommandModule {
  command = "create [name]";
  describe = createDesc;

  builder(args: Argv) {
    return args
      .usage(`${createDesc}\n\nUsage: $0 migrations create <name>`)
      .positional("name", {
        describe: "A name for the migration.",
        type: "string",
      })
      .strict();
  }

  async handler(args: ArgumentsCamelCase) {
    if (await help(args)) {
      return;
    }

    const name = args["name"] as string;

    if (!name) {
      throw new Error(`No migration name provided.${useHelp}`);
    }

    const migrator = await createMigrator();
    const file = await migrator.create(name);

    console.log(` 📁 Created migrations file: '${file}'.`);
  }
}

const dropDesc = "Drop the target database.";

class MigrationsDropCommand implements CommandModule {
  command = "drop";
  describe = dropDesc;

  builder(args: Argv) {
    return args
      .usage(`${dropDesc}\n\nUsage: $0 migrations drop`)
      .option("force", { alias: "f", type: "boolean", desc: "Drop without confirmation." })
      .strict();
  }

  async handler(args: ArgumentsCamelCase) {
    if (!(await help(args))) {
      if (!args["force"]) {
        throw new Error("Use --force to confirm.");
      }

      const verse = await loadVerse();

      if (await verse.database.exists()) {
        await verse.config.driver.drop();
        console.log(` 💣 Database '${verse.config.driver.info}' dropped.`);
      } else {
        console.log(` ❓ Database '${verse.config.driver.info}' does not exist.`);
      }
    }
  }
}

const statusDesc = "Displays the migrations status of the target database.";

class MigrationsStatusCommand implements CommandModule {
  command = "status";
  describe = statusDesc;

  builder(args: Argv) {
    return args
      .usage(`${statusDesc}\n\nUsage: $0 migrations status`)
      .option("verbose", { alias: "V", type: "boolean" })
      .strict();
  }

  async handler(args: ArgumentsCamelCase) {
    if (await help(args)) {
      return;
    }

    const migrator = await createMigrator(args["verbose"] as boolean);
    const status = await migrator.status();

    console.log(
      ` ${status.directoryExists ? "✅" : "❌"}  Directory exists? (${status.directory})`
    );
    console.log(` ${status.databaseExists ? "✅" : "❌"}  Database exists? (${status.database})`);
    console.log(
      ` ${status.tableExists ? "✅" : "❌"}  Migrations table exists? (${
        Migrator.MIGRATIONS_TABLE
      })`
    );

    console.log(` ${status.migrations.every(m => m.applied) ? "✅" : "❌"}  Migrations applied?`);

    status.migrations.forEach(m => {
      console.log(`    ${m.applied ? "✅" : "❌"}  ${m.name} (${m.file})`);
    });
  }
}

class DefaultCommand implements CommandModule {
  command = "$0";

  async handler(_: ArgumentsCamelCase) {
    await printHelp();
  }
}

const parser = yargs(hideBin(process.argv))
  .scriptName("verse")
  .usage(`Usage: $0 <command> [options]`)
  .help(false)
  .version(false)
  .fail(false)
  .command(new DefaultCommand())
  .command(new MigrationsCommand())
  .command(new QueryCommand())
  .command(new ModelCommand())
  .option("help", {
    alias: "h",
    desc: "Show help",
    type: "boolean",
  })
  .recommendCommands()
  .wrap(null)
  .strict();

try {
  await parser.parse();
} catch (err: any) {
  console.error(`${err}`);
}

async function help(argv: any) {
  if (argv.help) {
    await printHelp();

    return true;
  }

  return false;
}

async function printHelp() {
  let help = await parser.getHelp();

  help = help.replace(/\[(expr|name)]/, "<$1>");

  console.log(`\n${chalk.cyan(logo)}\n${help}\n`);
}

async function createMigrator(verbose?: boolean) {
  return new Migrator(
    await loadVerse(),
    undefined,
    verbose ? new PrettyConsoleLogger() : undefined
  );
}

async function loadVerse() {
  const cwd = process.cwd();
  const path = `${cwd}/verse.config.ts`;

  if (!fs.existsSync(path)) {
    throw new Error("No 'verse.config.ts' file found in the current directory.");
  }

  const config = await import(path);

  if (!config.default.verse || !(config.default.verse instanceof Verse)) {
    throw new Error("No verse instance found in verse.config.ts");
  }

  return config.default.verse as Verse;
}
