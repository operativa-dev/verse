/**
 * An immutable SQL object model used for generating and manipulating SQL statements.
 *
 * @packageDocumentation
 */

import { hash, is, List, ValueObject } from "immutable";
import invariant from "tiny-invariant";
import { Newable } from "ts-essentials";

import { AbstractModel, ConversionModel, Model, OnDelete } from "../model/model.js";
import { LoadNode } from "../query/eager.js";
import { notEmpty, notNull } from "../utils/check.js";

import { SqlRewriter } from "./rewriter.js";
import { SqlVisitor } from "./visitor.js";

export class SqlBindingState {
  klass?: Newable<unknown> | undefined;
  name?: string | undefined;
  nullable?: boolean | undefined;
  type?: SqlType | undefined;
  element?: SqlNode | undefined;
  model?: AbstractModel | undefined;

  /**
   * @ignore
   */
  load?: LoadNode | undefined;

  eager?: boolean | undefined;
}

export class SqlBinding {
  constructor(private readonly state: Readonly<SqlBindingState>) {}

  get klass() {
    return this.state.klass;
  }

  get name() {
    return this.state.name;
  }

  get nullable() {
    return this.state.nullable;
  }

  get type() {
    return this.state.type;
  }

  get element() {
    return this.state.element;
  }

  get model() {
    return this.state.model;
  }

  /**
   * @ignore
   */
  get load() {
    return this.state.load;
  }

  get eager() {
    return this.state.eager;
  }

  withType(type?: SqlType) {
    if (type !== this.type) {
      return new SqlBinding({ ...this.state, type });
    }

    return this;
  }

  merge(binding: SqlBinding) {
    return new SqlBinding({ ...this.state, ...binding.state });
  }

  scope(object: SqlIdentifier) {
    if (this.element) {
      return new SqlBinding({ ...this.state, element: this.element.scope(object) });
    }

    return this;
  }
}

export abstract class SqlNode implements ValueObject {
  readonly #binding?: SqlBinding | undefined;

  protected constructor(binding?: SqlBinding) {
    this.#binding = binding;
  }

  get binding() {
    return this.#binding;
  }

  get type(): SqlType | undefined {
    return this.#binding?.type;
  }

  get nullable() {
    return this.#binding?.nullable;
  }

  get readable() {
    return false;
  }

  // @ts-ignore
  bind(binding: SqlBinding): SqlNode {
    throw new Error("Not implemented");
  }

  scope(_: SqlIdentifier): SqlNode {
    return this;
  }

  get identifier(): SqlIdentifier {
    throw new Error("Not implemented");
  }

  identify(_: (n: SqlNode) => SqlNode): SqlNode {
    return this;
  }

  uniquify(_: Set<string>, __: (node: SqlNode) => SqlAlias): SqlNode {
    return this;
  }

  reduce(): List<SqlNode> {
    return List.of(this);
  }

  map(mapper: (node: SqlNode) => SqlNode) {
    return mapper(this);
  }

  apply(ctor: Newable<SqlNode>) {
    return new ctor(this);
  }

  compare(op: SqlBinaryOperator, other: SqlNode) {
    return new SqlBinary(this, op, other);
  }

  get size() {
    return 1;
  }

  // @ts-ignore
  accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S): T {
    throw new Error("Not implemented");
  }

  // @ts-ignore
  rewrite(rewriter: SqlRewriter): SqlNode {
    return this;
  }

  abstract equals(other: unknown): boolean;
  abstract hashCode(): number;
}

export class SqlCreateDatabase extends SqlNode {
  constructor(readonly name: SqlIdentifier) {
    super();
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitCreateDatabase(this, state);
  }

  override equals(other: unknown) {
    return this === other || (other instanceof SqlCreateDatabase && is(this.name, other.name));
  }

  override hashCode() {
    return hash(this.name) * 27;
  }
}

export class SqlDropDatabase extends SqlNode {
  constructor(readonly name: SqlIdentifier) {
    super();
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitDropDatabase(this, state);
  }

  override equals(other: unknown) {
    return this === other || (other instanceof SqlDropDatabase && is(this.name, other.name));
  }

  override hashCode() {
    return hash(this.name) * 31;
  }
}

export class SqlCreateTable extends SqlNode {
  constructor(
    readonly name: SqlIdentifier,
    readonly columns: List<SqlColumn>,
    readonly primaryKey: List<SqlIdentifier> = List(),
    readonly foreignKeys: List<SqlForeignKey> = List()
  ) {
    super();
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitCreateTable(this, state);
  }

  override rewrite(rewriter: SqlRewriter) {
    const newColumns = rewriter.rewriteList(this.columns)!;

    if (this.columns !== newColumns) {
      return new SqlCreateTable(this.name, newColumns, this.primaryKey, this.foreignKeys);
    }

    return this;
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlCreateTable &&
        is(this.name, other.name) &&
        is(this.columns, other.columns) &&
        is(this.primaryKey, other.primaryKey) &&
        is(this.foreignKeys, other.foreignKeys))
    );
  }

  override hashCode() {
    return (
      (hash(this.name) * 31) ^
      (hash(this.columns) * 31) ^
      (hash(this.primaryKey) * 31) ^
      (hash(this.foreignKeys) * 31)
    );
  }
}

export class SqlDropTable extends SqlNode {
  constructor(readonly name: SqlIdentifier) {
    super();
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitDropTable(this, state);
  }

  override equals(other: unknown) {
    return this === other || (other instanceof SqlCreateTable && is(this.name, other.name));
  }

  override hashCode() {
    return hash(this.name) * 31;
  }
}

export class SqlRenameTable extends SqlNode {
  constructor(
    readonly oldName: SqlIdentifier,
    readonly newName: SqlIdentifier
  ) {
    super();
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitRenameTable(this, state);
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlRenameTable &&
        is(this.oldName, other.oldName) &&
        is(this.newName, other.newName))
    );
  }

  override hashCode() {
    return (hash(this.oldName) * 31) ^ (hash(this.newName) * 31);
  }
}

