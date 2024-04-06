// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols

/**
 * Implements a fluent query API for querying entities in a database.
 *
 * @packageDocumentation
 */

import { Newable } from "ts-essentials";
import { QueryCache } from "../uow.js";
import { Brand } from "../utils/utils.js";
import { Entities, From, QueryOptions, Verse } from "../verse.js";
import { QueryCompiler } from "./compiler.js";
import { constant, EntityExpression } from "./expression.js";
import { Expression, parse } from "./parser.js";

declare global {
  interface String {
    /**
     * Query expression analog of the SQL LIKE operator.
     *
     * @param pattern The pattern to match.
     * @returns `true` if the string matches the pattern, otherwise `false`.
     *
     * @example
     * const q = db.from.albums.where(a => a.title.like("M%"));
     */
    like(pattern: string): boolean;
  }

  interface Array<T> {
    /**
     * Used to specify eager loading of related entities in queries.
     *
     * @param navigation The navigation property to be loaded.
     * @returns The queryable result of the eager loading operation.
     *
     * @example
     * const q =
     *   db.from.genres
     *     .with(a => a.tracks.with(t => t.album))
     *     .where(g => g.name === "Jazz");
     */
    with<S>(navigation: (obj: T) => S): S;
  }
}

/**
 * Represents a grouping of objects based on a key within a query expression.
 *
 * See {@link Queryable.groupBy} for more information.
 *
 * @template K - The type of the key.
 * @template T - The type of the objects being grouped.
 */
export interface Grouping<K, T> {
  /**
   * The key of the grouping.
   */
  readonly key: K;

  /**
   * Returns the count of elements in the group.
   *
   * @return The count of elements in the group.
   */
  count(): number;

  /**
   * Returns the minimum value of the specified expression for the group.
   *
   * @param expr The expression to be evaluated.
   * @return The minimum value of the specified expression for the group.
   */
  min(expr: Expr<(obj: T) => number>): number;

  /**
   * Returns the maximum value of the specified expression for the group.
   *
   * @param expr The expression to be evaluated.
   * @return The maximum value of the specified expression for the group.
   */
  max(expr: Expr<(obj: T) => number>): number;

  /**
   * Returns the sum of the specified expression for the group.
   *
   * @param expr The expression to be evaluated.
   * @return The sum of the specified expression for the group.
   */
  sum(expr: Expr<(obj: T) => number>): number;

  /**
   * Returns the average value of the specified expression for the group.
   *
   * @param expr The expression to be evaluated.
   * @return The average value of the specified expression for the group.
   */
  avg(expr: Expr<(obj: T) => number>): number;

  /**
   * Returns an array of the objects in the group.
   *
   * @return An array of the objects in the group.
   */
  array<S>(expr?: Expr<(obj: T) => S>): S[];
}

/** @ignore */
export const __expr = Symbol("__expr");

/**
 * Represents an asynchronous sequence of elements.
 *
 * @template T The type of elements in the sequence.
 */
export interface AsyncSequence<T> extends AsyncIterable<T> {
  /**
   * Buffers the sequence into an array of type T.
   *
   * @return A promise that resolves with an array of type T.
   */
  toArray(): Promise<T[]>;
}

type Expr<E> = E extends (...args: readonly [infer H, ...infer T]) => infer R
  ? H extends JoinResult<infer K>
    ? (...args: readonly [...K, ...T]) => R
    : E
  : E;

/**
 * Represents the result of a join operation.
 */
export type JoinResult<T extends readonly unknown[]> = Brand<T, "join-result">;

/**
 * Represents a join condition used when joining two sequences.
 */
export type JoinCondition<T, S> = Expr<(left: T, right: S) => boolean>;

/**
 * Represents a predicate expression used to filter a sequence.
 */
export type AsyncPredicateExpr<E extends Entities, T, A extends unknown[] = []> = Expr<
  (obj: T, ...args: readonly [...A, From<E>]) => boolean
>;

export type PredicateExpr<T, A extends unknown[] = []> = Expr<(obj: T, ...args: A) => boolean>;

/**
 * Represents a numeric expression used in an aggregate query.
 */
export type NumericExpr<T> = Expr<(obj: T) => number>;

