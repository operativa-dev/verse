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
import path from "path";
import yargs, { ArgumentsCamelCase, Argv, CommandModule } from "yargs";
import { hideBin } from "yargs/helpers";

const logo =
  "  ██╗   ██╗ ███████╗ ██████╗  ███████╗ ███████╗\n" +
  "  ██║   ██║ ██╔════╝ ██╔══██╗ ██╔════╝ ██╔════╝\n" +
  "  ██║   ██║ █████╗   ██████╔╝ ███████╗ █████╗  \n" +
  "  ╚██╗ ██╔╝ ██╔══╝   ██╔══██╗ ╚════██║ ██╔══╝  \n" +
  "   ╚████╔╝  ███████╗ ██║  ██║ ███████║ ███████╗\n" +
  "    ╚═══╝   ╚══════╝ ╚═╝  ╚═╝ ╚══════╝ ╚══════╝\n";

const useHelp = " Use --help for more information.";

const initDesc = "Initializes the package with the base Verse model.";
class InitCommand implements CommandModule {
  command = "init";
  describe = initDesc;

  builder(args: Argv) {
    return args.usage(`${initDesc}\n\nUsage: $0 init`).strict();
  }

  static async #canCreateModel() {
    try {
      await loadVerse();
      return true;
    } catch (error) {
      return false;
    }
  }

  async handler(args: ArgumentsCamelCase) {
    if (!(await help(args))) {
      if (await InitCommand.#canCreateModel()) {
        throw new Error("A Verse model already exists in the package.");
      }

      // The load of verse may have failed, but still have an existing config file.
      // We should prefer that the dev fixes or deletes it. We should not overwrite it.
      const cwd = process.cwd();
      const configPath = `${cwd}/verse.config.ts`;
      if (fs.existsSync(configPath)) {
        throw new Error(`A config already exists at ${configPath}.`);
      }

      // The load of verse may have failed, but still have an existing model index file.
      // We should prefer that the dev makes necessary adjustments. We should not overwrite it.
      const modelPath = `${cwd}/src/model/index.ts`;
      if (fs.existsSync(modelPath)) {
        throw new Error(`A file already exists at ${modelPath}.`);
      }

      fs.mkdirSync(`${cwd}/src/model`, { recursive: true });
      fs.writeFileSync(
        modelPath,
        `
import { verse } from "@operativa/verse";
import { PrettyConsoleLogger } from "@operativa/verse/utils/logging";
// TODO: Import the driver for the target database.

const db = verse({
  config: {
    // TODO: Set the driver for the target database and provide any necessary configuration.
    // driver: sqlite("basic.sqlite"),
    logger: new PrettyConsoleLogger(),
  },
  model: {
    entities: {
      // TODO: Define the entities for the model.
      // todos: entity(
      //   {
      //     id: int(),
      //     title: string(),
      //     completed: boolean(),
      //   },
      //   t => {
      //     t.table("todos");
      //     t.data(
      //       { title: "My first todo", completed: true },
      //       { title: "My second todo", completed: false }
      //     );
      //   }
      // ),
    },
  },
});

export default {
  verse: db,
};
`
      );
    }
  }
}

const modelDesc = "Outputs a JSON representation of the model.";
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

    let results: readonly any[] = [];

    try {
      results = await fn(verse).toArray();
    } catch (e: any) {
      throw new Error(`Error executing query: ${e}`);
    }

    const format = (value: any) =>
      Array.isArray(value) || value instanceof Object ? JSON.stringify(value, null, " ") : value;

    let head: readonly string[] = ["0 rows"];
    let rows: readonly string[][] = [];

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
      head: head as string[],
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
  .command(new InitCommand())
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

async function loadVerse(filepath?: string) {
  const configFilename = "verse.config.ts";
  const defaultModelPath = "/src/model/index.ts";
  let module: { default: { verse?: Verse } };

  const fullpath = path.resolve(process.cwd(), filepath ?? `./${configFilename}`);
  if (fs.existsSync(fullpath)) {
    module = await import(fullpath);
  } else if (!fullpath.endsWith(defaultModelPath)) {
    module = { default: { verse: await loadVerse(`.${defaultModelPath}`) } };
  } else {
    module = { default: {} };
  }

  if (!module.default.verse || !(module.default.verse instanceof Verse)) {
    throw new Error("No verse instance found.");
  }

  return module.default.verse as Verse;
}