export class SqlCreateIndex extends SqlNode {
  constructor(
    readonly name: SqlIdentifier,
    readonly table: SqlIdentifier,
    readonly columns: List<SqlIdentifier>
  ) {
    super();
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitCreateIndex(this, state);
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlCreateIndex &&
        is(this.name, other.name) &&
        is(this.table, other.table) &&
        is(this.columns, other.columns))
    );
  }

  override hashCode() {
    return (hash(this.name) * 31) ^ (hash(this.table) * 31) ^ (hash(this.columns) * 31);
  }
}

export class SqlDropIndex extends SqlNode {
  constructor(
    readonly table: SqlIdentifier,
    readonly name: SqlIdentifier
  ) {
    super();
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitDropIndex(this, state);
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlDropIndex && is(this.table, other.table) && is(this.name, other.name))
    );
  }

  override hashCode() {
    return (hash(this.table) * 31) ^ (hash(this.name) * 31);
  }
}

export class SqlCreateSequence extends SqlNode {
  constructor(
    readonly name: SqlIdentifier,
    readonly start: SqlNumber,
    readonly increment: SqlNumber
  ) {
    super();
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitCreateSequence(this, state);
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlCreateSequence &&
        is(this.name, other.name) &&
        is(this.start, other.start) &&
        is(this.increment, other.increment))
    );
  }

  override hashCode() {
    return (hash(this.name) * 31) ^ (hash(this.start) * 31) ^ (hash(this.increment) * 31);
  }
}

export class SqlDropSequence extends SqlNode {
  constructor(readonly name: SqlIdentifier) {
    super();
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitDropSequence(this, state);
  }

  override equals(other: unknown) {
    return this === other || (other instanceof SqlDropSequence && is(this.name, other.name));
  }

  override hashCode() {
    return hash(this.name) * 31;
  }
}

export class SqlAddColumn extends SqlNode {
  constructor(
    readonly table: SqlIdentifier,
    readonly column: SqlColumn
  ) {
    super();
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitAddColumn(this, state);
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlAddColumn &&
        is(this.table, other.table) &&
        is(this.column, other.column))
    );
  }

  override hashCode() {
    return (hash(this.table) * 31) ^ (hash(this.column) * 31);
  }
}

export class SqlDropColumn extends SqlNode {
  constructor(
    readonly table: SqlIdentifier,
    readonly column: SqlIdentifier
  ) {
    super();
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitDropColumn(this, state);
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlDropColumn &&
        is(this.table, other.table) &&
        is(this.column, other.column))
    );
  }

  override hashCode() {
    return (hash(this.table) * 27) ^ (hash(this.column) * 27);
  }
}

export class SqlRenameColumn extends SqlNode {
  constructor(
    readonly table: SqlIdentifier,
    readonly oldName: SqlIdentifier,
    readonly newName: SqlIdentifier
  ) {
    super();
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitRenameColumn(this, state);
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlRenameColumn &&
        is(this.table, other.table) &&
        is(this.oldName, other.oldName) &&
        is(this.newName, other.newName))
    );
  }

  override hashCode() {
    return (hash(this.table) * 31) ^ (hash(this.oldName) * 31) ^ (hash(this.newName) * 31);
  }
}

export class SqlInsert extends SqlNode {
  constructor(
    readonly table: SqlIdentifier,
    readonly columns: List<SqlIdentifier>,
    readonly values: List<SqlNode>,
    readonly returning: List<SqlNode> = List(),
    binding?: SqlBinding
  ) {
    super(binding);
  }

  override get readable() {
    return !this.returning.isEmpty();
  }

  withReturning(returning: List<SqlNode>) {
    if (!is(returning, this.returning)) {
      return new SqlInsert(this.table, this.columns, this.values, returning, this.binding);
    }

    return this;
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitInsert(this, state);
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlInsert &&
        is(this.table, other.table) &&
        is(this.columns, other.columns) &&
        is(this.values, other.values) &&
        is(this.returning, other.returning))
    );
  }

  override hashCode() {
    return (
      (hash(this.table) * 31) ^
      (hash(this.columns) * 31) ^
      (hash(this.values) * 31) ^
      (hash(this.returning) * 31)
    );
  }
}

export class SqlUpdate extends SqlNode {
  constructor(
    readonly table: SqlIdentifier,
    readonly assignments: List<SqlBinary>,
    readonly where: SqlNode
  ) {
    super();
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitUpdate(this, state);
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlUpdate &&
        is(this.table, other.table) &&
        is(this.assignments, other.assignments) &&
        is(this.where, other.where))
    );
  }

  override hashCode() {
    return (hash(this.table) * 31) ^ (hash(this.assignments) * 31) ^ (hash(this.where) * 31);
  }
}

export class SqlDelete extends SqlNode {
  constructor(
    readonly table: SqlIdentifier,
    readonly where: SqlNode
  ) {
    super();
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitDelete(this, state);
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlDelete && is(this.table, other.table) && is(this.where, other.where))
    );
  }

  override hashCode() {
    return (hash(this.table) * 31) ^ (hash(this.where) * 31);
  }
}

export class SqlForeignKey extends SqlNode {
  constructor(
    readonly columns: List<SqlIdentifier>,
    readonly references: SqlIdentifier,
    readonly referencedColumns: List<SqlIdentifier>,
    readonly onDelete?: OnDelete
  ) {
    super();
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitForeignKey(this, state);
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlForeignKey &&
        is(this.columns, other.columns) &&
        is(this.references, other.references) &&
        is(this.referencedColumns, other.referencedColumns) &&
        is(this.onDelete, other.onDelete))
    );
  }

  override hashCode() {
    return (
      (hash(this.columns) * 31) ^
      (hash(this.references) * 31) ^
      (hash(this.referencedColumns) * 31) ^
      (hash(this.onDelete) * 31)
    );
  }
}

