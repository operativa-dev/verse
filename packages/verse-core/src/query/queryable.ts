// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols

/**
 * Implements a fluent query API for querying entities in a database.
 *
 * @packageDocumentation
 */

import { ArrowExpression } from "@jsep-plugin/arrow";
import { Map } from "immutable";
import jsep, { Expression, Identifier } from "jsep";
import { Newable, Primitive } from "ts-essentials";
import { QueryCache } from "../uow.js";
import { Brand } from "../utils/utils.js";
import { QueryOptions, Verse } from "../verse.js";
import { QueryCompiler } from "./compiler.js";
import { EntityExpression } from "./expression.js";
import { printExpr } from "./printer.js";

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
  min(expr: (obj: T) => number): number;

  /**
   * Returns the maximum value of the specified expression for the group.
   *
   * @param expr The expression to be evaluated.
   * @return The maximum value of the specified expression for the group.
   */
  max(expr: (obj: T) => number): number;

  /**
   * Returns the sum of the specified expression for the group.
   *
   * @param expr The expression to be evaluated.
   * @return The sum of the specified expression for the group.
   */
  sum(expr: (obj: T) => number): number;

  /**
   * Returns the average value of the specified expression for the group.
   *
   * @param expr The expression to be evaluated.
   * @return The average value of the specified expression for the group.
   */
  avg(expr: (obj: T) => number): number;

  /**
   * Returns an array of the objects in the group.
   *
   * @return An array of the objects in the group.
   */
  array<S>(expr?: (obj: T) => S): S[];
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

/** @ignore */
export type Expr<E> = E extends (...args: [infer H, ...infer T]) => infer R
  ? H extends JoinResult<infer K>
    ? (...args: [...K, ...T]) => R
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
export type PredicateExpr<T, A extends unknown[] = []> = Expr<(obj: T, ...args: A) => boolean>;

/**
 * Represents a numeric expression used in an aggregate query.
 */
export type NumericExpr<T> = Expr<(obj: T) => number>;

/**
 * The base class for queryable objects.
 */
export abstract class AbstractQueryable {
  /** @ignore */
  protected expression: Expression;

  protected constructor(entity: string) {
    this.expression = { type: "EntityExpression", name: entity } as EntityExpression;
  }

  /** @ignore */
  [__expr]() {
    return this.expression;
  }

  protected op(name: string, ...args: Expression[]) {
    return {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        computed: false,
        object: this.expression,
        property: {
          type: "Identifier",
          name,
        },
      },
      arguments: args,
    };
  }

  protected scalar(value: number | { [key: string]: number }, op: string) {
    if (typeof value === "number") {
      return {
        type: "Literal",
        value,
      };
    }

    if (!value || Object.keys(value).length !== 1) {
      throw new Error(
        `Argument passed to query operator '${op}' must be a number or an object with a single key.`
      );
    }

    return {
      type: "Identifier",
      name: Object.keys(value)[0],
    };
  }
}

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
export class Queryable<T> extends AbstractQueryable implements Iterable<T> {
  /**
   * @ignore
   */
  constructor(entity: string) {
    super(entity);
  }

  /**
   * Projects each element of a sequence into a new form.
   *
   * @param projector A function that transforms the input element.
   * @returns The queryable result of the select operation.
   */
  select<P extends Expr<(obj: T) => unknown>>(projector: P) {
    this.expression = this.op("select", jsep(projector.toString()));

    return this as unknown as Queryable<ReturnType<P>>;
  }

  /**
   * Used to specify eager loading of related entities in queries.
   *
   * @param navigation The navigation property to be loaded.
   * @returns The queryable result of the with operation.
   */
  with<S>(navigation: Expr<(obj: T) => S>) {
    this.expression = this.op("with", jsep(navigation.toString()));

    return this;
  }

  /**
   * Removes duplicate elements from the sequence.
   *
   * @returns The queryable result of the distinct operation.
   */
  distinct() {
    this.expression = this.op("distinct");

    return this;
  }

  /**
   * Joins the sequence with another sequence based on a condition.
   *
   * @param entityOrQuery The entity or query to join with.
   * @param condition The join condition.
   * @returns The queryable result of the join operation.
   */
  join<S, C extends JoinCondition<T, S>>(entityOrQuery: Newable<S> | Queryable<S>, condition: C) {
    this.expression = this.op(
      "join",
      entityOrQuery instanceof Queryable
        ? entityOrQuery.expression
        : ({ type: "EntityExpression", name: entityOrQuery.name } as EntityExpression),
      jsep(condition.toString())
    );

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
    entityOrQuery: Newable<S> | Queryable<S>,
    condition: C
  ) {
    this.expression = this.op(
      "leftJoin",
      entityOrQuery instanceof Queryable
        ? entityOrQuery.expression
        : ({ type: "EntityExpression", name: entityOrQuery.name } as EntityExpression),
      jsep(condition.toString())
    );

    return this as Queryable<JoinResult<Parameters<C>>>;
  }

