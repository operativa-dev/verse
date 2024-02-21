import { List } from "immutable";
import invariant from "tiny-invariant";
import {
  EntityModel,
  ForeignKeyModel,
  Model,
  ScalarPropertyModel,
  SequenceModel,
} from "../model/model.js";
import { ModelVisitor } from "../model/visitor.js";
import { Metadata } from "../verse.js";
import {
  SqlColumn,
  SqlComposite,
  SqlCreateSequence,
  SqlCreateTable,
  SqlForeignKey,
  sqlId,
  SqlNode,
  SqlNumber,
} from "./sql.js";

/**
 * The SchemaGenerator class is used to generate SQL schema DDL statements
 * corresponding to a given metadata model.
 */
export class SchemaGenerator extends ModelVisitor<SqlNode> {
  #metadata!: Metadata;

  generate(metadata: Metadata) {
    this.#metadata = metadata;

    const composite = this.#metadata.model.accept(this) as SqlComposite;

    return composite.nodes.toArray();
  }

  override visitModel(model: Model): SqlNode {
    return new SqlComposite(
      (
        model.entities
          .map(e => this.#metadata.inheritance.schema(e, this))
          .filter(n => n != undefined) as List<SqlNode>
      ).concat(model.sequences.map(s => s.accept(this)))
    );
  }

  override visitEntity(entity: EntityModel): SqlNode {
    invariant(entity.table, "Table name is missing");

    return new SqlCreateTable(
      sqlId(entity.table),
      entity.scalarFlatMap(({ scalar }) => scalar.accept(this) as SqlColumn),
      entity.key?.properties.map(p => sqlId(p.column!)),
      entity.foreignKeys?.map(fk => fk.accept(this) as SqlForeignKey)
    );
  }

  override visitSequence(sequence: SequenceModel) {
    return new SqlCreateSequence(
      sqlId(sequence.name),
      new SqlNumber(sequence.start),
      new SqlNumber(sequence.increment)
    );
  }

  override visitForeignKey(foreignKey: ForeignKeyModel) {
    return new SqlForeignKey(
      foreignKey.properties!.map(p => sqlId(p.column!)),
      sqlId(foreignKey.references!.table!),
      foreignKey.references.key!.properties.map(p => sqlId(p.column!)),
      foreignKey.onDelete
    );
  }

  override visitScalarProperty(scalarProperty: ScalarPropertyModel) {
    invariant(scalarProperty.column, "Column name is missing");
    invariant(scalarProperty.type, "Column type is missing");

    return new SqlColumn(
      sqlId(scalarProperty.column),
      scalarProperty.type,
      scalarProperty.nullable,
      scalarProperty.generate?.using === "identity"
    );
  }
}