export class SqlAddForeignKey extends SqlNode {
  constructor(
    readonly table: SqlIdentifier,
    readonly foreignKey: SqlForeignKey
  ) {
    super();
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitAddForeignKey(this, state);
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlAddForeignKey &&
        is(this.table, other.table) &&
        is(this.foreignKey, other.foreignKey))
    );
  }

  override hashCode() {
    return (hash(this.table) * 31) ^ (hash(this.foreignKey) * 31);
  }
}

// workaround for docusaurus-typedoc crash
type Number = number;

/**
 * Represents a SQL data type.
 *
 * A string that represents a SQL data type. It can have the following values:
 * - `boolean`: Represents a boolean data type.
 * - `integer`: Represents an integer data type.
 * - `text`: Represents a text data type.
 * - `varchar(${number})`: Represents a variable-length character string data type with a specified maximum length.
 * - `numeric`: Represents a numeric data type.
 * - `numeric(${number}, ${number})`: Represents a numeric data type with a specified precision and scale.
 * - `json`: Represents a JSON data type.
 * - `uuid`: Represents a UUID data type.
 * - `binary(${number})`: Represents a binary data type with a specified maximum length.
 * - `timestamp`: Represents a timestamp data type.
 * - `timestamp with time zone`: Represents a timestamp data type with time zone information.
 */
export type SqlType =
  | "boolean"
  | "integer"
  | "text"
  | `varchar(${Number})`
  | `numeric`
  | `numeric(${Number}, ${Number})`
  | "json"
  | "uuid"
  | `binary(${Number})`
  | "timestamp"
  | "timestamp with time zone";

export namespace SqlType {
  export function isNumeric(type?: SqlType) {
    return type === "integer" || type?.startsWith("numeric");
  }

  export function isText(type?: SqlType) {
    return type === "text" || type?.startsWith("varchar");
  }
}

export class SqlColumn extends SqlNode {
  readonly #type: SqlType;
  readonly #nullable: boolean;
  readonly #identity: boolean;

  constructor(
    readonly name: SqlIdentifier,
    type: SqlType,
    nullable = true,
    identity = false
  ) {
    super();

    this.#type = type;
    this.#nullable = nullable;
    this.#identity = identity;
  }

  override get type() {
    return this.#type;
  }

  override get nullable() {
    return this.#nullable;
  }

  withNullable(nullable: boolean) {
    if (nullable !== this.nullable) {
      return new SqlColumn(this.name, this.type, nullable, this.identity);
    }

    return this;
  }

  get identity() {
    return this.#identity;
  }

  withType(type: SqlType) {
    if (type !== this.type) {
      return new SqlColumn(this.name, type, this.nullable, this.identity);
    }

    return this;
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitColumn(this, state);
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlColumn &&
        is(this.name, other.name) &&
        is(this.type, other.type) &&
        is(this.nullable, other.nullable) &&
        is(this.identity, other.identity))
    );
  }

  override hashCode() {
    return (
      (hash(this.name) * 31) ^
      (hash(this.type) * 31) ^
      (hash(this.nullable) * 31) ^
      (hash(this.identity) * 31)
    );
  }
}

export interface SqlSelectState {
  projection: SqlNode;
  distinct?: boolean | undefined;
  from?: SqlNode | undefined;
  joins?: List<SqlJoin> | undefined;
  where?: SqlNode | undefined;
  orderBy?: SqlOrderBy | undefined;
  groupBy?: SqlNode | undefined;
  limit?: SqlNode | undefined;
  offset?: SqlNode | undefined;
}

export class SqlSelect extends SqlNode {
  constructor(
    private readonly state: Readonly<SqlSelectState>,
    binding?: SqlBinding
  ) {
    super(binding);
  }

  get projection() {
    return this.state.projection;
  }

  withProjection(projection: SqlNode) {
    if (projection !== this.projection) {
      return new SqlSelect({ ...this.state, projection });
    }

    return this;
  }

  get distinct() {
    return this.state.distinct;
  }

  get from() {
    return this.state.from;
  }

  withFrom(from?: SqlNode) {
    if (!is(from, this.from)) {
      return new SqlSelect({ ...this.state, from }, this.binding);
    }

    return this;
  }

  get joins() {
    return this.state.joins;
  }

  addJoins(...joins: SqlJoin[]) {
    if (joins.length === 0) {
      return this;
    }

    return new SqlSelect(
      { ...this.state, joins: this.joins ? this.joins.push(...joins) : List(joins) },
      this.binding
    );
  }

  withJoins(joins: List<SqlJoin>) {
    if (!is(joins, this.joins)) {
      return new SqlSelect({ ...this.state, joins }, this.binding);
    }

    return this;
  }

  get where() {
    return this.state.where;
  }

  withWhere(where: SqlNode | undefined) {
    if (where !== this.where) {
      return new SqlSelect({ ...this.state, where }, this.binding);
    }

    return this;
  }

  get orderBy() {
    return this.state.orderBy;
  }

  withOrderBy(orderBy: SqlOrderBy) {
    if (orderBy !== this.orderBy) {
      return new SqlSelect({ ...this.state, orderBy }, this.binding);
    }

    return this;
  }

  get groupBy() {
    return this.state.groupBy;
  }

  get limit() {
    return this.state.limit;
  }

  withLimit(limit: SqlNode | undefined) {
    if (limit !== this.limit) {
      return new SqlSelect({ ...this.state, limit }, this.binding);
    }

    return this;
  }

  get offset() {
    return this.state.offset;
  }