/**
 * Fluent query operators used when constructing compiled queries.
 *
 * A compiled query can be created using the {@link Verse.compile} or {@link Verse.compileUow} methods.
 *
 * @template T The type of the entity being queried.
 *
 * @example
 * const query = db.compile((from, $name: string) =>
 *   from.customers.where(c => c.name === $name).single());
 *
 * const customer = await query("ACME Corp.");
 */
export class Queryable<T> {
  /**
   * Projects each element of a sequence into a new form.
   *
   * @param projector A function that transforms the input element.
   * @returns The queryable result of the select operation.
   */
  // @ts-ignore
  select<P extends Expr<(obj: T) => unknown>>(projector: P) {
    return this as unknown as Queryable<ReturnType<P>>;
  }

  /**
   * Used to specify eager loading of related entities in queries.
   *
   * @param navigation The navigation property to be loaded.
   * @returns The queryable result of the with operation.
   */
  // @ts-ignore
  with<S>(navigation: Expr<(obj: T) => S>) {
    return this;
  }

  /**
   * Removes duplicate elements from the sequence.
   *
   * @returns The queryable result of the distinct operation.
   */
  distinct() {
    return this;
  }

  /**
   * Joins the sequence with another sequence based on a condition.
   *
   * @param entityOrQuery The entity or query to join with.
   * @param condition The join condition.
   * @returns The queryable result of the join operation.
   */
  // @ts-ignore
  join<S, C extends JoinCondition<T, S>>(entityOrQuery: Newable<S> | Queryable<S>, condition: C) {
    return this as Queryable<JoinResult<Parameters<C>>>;
  }

  /**
   * Left joins the sequence with another sequence based on a condition.
   *
   * @param entityOrQuery The entity or query to join with.
   * @param condition The join condition.
   * @returns The queryable result of the join operation.
   */
  leftJoin<S, C extends JoinCondition<T, S>>(
    // @ts-ignore
    entityOrQuery: Newable<S> | Queryable<S>,
    // @ts-ignore
    condition: C
  ) {
    return this as Queryable<JoinResult<Parameters<C>>>;
  }

  /**
   * Filters a sequence of values based on a predicate.
   *
   * @param predicate A function to test each element for a condition.
   * @returns The queryable result of the where operation.
   */
  // @ts-ignore
  where<P extends PredicateExpr<T>>(predicate: P) {
    return this;
  }

  /**
   * Sorts the elements of a sequence in ascending order.
   *
   * @param expr A function to extract a sort key from an element.
   * @returns The queryable result of the orderBy operation.
   */
  // @ts-ignore
  orderBy<E extends Expr<(obj: T) => unknown>>(expr: E) {
    return this;
  }

  /**
   * Sorts the elements of a sequence in descending order.
   *
   * @param expr A function to extract a sort key from an element.
   * @returns The queryable result of the orderByDesc operation.
   */
  // @ts-ignore
  orderByDesc<E extends Expr<(obj: T) => unknown>>(expr: E) {
    return this;
  }

  /**
   * Groups the elements of a sequence according to a specified key selector function.
   *
   * @param key A function to extract the key for each element.
   * @returns The result of the groupBy operation.
   */
  groupBy<K extends Expr<(obj: T) => unknown>>(
    key: K
  ): Queryable<{ key: ReturnType<K>; items: T[] }>;

  /**
   * Groups the elements of a sequence according to a specified key selector function and
   * creates a result value from each group.
   *
   * @param key A function to extract the key for each element.
   * @param result A function to create a result value from each group.
   * @returns The queryable result of the groupBy operation.
   */
  groupBy<K extends Expr<(obj: T) => unknown>, R>(
    key: K,
    result: (param: Grouping<ReturnType<K>, T>) => R
  ): Queryable<R>;

  // @ts-ignore
  groupBy<K, R>(key: (obj: T) => K, result?: (param: Grouping<K, T>) => R) {
    return this as unknown as Queryable<R>;
  }

  /**
   * Returns a specified number of contiguous elements from the start of a sequence.
   *
   * @param limit The number of elements to return.
   * @returns The queryable result of the limit operation.
   */
  // @ts-ignore
  limit(limit: number) {
    return this;
  }

  /**
   * Skips a specified number of elements in a sequence and then returns the remaining elements.
   *
   * @param offset The number of elements to skip.
   * @returns The queryable result of the offset operation.
   */
  // @ts-ignore
  offset(offset: number) {
    return this;
  }