  /**
   * Filters a sequence of values based on a predicate.
   *
   * @param predicate A function to test each element for a condition.
   * @returns The queryable result of the where operation.
   */
  where<P extends PredicateExpr<T>>(predicate: P) {
    this.expression = this.op("where", jsep(predicate.toString()));

    return this;
  }

  /**
   * Sorts the elements of a sequence in ascending order.
   *
   * @param expr A function to extract a sort key from an element.
   * @returns The queryable result of the orderBy operation.
   */
  orderBy<E extends Expr<(obj: T) => unknown>>(expr: E) {
    this.expression = this.op("orderBy", jsep(expr.toString()));

    return this;
  }

  /**
   * Sorts the elements of a sequence in descending order.
   *
   * @param expr A function to extract a sort key from an element.
   * @returns The queryable result of the orderByDesc operation.
   */
  orderByDesc<E extends Expr<(obj: T) => unknown>>(expr: E) {
    this.expression = this.op("orderByDesc", jsep(expr.toString()));

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

  groupBy<K, R>(key: (obj: T) => K, result?: (param: Grouping<K, T>) => R) {
    const r = result ?? ((g: Grouping<K, T>) => ({ key: g.key, items: g.array(x => x) }));

    this.expression = this.op("groupBy", jsep(key.toString()), jsep(r.toString()));

    return this as unknown as Queryable<R>;
  }

  /**
   * Returns a specified number of contiguous elements from the start of a sequence.
   *
   * @param limit The number of elements to return.
   * @returns The queryable result of the limit operation.
   */
  limit(limit: number | { [key: string]: number }) {
    this.expression = this.op("limit", this.scalar(limit, "limit"));

    return this;
  }

  /**
   * Skips a specified number of elements in a sequence and then returns the remaining elements.
   *
   * @param offset The number of elements to skip.
   * @returns The queryable result of the offset operation.
   */
  offset(offset: number | { [key: string]: number }) {
    this.expression = this.op("offset", this.scalar(offset, "offset"));

    return this;
  }

  /**
   * Determines whether any element of a sequence satisfies a condition.
   *
   * @param predicate A function to test each element for a condition.
   * @returns `true` if any elements in the sequence satisfy the condition, otherwise `false`.
   */
  any<P extends PredicateExpr<T>>(predicate?: P) {
    this.expression = this.op("any", ...(predicate ? [jsep(predicate.toString())] : []));

    return false;
  }

  /**
   * Determines whether all elements of a sequence satisfy a condition.
   *
   * @param predicate A function to test each element for a condition.
   * @returns `true` if all elements in the sequence satisfy the condition, otherwise `false`.
   */
  all<P extends PredicateExpr<T>>(predicate: P) {
    this.expression = this.op("all", jsep(predicate.toString()));

    return false;
  }

  /**
   * Returns the first element of a sequence that satisfies a specified condition.
   *
   * @param predicate A function to test each element for a condition.
   * @returns The first element in the sequence that satisfies the condition.
   * @throws Error, if no such element is found.
   */
  first<P extends PredicateExpr<T>>(predicate?: P) {
    this.expression = this.op("first", ...(predicate ? [jsep(predicate.toString())] : []));

    return this as unknown as T;
  }

  /**
   * Returns the first element of a sequence that satisfies a specified condition, or `undefined`
   * if no such element is found.
   *
   * @param predicate A function to test each element for a condition.
   */
  maybeFirst<P extends PredicateExpr<T>>(predicate?: P) {
    this.expression = this.op("maybeFirst", ...(predicate ? [jsep(predicate.toString())] : []));

    return this as unknown as T | undefined;
  }

  /**
   * Returns the only element of a sequence that satisfies a specified condition.
   *
   * @param predicate A function to test each element for a condition.
   * @returns The only element in the sequence that satisfies the condition.
   * @throws Error, if no such element is found, or multiple elements satisfy the condition.
   */
  single<P extends PredicateExpr<T>>(predicate?: P) {
    this.expression = this.op("single", ...(predicate ? [jsep(predicate.toString())] : []));

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
  maybeSingle<P extends PredicateExpr<T>>(predicate?: P) {
    this.expression = this.op("maybeSingle", ...(predicate ? [jsep(predicate.toString())] : []));

    return this as unknown as T | undefined;
  }

  /**
   * Returns the number of elements in the sequence.
   *
   * @returns The number of elements in the sequence.
   */
  count() {
    this.expression = this.op("count");

    return this as unknown as number;
  }

  /**
   * Returns the minimum value of the specified numerical expression for the sequence.
   * @param expr The numerical expression to be evaluated.
   * @returns The minimum value of the specified numerical expression for the sequence.
   */
  min(expr: NumericExpr<T>) {
    this.expression = this.op("min", jsep(expr.toString()));

    return this as unknown as number;
  }

  /**
   * Returns the maximum value of the specified numerical expression for the sequence.
   * @param expr The numerical expression to be evaluated.
   * @returns The maximum value of the specified numerical expression for the sequence.
   */
  max(expr: NumericExpr<T>) {
    this.expression = this.op("max", jsep(expr.toString()));

    return this as unknown as number;
  }

  /**
   * Returns the sum of the specified numerical expression for the sequence.
   * @param expr The numerical expression to be evaluated.
   * @returns The sum of the specified numerical expression for the sequence.
   */
  sum(expr: NumericExpr<T>) {
    this.expression = this.op("sum", jsep(expr.toString()));

    return this as unknown as number;
  }

  /**
   * Returns the average value of the specified numerical expression for the sequence.
   * @param expr The numerical expression to be evaluated.
   * @returns The average value of the specified numerical expression for the sequence.
   */
  avg(expr: NumericExpr<T>) {
    this.expression = this.op("avg", jsep(expr.toString()));

    return this as unknown as number;
  }

  /**
   * Aggregates the elements of the sequence into an array.
   * @returns An array of the elements in the sequence.
   */
  array() {
    this.expression = this.op("array");

    return this as Queryable<T[]>;
  }

  /**
   * @ignore
   */
  [Symbol.iterator]() {
    return undefined as any as Iterator<T>;
  }
}

/**
 * Fluent query operators that must appear at the root of a compiled query expression.
 *
 * @template T The type of the entity being queried.
 */
export class QueryableRoot<T> extends Queryable<T> {
  /**
   * @ignore
   */
  constructor(entity: string) {
    super(entity);
  }

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
  sql(strings: TemplateStringsArray, ...values: any[]) {
    this.expression = this.op("sql", constant(strings), constant(values));

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
  options(options: QueryOptions) {
    this.expression = this.op("configure", constant(options));

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
export class AsyncQueryable<T> extends AbstractQueryable implements AsyncSequence<T> {
  #compiler: QueryCompiler;

  /**
   * @ignore
   */
  constructor(entity: string, compiler: QueryCompiler) {
    super(entity);
    this.#compiler = compiler;
  }

  /**
   * Projects each element of a sequence into a new form.
   *
   * @param projector A function that transforms the input element.
   * @param args Additional arguments to be passed to the projector.
   * @returns The queryable result of the select operation.
   */
  select<P extends Expr<(obj: T, ...args: A) => unknown>, A extends unknown[]>(
    projector: P,
    ...args: A
  ) {
    const expressions = this.#curry(jsep(projector.toString()), args as Primitive[]);

    this.expression = this.op("select", ...expressions);

    return this as unknown as AsyncQueryable<ReturnType<P>>;
  }

  /**
   * Used to specify eager loading of related entities in queries.
   *
   * @param navigation The navigation property to be loaded.
   * @returns The queryable result of the with operation.
   */
  with<S>(navigation: Expr<(obj: T) => S>) {
    this.expression = this.op("with", jsep(navigation.toString()));

    return this;
  }

  /**
   * Removes duplicate elements from the sequence.
   *
   * @returns The queryable result of the distinct operation.
   */
  distinct() {
    this.expression = this.op("distinct");

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
    entityOrQuery: Newable<S> | AsyncQueryable<S>,
    condition: C
  ) {
    this.expression = this.op(
      "join",
      entityOrQuery instanceof AsyncQueryable
        ? entityOrQuery.expression
        : ({ type: "EntityExpression", name: entityOrQuery.name } as EntityExpression),
      jsep(condition.toString())
    );

    return this as AsyncQueryable<JoinResult<Parameters<C>>>;
  }

  /**
   * Left joins the sequence with another sequence based on a condition.
   *
   * @param entityOrQuery The entity or query to join with.
   * @param condition The join condition.
   * @returns The queryable result of the join operation.
   */
  leftJoin<S, C extends JoinCondition<T, S>>(
    entityOrQuery: Newable<S> | AsyncQueryable<S>,
    condition: C
  ) {
    this.expression = this.op(
      "leftJoin",
      entityOrQuery instanceof AsyncQueryable
        ? entityOrQuery.expression
        : ({ type: "EntityExpression", name: entityOrQuery.name } as EntityExpression),
      jsep(condition.toString())
    );

    return this as AsyncQueryable<JoinResult<Parameters<C>>>;
  }

  /**
   * Filters a sequence of values based on a predicate.
   *
   * @param predicate A function to test each element for a condition.
   * @param args Additional arguments to be passed to the predicate.
   * @returns The queryable result of the where operation.
   */
  where<P extends PredicateExpr<T, A>, A extends unknown[]>(predicate: P, ...args: A) {
    const expr = jsep(predicate.toString());
    const expressions = this.#curry(expr, args as Primitive[]);

    this.expression = this.op("where", ...expressions);

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
    const expressions = this.#curry(jsep(expr.toString()), args as Primitive[]);

    this.expression = this.op("orderBy", ...expressions);

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
    const expressions = this.#curry(jsep(expr.toString()), args as Primitive[]);

    this.expression = this.op("orderByDesc", ...expressions);

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
  ): AsyncQueryable<{ key: ReturnType<K>; items: T[] }>;

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
  ): AsyncQueryable<R>;

  groupBy<K, R>(key: (obj: T) => K, result?: (param: Grouping<K, T>) => R) {
    const r = result ?? ((g: Grouping<K, T>) => ({ key: g.key, items: g.array(x => x) }));

    this.expression = this.op("groupBy", jsep(key.toString()), jsep(r.toString()));

    return this as unknown as AsyncQueryable<R>;
  }

  /**
   * Returns a specified number of contiguous elements from the start of a sequence.
   *
   * @param limit The number of elements to return.
   * @returns The queryable result of the limit operation.
   */
  limit(limit: number | { [key: string]: number }) {
    this.expression = this.op("limit", this.scalar(limit, "limit"));

    return this;
  }

  /**
   * Skips a specified number of elements in a sequence and then returns the remaining elements.
   *
   * @param offset The number of elements to skip.
   * @returns The queryable result of the offset operation.
   */
  offset(offset: number | { [key: string]: number }) {
    this.expression = this.op("offset", this.scalar(offset, "offset"));

    return this;
  }

  /**
   * Determines whether any element of a sequence satisfies a condition.
   *
   * @param predicate A function to test each element for a condition.
   * @param args Additional arguments to be passed to the predicate.
   * @returns A promise that resolves with `true` if any elements in the sequence satisfy the condition, otherwise `false`.
   */
  any<P extends PredicateExpr<T, A>, A extends unknown[]>(predicate?: P, ...args: A) {
    const expressions = predicate
      ? this.#curry(jsep(predicate.toString()), args as Primitive[])
      : [];

    this.expression = this.op("any", ...expressions);

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
    const expressions = this.#curry(jsep(predicate.toString()), args as Primitive[]);

    this.expression = this.op("all", ...expressions);

    return this.#executeOne<boolean>();
  }

  /**
   * Returns the first element of a sequence that satisfies a specified condition.
   *
   * @param predicate A function to test each element for a condition.
   * @param args Additional arguments to be passed to the predicate.
   * @returns A promise that resolves with the first element in the sequence that satisfies the condition.
   * @throws Error, if no such element is found.
   */
  first<P extends PredicateExpr<T, A>, A extends unknown[]>(predicate?: P, ...args: A) {
    const expressions = predicate
      ? this.#curry(jsep(predicate.toString()), args as Primitive[])
      : [];

    this.expression = this.op("first", ...expressions);

    return this.#executeOne<T>();
  }

  /**
   * Returns the first element of a sequence that satisfies a specified condition, or `undefined`
   * if no such element is found.
   *
   * @param predicate A function to test each element for a condition.
   * @param args Additional arguments to be passed to the predicate.
   * @returns A promise that resolves with the first element in the sequence that satisfies the condition, or `undefined` if no such element is found.
   */
  maybeFirst<P extends PredicateExpr<T, A>, A extends unknown[]>(predicate?: P, ...args: A) {
    const expressions = predicate
      ? this.#curry(jsep(predicate.toString()), args as Primitive[])
      : [];

    this.expression = this.op("maybeFirst", ...expressions);

    return this.#executeOne<T | undefined>();
  }

  /**
   * Returns the only element of a sequence that satisfies a specified condition.
   *
   * @param predicate A function to test each element for a condition.
   * @param args Additional arguments to be passed to the predicate.
   * @returns A promise that resolves with the only element in the sequence that satisfies the condition.
   * @throws Error, if no such element is found, or multiple elements satisfy the condition.
   */
  single<P extends PredicateExpr<T, A>, A extends unknown[]>(predicate?: P, ...args: A) {
    const expressions = predicate
      ? this.#curry(jsep(predicate.toString()), args as Primitive[])
      : [];

    this.expression = this.op("single", ...expressions);

    return this.#executeOne<T>();
  }

  /**
   * Returns the only element of a sequence that satisfies a specified condition, or `undefined`
   * if no such element is found.
   *
   * @param predicate A function to test each element for a condition.
   * @param args Additional arguments to be passed to the predicate.
   * @returns A promise that resolves with the only element in the sequence that satisfies the condition, or `undefined` if no such element is found.
   * @throws Error, if multiple elements satisfy the condition.
   */
  maybeSingle<P extends PredicateExpr<T, A>, A extends unknown[]>(predicate?: P, ...args: A) {
    const expressions = predicate
      ? this.#curry(jsep(predicate.toString()), args as Primitive[])
      : [];

    this.expression = this.op("maybeSingle", ...expressions);

    return this.#executeOne<T | undefined>();
  }

  /**
   * Returns the number of elements in the sequence.
   *
   * @returns A promise that resolves with the number of elements in the sequence.
   */
  count() {
    this.expression = this.op("count");

    return this.#executeOne<number>();
  }

  /**
   * Returns the minimum value of the specified numerical expression for the sequence.
   * @param expr The numerical expression to be evaluated.
   * @returns A promise that resolves with the minimum value of the specified numerical expression for the sequence.
   */
  min(expr: NumericExpr<T>) {
    this.expression = this.op("min", jsep(expr.toString()));

    return this.#executeOne<number>();
  }

  /**
   * Returns the maximum value of the specified numerical expression for the sequence.
   * @param expr The numerical expression to be evaluated.
   * @returns A promise that resolves with the maximum value of the specified numerical expression for the sequence.
   */
  max(expr: NumericExpr<T>) {
    this.expression = this.op("max", jsep(expr.toString()));

    return this.#executeOne<number>();
  }

  /**
   * Returns the sum of the specified numerical expression for the sequence.
   * @param expr The numerical expression to be evaluated.
   * @returns A promise that resolves with the sum of the specified numerical expression for the sequence.
   */
  sum(expr: NumericExpr<T>) {
    this.expression = this.op("sum", jsep(expr.toString()));

    return this.#executeOne<number>();
  }

  /**
   * Returns the average value of the specified numerical expression for the sequence.
   * @param expr The numerical expression to be evaluated.
   * @returns A promise that resolves with the average value of the specified numerical expression for the sequence.
   */
  avg(expr: NumericExpr<T>) {
    this.expression = this.op("avg", jsep(expr.toString()));

    return this.#executeOne<number>();
  }

  /**
   * Aggregates the elements of the sequence into an array.
   * @returns The queryable result of the array operation.
   */
  array() {
    this.expression = this.op("array");

    return this as AsyncQueryable<T[]>;
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

  /**
   * @ignore
   */
  [Symbol.asyncIterator]() {
    const asyncSequence = this.execute() as AsyncSequence<T>;

    return asyncSequence[Symbol.asyncIterator]();
  }

  #executeOne<T>() {
    return this.execute() as Promise<T>;
  }

  /**
   * @ignore
   */
  protected execute(cache?: QueryCache) {
    return this.#compiler.compile(() => this)([], cache);
  }

  #curry(expression: Expression, args: Primitive[]) {
    if (expression.type === "ArrowFunctionExpression") {
      const arrow = expression as ArrowExpression;

      if (arrow.params && arrow.params.length > 1) {
        const params = arrow.params;

        return [
          { ...arrow, params: params.slice(0, params.length - args.length) },
          constant(
            Map(
              args.map((a, i) => {
                const param = params[params.length - args.length + i]!;

                if (param.type !== "Identifier") {
                  throw new Error(`Invalid local parameter: ${printExpr(param)}`);
                }

                return [(param as Identifier).name, a];
              })
            )
          ),
        ];
      }
    }

    return [expression];
  }
}

/**
 * Fluent query operators that must appear at the root of a query expression.
 *
 * @template T The type of the entity being queried.
 */
export class AsyncQueryableRoot<T> extends AsyncQueryable<T> {
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
  sql(strings: TemplateStringsArray, ...values: any[]) {
    this.expression = this.op("sql", constant(strings), constant(values));

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
    this.expression = this.op("configure", constant(options));

    return this;
  }
}

function constant(value: any) {
  return {
    type: "ConstantExpression",
    value,
  };
}