  withOffset(offset: SqlNode | undefined) {
    if (offset !== this.offset) {
      return new SqlSelect({ ...this.state, offset }, this.binding);
    }

    return this;
  }

  override bind(binding: SqlBinding) {
    return new SqlSelect(this.state, binding);
  }

  override identify(aliaser: (n: SqlNode) => SqlNode): SqlNode {
    return aliaser(this);
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitSelect(this, state);
  }

  override rewrite(rewriter: SqlRewriter): SqlNode {
    const newProjection = rewriter.rewriteProjection(this.projection);

    const newFrom = this.from?.accept(rewriter);
    const newJoins = rewriter.rewriteList(this.joins);
    const newWhere = this.where?.accept(rewriter);
    const newOrderBy = this.orderBy?.accept(rewriter) as SqlOrderBy;
    const newGroupBy = this.groupBy?.accept(rewriter);
    const newLimit = this.limit?.accept(rewriter);
    const newOffset = this.offset?.accept(rewriter);

    if (
      this.projection !== newProjection ||
      this.from !== newFrom ||
      this.joins !== newJoins ||
      this.where !== newWhere ||
      this.orderBy !== newOrderBy ||
      this.groupBy !== newGroupBy ||
      this.limit !== newLimit ||
      this.offset !== newOffset
    ) {
      return new SqlSelect(
        {
          projection: newProjection,
          distinct: this.distinct,
          from: newFrom,
          joins: newJoins,
          where: newWhere,
          orderBy: newOrderBy,
          groupBy: newGroupBy,
          limit: newLimit,
          offset: newOffset,
        },
        this.binding
      );
    }

    return this;
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlSelect &&
        is(this.projection, other.projection) &&
        is(this.distinct, other.distinct) &&
        is(this.from, other.from) &&
        is(this.joins, other.joins) &&
        is(this.where, other.where) &&
        is(this.orderBy, other.orderBy) &&
        is(this.groupBy, other.groupBy) &&
        is(this.limit, other.limit) &&
        is(this.offset, other.offset))
    );
  }

  override hashCode() {
    return (
      (hash(this.projection) * 31) ^
      (hash(this.distinct) * 31) ^
      (hash(this.from) * 31) ^
      (hash(this.joins) * 31) ^
      (hash(this.where) * 31) ^
      (hash(this.orderBy) * 31) ^
      (hash(this.groupBy) * 31) ^
      (hash(this.limit) * 31) ^
      (hash(this.offset) * 31)
    );
  }
}

export type SqlJoinType = "inner" | "left" | "right";

export class SqlJoin extends SqlNode {
  constructor(
    readonly joinType: SqlJoinType,
    readonly target: SqlNode,
    readonly on: SqlNode
  ) {
    super();
  }

  withTarget(target: SqlNode) {
    if (target !== this.target) {
      return new SqlJoin(this.joinType, target, this.on);
    }

    return this;
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitJoin(this, state);
  }

  override rewrite(rewriter: SqlRewriter): SqlNode {
    const newTarget = this.target.accept(rewriter);
    const newOn = this.on.accept(rewriter);

    if (this.target !== newTarget || this.on !== newOn) {
      return new SqlJoin(this.joinType, newTarget, newOn);
    }

    return this;
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlJoin &&
        is(this.joinType, other.joinType) &&
        is(this.target, other.target) &&
        is(this.on, other.on))
    );
  }

  override hashCode() {
    return (hash(this.joinType) * 31) ^ (hash(this.target) * 31) ^ (hash(this.on) * 31);
  }
}

export class SqlOrderBy extends SqlNode {
  constructor(
    readonly expressions: List<SqlOrdering>,
    readonly offset?: SqlNode,
    readonly fetchNext?: SqlNode,
    binding?: SqlBinding
  ) {
    super(binding);
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S): T {
    return visitor.visitOrderBy(this, state);
  }

  override rewrite(rewriter: SqlRewriter): SqlNode {
    const newExpressions = rewriter.rewriteList(this.expressions)!;
    const newOffset = this.offset?.accept(rewriter);
    const newFetchNext = this.fetchNext?.accept(rewriter);

    if (
      this.expressions !== newExpressions ||
      this.offset !== newOffset ||
      this.fetchNext !== newFetchNext
    ) {
      return new SqlOrderBy(newExpressions, newOffset, newFetchNext, this.binding);
    }

    return this;
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlOrderBy &&
        is(this.expressions, other.expressions) &&
        is(this.offset, other.offset) &&
        is(this.fetchNext, other.fetchNext))
    );
  }

  override hashCode() {
    return (hash(this.expressions) * 31) ^ (hash(this.offset) * 31) ^ (hash(this.fetchNext) * 31);
  }
}

export class SqlOrdering extends SqlNode {
  constructor(
    readonly node: SqlNode,
    readonly desc = false
  ) {
    super();
  }

  override scope(object: SqlIdentifier): SqlNode {
    return new SqlOrdering(this.node.scope(object), this.desc);
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitOrdering(this, state);
  }

  override rewrite(rewriter: SqlRewriter): SqlNode {
    const newNode = this.node.accept(rewriter);

    if (this.node !== newNode) {
      return new SqlOrdering(newNode, this.desc);
    }

    return this;
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlOrdering && is(this.node, other.node) && is(this.desc, other.desc))
    );
  }

  override hashCode() {
    return (hash(this.node) * 31) ^ (hash(this.desc) * 31);
  }
}

export function sqlBin(left: SqlNode, op: SqlBinaryOperator, right: SqlNode, binding?: SqlBinding) {
  return new SqlBinary(left, op, right, binding);
}

export class SqlBinary extends SqlNode {
  constructor(
    readonly left: SqlNode,
    readonly op: SqlBinaryOperator,
    readonly right: SqlNode,
    binding?: SqlBinding
  ) {
    super(binding);

    notNull({ left, op, right });
  }