  /**
   * Determines whether any element of a sequence satisfies a condition.
   *
   * @param predicate A function to test each element for a condition.
   * @returns `true` if any elements in the sequence satisfy the condition, otherwise `false`.
   */
  // @ts-ignore
  any<P extends PredicateExpr<T>>(predicate?: P) {
    return false;
  }

  /**
   * Determines whether all elements of a sequence satisfy a condition.
   *
   * @param predicate A function to test each element for a condition.
   * @returns `true` if all elements in the sequence satisfy the condition, otherwise `false`.
   */
  // @ts-ignore
  all<P extends PredicateExpr<T>>(predicate: P) {
    return false;
  }

  /**
   * Returns the first element of a sequence that satisfies a specified condition.
   *
   * @param predicate A function to test each element for a condition.
   * @returns The first element in the sequence that satisfies the condition.
   * @throws Error, if no such element is found.
   */
  // @ts-ignore
  first<P extends PredicateExpr<T>>(predicate?: P) {
    return this as unknown as T;
  }

  /**
   * Returns the first element of a sequence that satisfies a specified condition, or `undefined`
   * if no such element is found.
   *
   * @param predicate A function to test each element for a condition.
   */
  // @ts-ignore
  maybeFirst<P extends PredicateExpr<T>>(predicate?: P) {
    return this as unknown as T | undefined;
  }

  /**
   * Returns the only element of a sequence that satisfies a specified condition.
   *
   * @param predicate A function to test each element for a condition.
   * @returns The only element in the sequence that satisfies the condition.
   * @throws Error, if no such element is found, or multiple elements satisfy the condition.
   */
  // @ts-ignore
  single<P extends PredicateExpr<T>>(predicate?: P) {
    return this as unknown as T;
  }

  /**
   * Returns the only element of a sequence that satisfies a specified condition, or `undefined`
   * if no such element is found.
   *
   * @param predicate A function to test each element for a condition.
   * @returns The only element in the sequence that satisfies the condition, or `undefined` if no such element is found.
   * @throws Error, if multiple elements satisfy the condition.
   */
  // @ts-ignore
  maybeSingle<P extends PredicateExpr<T>>(predicate?: P) {
    return this as unknown as T | undefined;
  }

  /**
   * Returns the number of elements in the sequence.
   *
   * @returns The number of elements in the sequence.
   */
  // @ts-ignore
  count() {
    return this as unknown as number;
  }

  /**
   * Returns the minimum value of the specified numerical expression for the sequence.
   * @param expr The numerical expression to be evaluated.
   * @returns The minimum value of the specified numerical expression for the sequence.
   */
  // @ts-ignore
  min(expr?: NumericExpr<T>) {
    return this as unknown as number;
  }

  /**
   * Returns the maximum value of the specified numerical expression for the sequence.
   * @param expr The numerical expression to be evaluated.
   * @returns The maximum value of the specified numerical expression for the sequence.
   */
  // @ts-ignore
  max(expr?: NumericExpr<T>) {
    return this as unknown as number;
  }

  /**
   * Returns the sum of the specified numerical expression for the sequence.
   * @param expr The numerical expression to be evaluated.
   * @returns The sum of the specified numerical expression for the sequence.
   */
  // @ts-ignore
  sum(expr?: NumericExpr<T>) {
    return this as unknown as number;
  }

  /**
   * Returns the average value of the specified numerical expression for the sequence.
   * @param expr The numerical expression to be evaluated.
   * @returns The average value of the specified numerical expression for the sequence.
   */
  // @ts-ignore
  avg(expr?: NumericExpr<T>) {
    return this as unknown as number;
  }

  /**
   * Aggregates the elements of the sequence into an array.
   * @returns An array of the elements in the sequence.
   */
  array() {
    return this as Queryable<T[]>;
  }
}

/**
 * Fluent query operators that must appear at the root of a compiled query expression.
 *
 * @template T The type of the entity being queried.
 */
