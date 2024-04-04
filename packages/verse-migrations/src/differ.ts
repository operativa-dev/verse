import { Metadata } from "@operativa/verse";
import {
  primitiveToSql,
  sqlBin,
  SqlBinary,
  SqlDelete,
  sqlId,
  SqlInsert,
  SqlNode,
} from "@operativa/verse/db/sql";
import { EntityModel, Model } from "@operativa/verse/model/model";
import { UnitOfWorkSpy } from "@operativa/verse/uow";
import { List } from "immutable";

import { Primitive } from "ts-essentials";

export class ModelDiffer {
  readonly #metadata: Metadata;

  constructor(metadata: Metadata) {
    this.#metadata = metadata;
  }

  async diff(previous?: ReturnType<Model["toObject"]>) {
    const ops: SqlNode[] = [];

    for (const currentEntity of this.#metadata.model.entities) {
      const previousEntity = previous?.entities.find(e => e.name === currentEntity.name);

      ops.push(...(await this.#diffEntity(currentEntity, previousEntity)));
    }

    return ops;
  }

  async #diffEntity(current: EntityModel, previous?: ReturnType<EntityModel["toObject"]>) {
    const ops: SqlNode[] = [];

    ops.push(...(await this.#diffData(current, current.data, previous?.data)));

    return ops;
  }

  async #diffData(entity: EntityModel, current?: List<any>, previous?: List<any>) {
    const ops: SqlNode[] = [];
    const uow = new DifferUnitOfWork(this.#metadata);

    previous?.forEach(o => {
      const key = entity.key!.keyOf(o);

      if (key) {
        uow.set(entity, key, o, "removed");
      } else if (!current?.some(c => JSON.stringify(c) === JSON.stringify(o))) {
        ops.push(
          new SqlDelete(
            sqlId(entity.table!),
            Object.entries(o)
              .filter(e => !entity.key!.names.includes(e[0]))
              .map(e => sqlBin(sqlId(entity.scalar(e[0]).column!), "=", primitiveToSql(e[1])[0]))
              .reduce((acc: SqlBinary, next) => (acc ? sqlBin(acc, "and", next) : next))
          )
        );
      }
    });

    for (const o of current ?? []) {
      const key = entity.key!.keyOf(o);

      if (key) {
        const existing = uow.get(entity, key) as any;

        if (existing) {
          uow.entry(existing)?.commit();

          Object.entries(o).forEach(([k, v]) => {
            if (!entity.key!.names.includes(k)) {
              existing[k] = v;
            }
          });
        } else {
          await uow.add(entity.name, o);
        }
      } else if (!previous?.some(p => JSON.stringify(p) === JSON.stringify(o))) {
        const columns = Object.keys(o).filter(k => !entity.key!.names.includes(k));

        ops.push(
          new SqlInsert(
            sqlId(entity.table!),
            List(columns.map(c => sqlId(entity.scalar(c).column!))),
            List(columns.map(c => primitiveToSql(o[c])[0]))
          )
        );
      }
    }

    await uow.commit();

    ops.push(...uow.operations.map(o => o.sql));

    return ops;
  }
}

class DifferUnitOfWork extends UnitOfWorkSpy {
  constructor(metadata: Metadata) {
    super(metadata);
  }

  protected override createParameter(value: Primitive | Date, _: readonly unknown[]) {
    return primitiveToSql(value)[0];
  }
}