  override get type(): SqlType | undefined {
    if (SqlBinaryOperator.isComparison(this.op)) {
      return "boolean";
    }

    if (SqlBinaryOperator.isArithmetic(this.op)) {
      return this.left.type;
    }

    return super.type;
  }

  override bind(binding: SqlBinding): SqlNode {
    return sqlBin(this.left, this.op, this.right, binding);
  }

  override identify(aliaser: (n: SqlNode) => SqlNode): SqlNode {
    return aliaser(this);
  }

  override scope(object: SqlIdentifier) {
    return new SqlBinary(
      this.left.scope(object),
      this.op,
      this.right.scope(object),
      this.binding?.scope(object)
    );
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitBinary(this, state);
  }

  override rewrite(rewriter: SqlRewriter): SqlNode {
    const newLeft = this.left.accept(rewriter);
    const newRight = this.right.accept(rewriter);

    if (this.left !== newLeft || this.right !== newRight) {
      return new SqlBinary(newLeft, this.op, newRight, this.binding);
    }

    return this;
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlBinary &&
        is(this.left, other.left) &&
        is(this.op, other.op) &&
        is(this.right, other.right))
    );
  }

  override hashCode() {
    return (hash(this.left) * 31) ^ (hash(this.op) * 31) ^ (hash(this.right) * 31);
  }
}

export type SqlBinaryOperator =
  | "="
  | "<>"
  | ">"
  | ">="
  | "<"
  | "<="
  | "and"
  | "or"
  | "||"
  | "*"
  | "/"
  | "%"
  | "+"
  | "-"
  | "->"
  | "->>";

export namespace SqlBinaryOperator {
  export function isJson(op: SqlBinaryOperator) {
    return op === "->" || op === "->>";
  }

  export function isComparison(op: SqlBinaryOperator) {
    return op === "=" || op === "<>" || op === ">" || op === ">=" || op === "<" || op === "<=";
  }

  export function isArithmetic(op: SqlBinaryOperator) {
    return op === "*" || op === "/" || op === "%" || op === "+" || op === "-";
  }
}

export class SqlAlias extends SqlNode {
  constructor(
    readonly target: SqlNode,
    readonly alias: SqlIdentifier,
    binding?: SqlBinding
  ) {
    super(binding);
  }

  override get identifier() {
    return this.alias;
  }

  override bind(binding: SqlBinding): SqlNode {
    return new SqlAlias(this.target, this.alias, binding);
  }

  override scope(object: SqlIdentifier) {
    return new SqlMember(
      object,
      this.alias,
      this.binding
        ? this.binding.scope(object)?.withType(this.target.type)
        : new SqlBinding({ type: this.target.type })
    );
  }

  override uniquify(used: Set<string>, rename: (node: SqlNode) => SqlAlias) {
    let node: SqlNode = this;

    if (used.has(this.alias.name)) {
      node = rename(this);
    }

    used.add(node.identifier.name);

    return node;
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitAlias(this, state);
  }

  override rewrite(rewriter: SqlRewriter): SqlNode {
    const newTarget = this.target.accept(rewriter);

    if (this.target !== newTarget) {
      return new SqlAlias(newTarget, this.alias, this.binding);
    }

    return this;
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlAlias && is(this.target, other.target) && is(this.alias, other.alias))
    );
  }

  override hashCode() {
    return (hash(this.target) * 31) ^ (hash(this.alias) * 31);
  }
}

export class SqlTypeAlias extends SqlNode {
  readonly #type: SqlType;

  constructor(
    readonly target: SqlNode,
    type: SqlType,
    binding?: SqlBinding
  ) {
    super(binding);

    this.#type = type;
  }

  override get type() {
    return this.#type;
  }

  override bind(binding: SqlBinding): SqlNode {
    return new SqlTypeAlias(this.target, this.type, binding);
  }

  override scope(object: SqlIdentifier) {
    return new SqlTypeAlias(this.target.scope(object), this.type, this.binding?.scope(object));
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitTypeAlias(this, state);
  }

  override rewrite(rewriter: SqlRewriter): SqlNode {
    const newTarget = this.target.accept(rewriter);

    if (this.target !== newTarget) {
      return new SqlTypeAlias(newTarget, this.type, this.binding);
    }

    return this;
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlTypeAlias && is(this.target, other.target) && is(this.type, other.type))
    );
  }

  override hashCode() {
    return (hash(this.target) * 31) ^ (hash(this.type) * 31);
  }
}

export class SqlFunction extends SqlNode {
  constructor(
    readonly name: string,
    readonly args: List<SqlNode> = List(),
    binding?: SqlBinding
  ) {
    super(binding);
  }

  override get nullable() {
    return this.args.some(arg => arg.nullable === true);
  }

  override identify(aliaser: (n: SqlNode) => SqlNode): SqlNode {
    return aliaser(this);
  }

  override scope(object: SqlIdentifier): SqlNode {
    return new SqlFunction(
      this.name,
      this.args.map(arg => arg.scope(object)),
      this.binding?.scope(object)
    );
  }

  override bind(binding: SqlBinding) {
    return new SqlFunction(this.name, this.args, binding);
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitFunction(this, state);
  }

  override rewrite(rewriter: SqlRewriter): SqlNode {
    const newArgs = rewriter.rewriteList(this.args);

    if (this.args !== newArgs) {
      return new SqlFunction(this.name, newArgs, this.binding);
    }

    return this;
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlFunction && is(this.name, other.name) && is(this.args, other.args))
    );
  }

  override hashCode() {
    return (hash(this.name) * 31) ^ (hash(this.args) * 31);
  }
}

export class SqlMember extends SqlNode {
  constructor(
    readonly object: SqlNode,
    readonly member: SqlIdentifier,
    binding?: SqlBinding
  ) {
    invariant(object);
    invariant(member);

    super(binding);
  }