export class QueryableRoot<T> extends Queryable<T> {
  /**
   * Inject a raw SQL query using tagged template literals. The returned queryable may be further
   * composed with additional query operators.
   *
   * @example
   * const query = db.compile(from => from.albums.sql`select * from "Album"`);
   * const albums = await query.toArray()
   *
   * @param strings The SQL query template string.
   * @param values The values to be inserted into the query.
   * @returns The queryable result of the injected SQL query.
   */
  // @ts-ignore
  sql(strings: TemplateStringsArray, ...values: readonly any[]) {
    return this;
  }

  /**
   * Set query options that affect the behaviour of the query.
   *
   * @example
   * const query =
   *   db.compile(from =>
   *     from.albums.options({ disabledConditions: ["soft delete"] }));
   *
   * @param options The query options.
   * @returns The queryable with the specified options applied.
   */
  // @ts-ignore
  options(options: QueryOptions) {
    return this;
  }
}

/**
 * Fluent query operators used when constructing queries.
 *
 * A query can be created by accessing entity sets exposed by the {@link Verse.from} property.
 *
 * @template T The type of the entity being queried.
 *
 * @example
 * const customer =
 *   await db.from.customers
 *     .where(c => c.name === "ACME Corp.")
 *     .single();
 */
export class AsyncQueryable<T, E extends Entities> implements AsyncSequence<T> {
  #compiler: QueryCompiler;
  #expression: Expression;

  /** @ignore */
  constructor(entity: string, compiler: QueryCompiler) {
    this.#compiler = compiler;
    this.#expression = { type: "EntityExpression", name: entity } as EntityExpression;
  }

  /**
   * Projects each element of a sequence into a new form.
   *
   * @param projector A function that transforms the input element.
   * @param args Additional arguments to be passed to the projector.
   * @returns The queryable result of the select operation.
   */
  select<
    P extends Expr<(obj: T, ...args: readonly [...A, From<E>]) => unknown>,
    A extends unknown[],
  >(projector: P, ...args: A) {
    this.op("select", parse(projector.toString()), args);

    return this as unknown as AsyncQueryable<ReturnType<P>, E>;
  }

  /**
   * Used to specify eager loading of related entities in queries.
   *
   * @param navigation The navigation property to be loaded.
   * @returns The queryable result of the with operation.
   */
  with<S>(navigation: Expr<(obj: T) => S>) {
    this.op("with", parse(navigation.toString()));

    return this;
  }

  /**
   * Removes duplicate elements from the sequence.
   *
   * @returns The queryable result of the distinct operation.
   */
  distinct() {
    this.op("distinct");

    return this;
  }

  /**
   * Joins the sequence with another sequence based on a condition.
   *
   * @param entityOrQuery The entity or query to join with.
   * @param condition The join condition.
   * @returns The queryable result of the join operation.
   */
  join<S, C extends JoinCondition<T, S>>(
    entityOrQuery: Newable<S> | AsyncQueryable<S, E>,
    condition: C
  ) {
    this.op("join", [
      entityOrQuery instanceof AsyncQueryable
        ? entityOrQuery.#expression
        : ({ type: "EntityExpression", name: entityOrQuery.name } as EntityExpression),
      parse(condition.toString()),
    ]);

    return this as AsyncQueryable<JoinResult<Parameters<C>>, E>;
  }

  /**
   * Left joins the sequence with another sequence based on a condition.
   *
   * @param entityOrQuery The entity or query to join with.
   * @param condition The join condition.
   * @returns The queryable result of the join operation.
   */
  leftJoin<S, C extends JoinCondition<T, S>>(
    entityOrQuery: Newable<S> | AsyncQueryable<S, E>,
    condition: C
  ) {
    this.op("leftJoin", [
      entityOrQuery instanceof AsyncQueryable
        ? entityOrQuery.#expression
        : ({ type: "EntityExpression", name: entityOrQuery.name } as EntityExpression),
      parse(condition.toString()),
    ]);

    return this as AsyncQueryable<JoinResult<Parameters<C>>, E>;
  }

  /**
   * Filters a sequence of values based on a predicate.
   *
   * @param predicate A function to test each element for a condition.
   * @param args Additional arguments to be passed to the predicate.
   * @returns The queryable result of the where operation.
   */
  where<P extends AsyncPredicateExpr<E, T, A>, A extends unknown[]>(predicate: P, ...args: A) {
    this.op("where", parse(predicate.toString()), args);

    return this;
  }

