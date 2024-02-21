/**
 * The driver module provides the interface for database drivers. A driver is responsible for
 * executing SQL statements and returning the results. It also provides methods for creating
 * and dropping databases, and for checking if a database exists.
 *
 * @packageDocumentation
 */

import { List } from "immutable";
import { Convention } from "../conventions/convention.js";
import { Logger } from "../utils/logging.js";
import { SqlNode } from "./sql.js";

/**
 * An object that represents a SQL statement to be executed.
 */
export type ExecuteStatement = {
  /**
   * The SQL statement to execute.
   */
  sql: SqlNode;

  /**
   * Arguments to pass to the SQL statement.
   */
  args?: unknown[];

  /**
   * A callback function that will be called before executing the statement.
   */
  onBeforeExecute?: (args: unknown[]) => void;

  /**
   * A callback function that will be called after executing the statement.
   */
  onAfterExecute?: (result: ExecuteResult) => void;
};

/**
 * The result of an execution, containing information about the affected
 * rows and any returned values.
 */
export type ExecuteResult = {
  /**
   * The number of rows affected by the operation.
   */
  rowsAffected: number;

  /**
   * Any values returned by the operation.
   */
  returning: unknown[];
};

/**
 * Information about a driver and connection.
 */
export type DriverInfo = {
  /**
   * The driver name.
   */
  name: string;

  /**
   * The current server name.
   */
  server?: string | undefined;

  /**
   * The current database name.
   */
  database: string;
};

/**
 * The contract between Verse core and a relational database client.
 */
export interface Driver {
  /**
   * Creates a function that can execute the given SQL query with the provided arguments
   * and return an {@link AsyncIterable} of rows.
   *
   * @param sql The SQL query to execute.
   * @returns A function that can execute the given SQL query.
   *
   */
  rows(sql: SqlNode): (args: unknown[]) => AsyncIterable<unknown[]>;

  /**
   * Executes one or more SQL statements and returns the results.
   *
   * @param statements The SQL statements to execute.
   * @param isolation The isolation level for the transaction.
   * @param onBeforeCommit A callback function to be called before committing the transaction.
   *                         Receives an array of {@link ExecuteResult} objects as parameter.
   * @returns A Promise that resolves to an array of {@link ExecuteResult} objects representing the
   *          results of executing the statements.
   */
  execute(
    statements: ExecuteStatement[],
    isolation?: IsolationLevel,
    onBeforeCommit?: (results: ExecuteResult[]) => void
  ): Promise<ExecuteResult[]>;

  /**
   * Generate a SQL script for the given statements.
   *
   * @param statements The SQL statements to generate the script for.
   * @returns An array of strings representing the SQL script.
   */
  script(statements: ExecuteStatement[]): string[];

  /**
   * Checks if the target database exists.
   *
   * @returns A Promise that resolves to true if the database exists; otherwise, false.
   */
  exists(): Promise<boolean>;

  /**
   * Creates the target database.
   *
   * @returns A Promise that resolves with no value when the operation is complete.
   */
  create(): Promise<void>;

  /**
   * Drops the target database.
   *
   * @returns A Promise that resolves with no value when the operation is complete.
   */
  drop(): Promise<void>;

  /**
   * Set the {@link Logger} to be used for logging events.
   *
   * @param logger The logger instance to be used. Pass undefined to disable logging.
   */
  set logger(logger: Logger | undefined);

  /**
   * Conventions used by the driver.
   *
   * @return A list of conventions.
   */
  get conventions(): List<Convention>;

  /**
   * Retrieves the driver information.
   *
   * @returns The driver information.
   */
  get info(): DriverInfo;

  /**
   * Checks whether a table with the given name exists in the target database.
   *
   * @param name The name of the table to check.
   * @return A Promise resolving to a boolean value indicating whether the table exists.
   */
  tableExists(name: string): Promise<boolean>;
}

/**
 * Database transaction isolation levels.
 *
 * note: not all databases support all isolation levels.
 */
export type IsolationLevel =
  | "read uncommitted"
  | "read committed"
  | "repeatable read"
  | "snapshot"
  | "serializable";