  override get binding() {
    return super.binding ?? this.member.binding;
  }

  override get nullable() {
    return this.member.nullable;
  }

  override bind(binding: SqlBinding) {
    return new SqlMember(this.object, this.member, binding);
  }

  override scope(object: SqlIdentifier) {
    invariant(object);

    return new SqlMember(object, this.member, this.binding?.scope(object));
  }

  override get identifier(): SqlIdentifier {
    return this.member;
  }

  override uniquify(used: Set<string>, rename: (node: SqlNode) => SqlAlias) {
    let node: SqlNode = this;

    if (used.has(this.member.name)) {
      node = rename(this);
    }

    used.add(node.identifier.name);

    return node;
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitMember(this, state);
  }

  override rewrite(rewriter: SqlRewriter): SqlNode {
    const newObject = this.object.accept(rewriter);

    if (this.object !== newObject) {
      return new SqlMember(newObject, this.member, this.binding);
    }

    return this;
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlMember && is(this.object, other.object) && is(this.member, other.member))
    );
  }

  override hashCode() {
    return (hash(this.object) * 31) ^ (hash(this.member) * 31);
  }
}

export function sqlId(name: string) {
  return new SqlIdentifier(name);
}

export class SqlIdentifier extends SqlNode {
  constructor(
    readonly name: string,
    binding?: SqlBinding
  ) {
    notEmpty({ name });

    super(binding);
  }

  override bind(binding: SqlBinding) {
    return new SqlIdentifier(this.name, binding);
  }

  override scope(object: SqlIdentifier) {
    return new SqlMember(object, this, this.binding?.scope(object));
  }

  override get identifier() {
    return this;
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitIdentifier(this, state);
  }

  override equals(other: unknown) {
    return this === other || (other instanceof SqlIdentifier && is(this.name, other.name));
  }

  override hashCode() {
    return hash(this.name) * 17;
  }
}

export class SqlExists extends SqlNode {
  constructor(readonly select: SqlSelect) {
    super();
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitExists(this, state);
  }

  override rewrite(rewriter: SqlRewriter): SqlNode {
    const newSelect = this.select.accept(rewriter) as SqlSelect;

    if (this.select !== newSelect) {
      return new SqlExists(newSelect);
    }

    return this;
  }

  override equals(other: unknown) {
    return this === other || (other instanceof SqlExists && is(this.select, other.select));
  }

  override hashCode() {
    return hash(this.select) * 27;
  }
}

export class SqlLike extends SqlNode {
  constructor(
    readonly operand: SqlNode,
    readonly pattern: SqlNode
  ) {
    super();
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitLike(this, state);
  }

  override rewrite(rewriter: SqlRewriter): SqlNode {
    const newOperand = this.operand.accept(rewriter);
    const newPattern = this.pattern.accept(rewriter);

    if (this.operand !== newOperand || this.pattern !== newPattern) {
      return new SqlLike(newOperand, newPattern);
    }

    return this;
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlLike &&
        is(this.operand, other.operand) &&
        is(this.pattern, other.pattern))
    );
  }

  override hashCode() {
    return (hash(this.operand) * 31) ^ (hash(this.pattern) * 31);
  }
}

export class SqlNotLike extends SqlNode {
  constructor(
    readonly operand: SqlNode,
    readonly pattern: SqlNode
  ) {
    super();
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitNotLike(this, state);
  }

  override rewrite(rewriter: SqlRewriter): SqlNode {
    const newOperand = this.operand.accept(rewriter);
    const newPattern = this.pattern.accept(rewriter);

    if (this.operand !== newOperand || this.pattern !== newPattern) {
      return new SqlNotLike(newOperand, newPattern);
    }

    return this;
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlNotLike &&
        is(this.operand, other.operand) &&
        is(this.pattern, other.pattern))
    );
  }

  override hashCode() {
    return (hash(this.operand) * 27) ^ (hash(this.pattern) * 27);
  }
}

export class SqlNot extends SqlNode {
  constructor(readonly operand: SqlNode) {
    super();
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitNot(this, state);
  }

  override rewrite(rewriter: SqlRewriter): SqlNode {
    const newOperand = this.operand.accept(rewriter);

    if (this.operand !== newOperand) {
      return new SqlNot(newOperand);
    }

    return this;
  }

  override equals(other: unknown) {
    return this === other || (other instanceof SqlNot && is(this.operand, other.operand));
  }

  override hashCode() {
    return hash(this.operand) * 17;
  }
}

export class SqlNegation extends SqlNode {
  constructor(
    readonly operand: SqlNode,
    binding?: SqlBinding
  ) {
    super(binding);
  }

  override get type() {
    return this.operand.type;
  }

  override bind(binding: SqlBinding) {
    return new SqlNegation(this.operand, binding);
  }

  override identify(aliaser: (n: SqlNode) => SqlNode) {
    return aliaser(this);
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitNegation(this, state);
  }

  override rewrite(rewriter: SqlRewriter): SqlNode {
    const newOperand = this.operand.accept(rewriter);

    if (this.operand !== newOperand) {
      return new SqlNegation(newOperand, this.binding);
    }

    return this;
  }

  override equals(other: unknown) {
    return this === other || (other instanceof SqlNegation && is(this.operand, other.operand));
  }

  override hashCode() {
    return hash(this.operand) * 37;
  }
}

export function sqlStr(value: string, binding?: SqlBinding) {
  return new SqlString(value, binding);
}

export class SqlString extends SqlNode {
  constructor(
    readonly value: string,
    binding?: SqlBinding
  ) {
    super(binding);

    notNull({ value });
  }

  override bind(binding: SqlBinding) {
    return new SqlString(this.value, binding);
  }

  override identify(aliaser: (n: SqlNode) => SqlNode): SqlNode {
    return aliaser(this);
  }