  /**
   * Sorts the elements of a sequence in ascending order.
   *
   * @param expr A function to extract a sort key from an element.
   * @param args Additional arguments to be passed to the expression.
   * @returns The queryable result of the orderBy operation.
   */
  orderBy<E extends Expr<(obj: T, ...args: A) => unknown>, A extends unknown[]>(
    expr: E,
    ...args: A
  ) {
    this.op("orderBy", parse(expr.toString()), args);

    return this;
  }

  /**
   * Sorts the elements of a sequence in descending order.
   *
   * @param expr A function to extract a sort key from an element.
   * @param args Additional arguments to be passed to the expression.
   * @returns The queryable result of the orderByDesc operation.
   */
  orderByDesc<E extends Expr<(obj: T, ...args: A) => unknown>, A extends unknown[]>(
    expr: E,
    ...args: A
  ) {
    this.op("orderByDesc", parse(expr.toString()), args);

    return this;
  }

  /**
   * Groups the elements of a sequence according to a specified key selector function.
   *
   * @param key A function to extract the key for each element.
   * @returns The result of the groupBy operation.
   */
  groupBy<K extends Expr<(obj: T) => unknown>>(
    key: K
  ): AsyncQueryable<{ key: ReturnType<K>; items: T[] }, E>;

  /**
   * Groups the elements of a sequence according to a specified key selector function and
   * creates a result value from each group.
   *
   * @param key A function to extract the key for each element.
   * @param result A function to create a result value from each group.
   * @returns The queryable result of the groupBy operation.
   */
  groupBy<K extends Expr<(obj: T) => unknown>, R>(
    key: K,
    result: (param: Grouping<ReturnType<K>, T>) => R
  ): AsyncQueryable<R, E>;

  groupBy<K, R>(key: (obj: T) => K, result?: (param: Grouping<K, T>) => R) {
    const expressions = [parse(key.toString())];

    if (result) {
      expressions.push(parse(result.toString()));
    }

    this.op("groupBy", expressions);

    return this as unknown as AsyncQueryable<R, E>;
  }

