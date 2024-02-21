import {
  SqlBinary,
  SqlBoolean,
  SqlDelete,
  SqlIdentifier,
  SqlInsert,
  SqlNode,
  SqlNull,
  SqlNumber,
  SqlString,
  SqlTimestamp,
  SqlUpdate,
} from "@operativa/verse/db/sql";
import { SqlVisitor } from "@operativa/verse/db/visitor";

export class CodeGenerator extends SqlVisitor<string> {
  generate(ops: SqlNode[]) {
    let code = ops.map(op => op.accept(this)).join("\n  ");

    if (code.length === 0) {
      code = "// Add your migration code here...";
    }

    return `import { DB, Migration } from "@operativa/verse-migrations";

const migration: Migration = (db: DB) => {
  ${code}
};

export default migration;
`;
  }

  override visitNode(node: SqlNode): string {
    throw new Error(`'visit${node.constructor.name.slice(3)}' is not implemented!`);
  }

  override visitInsert(insert: SqlInsert): string {
    return `db.insert(${insert.table.accept(this)}, [${insert.columns
      .map(c => c.accept(this))
      .join(", ")}], [${insert.values.map(c => c.accept(this)).join(", ")}]);`;
  }

  override visitDelete(_delete: SqlDelete): string {
    return `db.delete(${_delete.table.accept(this)}, { ${_delete.where.accept(this)} });`;
  }

  override visitUpdate(update: SqlUpdate): string {
    return `db.update(${update.table.accept(this)}, { ${update.assignments
      .map(a => a.accept(this))
      .join(", ")} }, { ${update.where.accept(this)} });`;
  }

  override visitBinary(binary: SqlBinary): string {
    return `${binary.left.accept(this)}${binary.op == "and" ? ", " : ": "}${binary.right.accept(
      this
    )}`;
  }

  override visitNumber(n: SqlNumber) {
    return `${n.value}`;
  }

  override visitBoolean(boolean: SqlBoolean) {
    return `${boolean.value}`;
  }

  override visitString(str: SqlString) {
    return `"${this.escapeString(str.value)}"`;
  }

  protected escapeString(str: string) {
    return str.replace(/(["\\])/g, "\\$1");
  }

  override visitIdentifier(identifier: SqlIdentifier) {
    return `"${this.escapeIdent(identifier.name)}"`;
  }

  protected escapeIdent(identifier: string) {
    return identifier.replace(/"/g, '\\"');
  }

  override visitNull(_: SqlNull) {
    return "null";
  }

  override visitTimestamp(timestamp: SqlTimestamp) {
    return `new Date("${timestamp.value.toUTCString()}")`;
  }
}