  override get type(): SqlType | undefined {
    return "text";
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitString(this, state);
  }

  override equals(other: unknown) {
    return this === other || (other instanceof SqlString && is(this.value, other.value));
  }

  override hashCode() {
    return hash(this.value) * 23;
  }
}

export class SqlTimestamp extends SqlNode {
  constructor(
    readonly value: Date,
    binding?: SqlBinding
  ) {
    super(binding);
  }

  override bind(binding: SqlBinding) {
    return new SqlTimestamp(this.value, binding);
  }

  override identify(aliaser: (n: SqlNode) => SqlNode) {
    return aliaser(this);
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitTimestamp(this, state);
  }

  override equals(other: unknown) {
    return this === other || (other instanceof SqlTimestamp && is(this.value, other.value));
  }

  override hashCode() {
    return hash(this.value) * 31;
  }
}

export class SqlNumber extends SqlNode {
  static readonly ZERO = new SqlNumber(0);
  static readonly ONE = new SqlNumber(1);

  constructor(
    readonly value: number,
    binding?: SqlBinding
  ) {
    super(binding);
  }

  override get type(): SqlType | undefined {
    return Number.isInteger(this.value) ? "integer" : "numeric";
  }

  override bind(binding: SqlBinding) {
    return new SqlNumber(this.value, binding);
  }

  override identify(aliaser: (n: SqlNode) => SqlNode) {
    return aliaser(this);
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitNumber(this, state);
  }

  override equals(other: unknown) {
    return this === other || (other instanceof SqlNumber && is(this.value, other.value));
  }

  override hashCode() {
    return hash(this.value) * 29;
  }
}

export class SqlBoolean extends SqlNode {
  static readonly TRUE = new SqlBoolean(true);
  static readonly FALSE = new SqlBoolean(false);

  constructor(
    readonly value: boolean,
    binding?: SqlBinding
  ) {
    super(binding);
  }

  override identify(aliaser: (n: SqlNode) => SqlNode) {
    return aliaser(this);
  }

  override get type(): SqlType {
    return "boolean";
  }

  override bind(binding: SqlBinding) {
    return new SqlBoolean(this.value, binding);
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitBoolean(this, state);
  }

  override equals(other: unknown) {
    return this === other || (other instanceof SqlBoolean && is(this.value, other.value));
  }

  override hashCode() {
    return hash(this.value) * 19;
  }
}

export class SqlNull extends SqlNode {
  public static INSTANCE = new SqlNull();

  constructor(binding?: SqlBinding) {
    super(binding);
  }

  override identify(aliaser: (n: SqlNode) => SqlNode) {
    return aliaser(this);
  }

  override bind(binding: SqlBinding) {
    return new SqlNull(binding);
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitNull(this, state);
  }

  override equals(other: unknown) {
    return this === other || other instanceof SqlNull;
  }

  override hashCode() {
    return 13;
  }
}

export function primitiveToSql(
  value: unknown,
  model?: Model,
  raw?: string
): [SqlNode, ConversionModel | undefined] {
  if (value === null || value === undefined) {
    return [SqlNull.INSTANCE, undefined];
  }

  if (typeof value === "number") {
    return [new SqlNumber(value), model?.conversion(Number)];
  }

  if (typeof value === "string") {
    return [sqlStr(value), model?.conversion(String)];
  }

  if (typeof value === "boolean") {
    return [value ? SqlBoolean.TRUE : SqlBoolean.FALSE, model?.conversion(Boolean)];
  }

  if (value instanceof Date) {
    return [new SqlTimestamp(value), model?.conversion(Date)];
  }

  throw new Error(`Unsupported literal: '${raw ?? String(value)}'.`);
}

export class SqlParameter extends SqlNode {
  constructor(
    readonly id: number,
    binding?: SqlBinding
  ) {
    super(binding);
  }

  override bind(binding: SqlBinding) {
    return new SqlParameter(this.id, binding);
  }

  override identify(aliaser: (n: SqlNode) => SqlNode): SqlNode {
    return aliaser(this);
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitParameter(this, state);
  }

  override equals(other: unknown) {
    return this === other || (other instanceof SqlParameter && is(this.id, other.id));
  }

  override hashCode() {
    return hash(this.id) * 11;
  }
}

export class SqlStar extends SqlNode {
  public static INSTANCE = new SqlStar();

  private constructor() {
    super();
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitStar(this, state);
  }

  override equals(other: unknown) {
    return this === other || other instanceof SqlStar;
  }

  override hashCode() {
    return 7;
  }
}

export class SqlIsNull extends SqlNode {
  constructor(readonly operand: SqlNode) {
    super();
  }

  // override apply(ctor: Constructor<SqlNode>) {
  //     return new ctor(this.operand);
  // }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitIsNull(this, state);
  }

  override rewrite(rewriter: SqlRewriter): SqlNode {
    const newOperand = this.operand.accept(rewriter);

    if (this.operand !== newOperand) {
      return new SqlIsNull(newOperand);
    }

    return this;
  }

  override equals(other: unknown) {
    return this === other || (other instanceof SqlIsNull && is(this.operand, other.operand));
  }

  override hashCode() {
    return hash(this.operand) * 31;
  }
}

export class SqlIsNotNull extends SqlNode {
  constructor(readonly operand: SqlNode) {
    super();
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitIsNotNull(this, state);
  }

  override rewrite(rewriter: SqlRewriter): SqlNode {
    const newOperand = this.operand.accept(rewriter);

    if (this.operand !== newOperand) {
      return new SqlIsNotNull(newOperand);
    }

    return this;
  }

  override equals(other: unknown) {
    return this === other || (other instanceof SqlIsNotNull && is(this.operand, other.operand));
  }

  override hashCode() {
    return hash(this.operand) * 29;
  }
}

