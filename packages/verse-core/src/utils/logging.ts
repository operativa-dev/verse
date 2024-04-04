/**
 * Logging utilities for the library.
 *
 * @packageDocumentation
 */

import chalk from "chalk";
import { highlight } from "cli-highlight";

/**
 * Logger interface for logging information, debugging messages, and SQL queries.
 */
export interface Logger {
  /**
   * Logs the given message at the info level.
   *
   * @param message The message to be logged.
   */
  info(message: any): void;

  /**
   * Logs the given message at the debug level.
   *
   * @param message The message to be logged.
   */
  debug(message: any): void;

  /**
   * Logs the given SQL query.
   *
   * @param sql The SQL query to be logged.
   */
  sql(sql: string): void;

  /**
   * Whether info logging is enabled.
   */
  infoEnabled: boolean;

  /**
   * Whether debug logging is enabled.
   */
  debugEnabled: boolean;
}

/**
 * Logs SQL statements and arguments using a logger.
 *
 * @param sql The SQL statement to log.
 * @param args The optional arguments to log.
 * @param logger The logger instance to use.
 */
export function logSql(sql: string, args: readonly unknown[], logger?: Logger) {
  logger?.sql(logMsg(sql, args));
}

/**
 * Logs a batch of SQL statements and arguments using a logger.
 *
 * @param statements The SQL statements to log.
 * @param logger The logger instance to use.
 */
export function logBatch(statements: { sql: string; args: readonly unknown[] }[], logger?: Logger) {
  statements.map(({ sql, args }) => logSql(sql, args, logger));
}

function logMsg(sql: string, args: readonly unknown[]) {
  return `-- Executing SQL: Parameters: [${args
    .map((p, i) => `$${i + 1}=${formatParameter(p)}`)
    .join(", ")}]\n${sql}`;
}

function formatParameter(p: any) {
  if (Buffer.isBuffer(p)) {
    return (p as Buffer).toString("hex");
  }

  return typeof p === "string" ? `'${p}'` : p;
}

/**
 * A logger that logs to the console.
 */
export class ConsoleLogger implements Logger {
  constructor(
    readonly infoEnabled: boolean = true,
    readonly debugEnabled: boolean = false
  ) {}

  info(message: any) {
    if (this.infoEnabled) {
      console.info(message);
    }
  }

  debug(message: any) {
    if (this.debugEnabled) {
      console.debug(message);
    }
  }

  sql(sql: string) {
    console.info(highlight(sql, { language: "postgres", ignoreIllegals: true }));
  }
}

/**
 * A logger that logs to the console with pretty colors.
 */
export class PrettyConsoleLogger extends ConsoleLogger {
  override info(message: any) {
    if (message.includes(" executed in:")) {
      message = chalk.yellowBright(" 🧭 " + message);
    }

    super.info(message);
  }

  override sql(sql: string) {
    const lines = sql.split(/\r?\n/);

    if (lines[0]?.startsWith("--")) {
      console.info(chalk.cyan(lines[0].replace("--", " ⚡️")));
    }

    let pretty = "";

    for (let i = 1; i < lines.length; i++) {
      let lineNum = i.toString();

      pretty +=
        `${chalk.grey(lineNum.padStart(5) + "|")} ` +
        highlight(lines[i]!, { language: "postgres", ignoreIllegals: true }) +
        "\n";
    }

    console.info(pretty.trimEnd());
  }
}

/**
 * A logger that does nothing.
 */
// noinspection JSUnusedGlobalSymbols
export class NullLogger implements Logger {
  public static readonly INSTANCE = new NullLogger();

  private constructor(
    readonly infoEnabled: boolean = false,
    readonly debugEnabled: boolean = false
  ) {}

  info(_: any) {}
  debug(_: any) {}
  sql(_: string) {}
}