  /**
   * Returns a specified number of contiguous elements from the start of a sequence.
   *
   * @param limit The number of elements to return.
   * @returns The queryable result of the limit operation.
   */
  limit(limit: number) {
    this.op("limit", this.#scalar(limit, "limit"));

    return this;
  }

  /**
   * Skips a specified number of elements in a sequence and then returns the remaining elements.
   *
   * @param offset The number of elements to skip.
   * @returns The queryable result of the offset operation.
   */
  offset(offset: number) {
    this.op("offset", this.#scalar(offset, "offset"));

    return this;
  }

  /**
   * Determines whether a sequence contains any elements.
   *
   * @returns A promise that resolves with `true` if the sequence contains any elements, otherwise `false`.
   */
  any(): Promise<boolean>;

  /**
   * Determines whether any element of a sequence satisfies a condition.
   *
   * @param predicate A function to test each element for a condition.
   * @param args Additional arguments to be passed to the predicate.
   * @returns A promise that resolves with `true` if any elements in the sequence satisfy the condition, otherwise `false`.
   */
  any<P extends PredicateExpr<T, A>, A extends unknown[]>(
    predicate: P,
    ...args: A
  ): Promise<boolean>;

  any<P extends PredicateExpr<T, A>, A extends unknown[]>(predicate?: P, ...args: A) {
    this.op("any", predicate ? parse(predicate.toString()) : undefined, args);

    return this.#executeOne<boolean>();
  }

  /**
   * Determines whether all elements of a sequence satisfy a condition.
   *
   * @param predicate A function to test each element for a condition.
   * @param args Additional arguments to be passed to the predicate.
   * @returns A promise that resolves with `true` if all elements in the sequence satisfy the condition, otherwise `false`.
   */
  all<P extends PredicateExpr<T, A>, A extends unknown[]>(predicate: P, ...args: A) {
    this.op("all", parse(predicate.toString()), args);

    return this.#executeOne<boolean>();
  }

  /**
   * Returns the first element of a sequence.
   *
   * @returns A promise that resolves with the first element in the sequence.
   * @throws Error, if no such element is found.
   */
  first(): Promise<T>;

  /**
   * Returns the first element of a sequence that satisfies a specified condition.
   *
   * @param predicate A function to test each element for a condition.
   * @param args Additional arguments to be passed to the predicate.
   * @returns A promise that resolves with the first element in the sequence that satisfies the condition.
   * @throws Error, if no such element is found.
   */
  first<P extends PredicateExpr<T, A>, A extends unknown[]>(predicate?: P, ...args: A): Promise<T>;

  first<P extends PredicateExpr<T, A>, A extends unknown[]>(predicate?: P, ...args: A) {
    this.op("first", predicate ? parse(predicate.toString()) : undefined, args);

    return this.#executeOne<T>();
  }

  /**
   * Returns the first element of a sequence, or `undefined` if no such element is found.
   *
   * @returns A promise that resolves with the first element in the sequence,
   * or `undefined` if no such element is found.
   */
  maybeFirst(): Promise<T | undefined>;

  /**
   * Returns the first element of a sequence that satisfies a specified condition, or `undefined`
   * if no such element is found.
   *
   * @param predicate A function to test each element for a condition.
   * @param args Additional arguments to be passed to the predicate.
   * @returns A promise that resolves with the first element in the sequence that satisfies the condition,
   * or `undefined` if no such element is found.
   */
  maybeFirst<P extends PredicateExpr<T, A>, A extends unknown[]>(
    predicate?: P,
    ...args: A
  ): Promise<T | undefined>;

  maybeFirst<P extends PredicateExpr<T, A>, A extends unknown[]>(predicate?: P, ...args: A) {
    this.op("maybeFirst", predicate ? parse(predicate.toString()) : undefined, args);

    return this.#executeOne<T | undefined>();
  }

  /**
   * Returns the only element of a sequence.
   *
   * @returns A promise that resolves with the only element in the sequence.
   * @throws Error, if no such element is found, or there are multiple elements in the sequence.
   */
  single(): Promise<T>;

  /**
   * Returns the only element of a sequence that satisfies a specified condition.
   *
   * @param predicate A function to test each element for a condition.
   * @param args Additional arguments to be passed to the predicate.
   * @returns A promise that resolves with the only element in the sequence that satisfies the condition.
   * @throws Error, if no such element is found, or multiple elements satisfy the condition.
   */
  single<P extends PredicateExpr<T, A>, A extends unknown[]>(predicate?: P, ...args: A): Promise<T>;

  single<P extends PredicateExpr<T, A>, A extends unknown[]>(predicate?: P, ...args: A) {
    this.op("single", predicate ? parse(predicate.toString()) : undefined, args);

    return this.#executeOne<T>();
  }

  /**
   * Returns the only element of a sequence, or `undefined` if no such element is found.
   *
   * @returns A promise that resolves with the only element in the sequence, or `undefined`
   * if no such element is found.
   * @throws Error, if multiple elements satisfy the condition.
   */
  maybeSingle(): Promise<T | undefined>;

  /**
   * Returns the only element of a sequence that satisfies a specified condition, or `undefined`
   * if no such element is found.
   *
   * @param predicate A function to test each element for a condition.
   * @param args Additional arguments to be passed to the predicate.
   * @returns A promise that resolves with the only element in the sequence that satisfies the condition, or `undefined` if no such element is found.
   * @throws Error, if multiple elements satisfy the condition.
   */
  maybeSingle<P extends PredicateExpr<T, A>, A extends unknown[]>(
    predicate?: P,
    ...args: A
  ): Promise<T | undefined>;

  maybeSingle<P extends PredicateExpr<T, A>, A extends unknown[]>(predicate?: P, ...args: A) {
    this.op("maybeSingle", predicate ? parse(predicate.toString()) : undefined, args);

    return this.#executeOne<T | undefined>();
  }

  /**
   * Returns the number of elements in the sequence.
   *
   * @returns A promise that resolves with the number of elements in the sequence.
   */
  count() {
    this.op("count");

    return this.#executeOne<number>();
  }

  /**
   * Returns the minimum value of the specified numerical expression for the sequence.
   * @param expr The numerical expression to be evaluated.
   * @returns A promise that resolves with the minimum value of the specified numerical expression for the sequence.
   */
  min(expr?: NumericExpr<T>) {
    this.op("min", expr ? parse(expr.toString()) : undefined);

    return this.#executeOne<number>();
  }

  /**
   * Returns the maximum value of the specified numerical expression for the sequence.
   * @param expr The numerical expression to be evaluated.
   * @returns A promise that resolves with the maximum value of the specified numerical expression for the sequence.
   */
  max(expr?: NumericExpr<T>) {
    this.op("max", expr ? parse(expr.toString()) : undefined);

    return this.#executeOne<number>();
  }

  /**
   * Returns the sum of the specified numerical expression for the sequence.
   * @param expr The numerical expression to be evaluated.
   * @returns A promise that resolves with the sum of the specified numerical expression for the sequence.
   */
  sum(expr?: NumericExpr<T>) {
    this.op("sum", expr ? parse(expr.toString()) : undefined);

    return this.#executeOne<number>();
  }

  /**
   * Returns the average value of the specified numerical expression for the sequence.
   * @param expr The numerical expression to be evaluated.
   * @returns A promise that resolves with the average value of the specified numerical expression for the sequence.
   */
  avg(expr?: NumericExpr<T>) {
    this.op("avg", expr ? parse(expr.toString()) : undefined);

    return this.#executeOne<number>();
  }

  /**
   * Aggregates the elements of the sequence into an array.
   * @returns The queryable result of the array operation.
   */
  array() {
    this.op("array");

    return this as AsyncQueryable<T[], E>;
  }

  /**
   * Buffers the sequence into an array of type T.
   *
   * @return A promise that resolves with an array of type T.
   */
  toArray() {
    const asyncSequence = this.execute() as AsyncSequence<T>;

    return asyncSequence.toArray();
  }

  /** @ignore */
  [__expr]() {
    return this.#expression;
  }

  /** @ignore */
  protected op(name: string, expressions?: Expression | Expression[], args?: readonly unknown[]) {
    if (!Array.isArray(expressions)) {
      expressions = expressions ? [expressions] : [];
    }

    if (args && args.length > 0) {
      expressions.push(constant(args));
    }

    this.#expression = {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        computed: false,
        object: this.#expression,
        property: {
          type: "IdentifierExpression",
          name,
        },
      },
      arguments: expressions,
    };
  }