export class SqlComposite extends SqlNode {
  constructor(
    readonly nodes: List<SqlNode>,
    binding?: SqlBinding
  ) {
    super(binding);
  }

  record() {
    return this.map(n => (n instanceof SqlAlias ? n.alias.bind(n.binding!) : n));
  }

  override bind(binding: SqlBinding): SqlNode {
    return new SqlComposite(this.nodes, this.binding?.merge(binding) ?? binding);
  }

  override reduce() {
    return this.nodes.flatMap(n => n.reduce());
  }

  override scope(object: SqlIdentifier) {
    return this.map(n => n.scope(object));
  }

  override identify(aliaser: (n: SqlNode) => SqlNode): SqlNode {
    return this.map(n => n.identify(aliaser));
  }

  override uniquify(used: Set<string>, rename: (node: SqlNode) => SqlAlias) {
    return this.map(n => n.uniquify(used, rename));
  }

  override apply(ctor: Newable<SqlNode>) {
    return this.nodes
      .map(n => n.apply(ctor))
      .reduce((acc: SqlNode, next) => (acc ? sqlBin(acc, "and", next) : next));
  }

  override compare(op: SqlBinaryOperator, other: SqlComposite) {
    return this.nodes
      .map((n, i) => new SqlBinary(n, op, other.nodes.get(i)!))
      .reduce((acc: SqlBinary, next) => (acc ? sqlBin(acc, "and", next) : next));
  }

  override map(mapper: (node: SqlNode) => SqlNode) {
    const newNodes = this.nodes.withMutations(mutable => {
      for (let i = 0; i < mutable.size; i++) {
        const item = mutable.get(i)!;
        const newItem = mapper(item);
        if (newItem !== item) {
          mutable.set(i, newItem);
        }
      }
    });

    return newNodes !== this.nodes ? new SqlComposite(newNodes, this.binding) : this;
  }

  resolve(property: string): SqlNode | undefined {
    for (const node of this.nodes) {
      if (node.binding?.name === property) {
        return node;
      }

      if (node instanceof SqlComposite) {
        const n = node.resolve(property);
        if (n) {
          return n;
        }
      }
    }

    return undefined;
  }

  getByName(property: string): [SqlNode, number] {
    for (let i = 0; i < this.nodes.size; i++) {
      if (this.nodes.get(i)?.binding?.name === property) {
        return [this.nodes.get(i)!, i];
      }
    }

    throw new Error(`Property '${property}' not found!`);
  }

  getByIndex(index: number) {
    const node = this.nodes.get(index);

    if (!node) {
      throw new Error(`Property at index '${index}' not found!`);
    }

    return node;
  }

  override get size() {
    return this.nodes.reduce((acc, n) => acc + n.size, 0);
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitComposite(this, state);
  }

  override rewrite(rewriter: SqlRewriter): SqlNode {
    const newNodes = rewriter.rewriteList(this.nodes)!;

    if (newNodes !== this.nodes) {
      return new SqlComposite(newNodes, this.binding);
    }

    return this;
  }

  override equals(other: unknown) {
    return this === other || (other instanceof SqlComposite && is(this.nodes, other.nodes));
  }

  override hashCode() {
    return hash(this.nodes) * 31;
  }
}

export class SqlRaw extends SqlNode {
  constructor(
    readonly fragments: List<string>,
    readonly params: List<SqlNode> = List(),
    binding?: SqlBinding
  ) {
    super(binding);

    notEmpty({ fragments });
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitRaw(this, state);
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlRaw &&
        is(this.fragments, other.fragments) &&
        is(this.params, other.params))
    );
  }

  override hashCode() {
    return (hash(this.fragments) * 31) ^ (hash(this.params) * 31);
  }
}

export class SqlCase extends SqlNode {
  constructor(
    readonly when: SqlNode,
    readonly then: SqlNode,
    readonly elseThen: SqlNode,
    binding?: SqlBinding
  ) {
    super(binding);

    notNull({ when, then });
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S) {
    return visitor.visitCase(this, state);
  }

  override rewrite(rewriter: SqlRewriter): SqlNode {
    const newWhen = this.when.accept(rewriter);
    const newThen = this.then.accept(rewriter);
    const newElseThen = this.elseThen.accept(rewriter);

    if (this.when !== newWhen || this.then !== newThen || this.elseThen !== newElseThen) {
      return new SqlCase(newWhen, newThen, newElseThen, this.binding);
    }

    return this;
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SqlCase &&
        is(this.when, other.when) &&
        is(this.then, other.then) &&
        is(this.elseThen, other.elseThen))
    );
  }

  override hashCode() {
    return (hash(this.when) * 31) ^ (hash(this.then) * 31) ^ (hash(this.elseThen) * 31);
  }
}

export class SqlSet extends SqlNode {
  constructor(
    readonly setting: string,
    readonly arg0?: SqlNode,
    readonly arg1?: SqlNode
  ) {
    super();
  }

  override rewrite(rewriter: SqlRewriter): SqlNode {
    const newArg0 = this.arg0?.accept(rewriter);
    const newArg1 = this.arg1?.accept(rewriter);

    if (this.arg0 !== newArg0 || this.arg1 !== newArg1) {
      return new SqlSet(this.setting, newArg0, newArg1);
    }

    return this;
  }

  override accept<T, S = unknown>(visitor: SqlVisitor<T>, state?: S): T {
    return visitor.visitSet(this, state);
  }

  equals(other: unknown): boolean {
    return (
      this === other ||
      (other instanceof SqlSet &&
        is(this.setting, other.setting) &&
        is(this.arg0, other.arg0) &&
        is(this.arg1, other.arg1))
    );
  }

  hashCode(): number {
    return (hash(this.setting) * 31) ^ (hash(this.arg0) * 31) ^ (hash(this.arg1) * 31);
  }
}