  #scalar(value: number | { [key: string]: number }, op: string) {
    if (typeof value === "number") {
      return {
        type: "LiteralExpression",
        value,
      };
    }

    if (!value || Object.keys(value).length !== 1) {
      throw new Error(
        `Argument passed to query operator '${op}' must be a number or an object with a single key.`
      );
    }

    return {
      type: "IdentifierExpression",
      name: Object.keys(value)[0],
    };
  }

  /** @ignore */
  [Symbol.asyncIterator]() {
    const asyncSequence = this.execute() as AsyncSequence<T>;

    return asyncSequence[Symbol.asyncIterator]();
  }

  #executeOne<T>() {
    return this.execute() as Promise<T>;
  }

  protected execute(cache?: QueryCache) {
    return this.#compiler.compile(() => this)([], cache);
  }
}

/**
 * Fluent query operators that must appear at the root of a query expression.
 *
 * @template T The type of the entity being queried.
 */
export class AsyncQueryableRoot<T, E extends Entities> extends AsyncQueryable<T, E> {
  /**
   * @ignore
   */
  constructor(entity: string, compiler: QueryCompiler) {
    super(entity, compiler);
  }

  /**
   * Inject a raw SQL query using tagged template literals. The returned queryable may be further
   * composed with additional query operators.
   *
   * @example
   * const id = 1;
   * const album =
   *   db.from.albums
   *     .sql`select * from "Album" where "AlbumId" = ${id}`
   *     .single();
   *
   * @param strings The SQL query template string.
   * @param values The values to be inserted into the query.
   * @returns The queryable result of the injected SQL query.
   */
  sql(strings: TemplateStringsArray, ...values: readonly any[]) {
    this.op("sql", [constant(strings), constant(values)]);

    return this;
  }

  /**
   * Set query options that affect the behaviour of the query.
   *
   * @example
   * const q =
   *   db.from.albums.options({ disabledConditions: ["soft delete"] });
   *
   * @param options The query options.
   * @returns The queryable with the specified options applied.
   */
  options(options: QueryOptions) {
    this.op("options", constant(options));

    return this;
  }
}
