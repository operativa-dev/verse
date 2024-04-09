// noinspection JSUnusedLocalSymbols

import { verse } from "@operativa/verse";
import {
  AbstractConvention,
  Convention,
} from "@operativa/verse/conventions/convention";
import { MaxLengthDefault } from "@operativa/verse/conventions/database";
import { EntityModel } from "@operativa/verse/model/model";

/// on-adding-conventions
// @ts-ignore
const db = verse({
  // @ts-ignore
  config: {
    conventions: (conventions: Convention[]) => {
      // Modify the conventions here.
      return conventions;
    },
  },
});
///

/// existing
// @ts-ignore
const db = verse({
  // @ts-ignore
  config: {
    conventions: (conventions: Convention[]) => {
      const index = conventions.findIndex(c => c instanceof MaxLengthDefault);

      conventions[index] = new MaxLengthDefault(100);

      return conventions;
    },
  },
});
///

/// custom-1
class PrefixTables extends AbstractConvention {
  constructor(readonly prefix = "tbl_") {
    super();
  }

  override visitEntity(entity: EntityModel) {
    return entity.withTable(this.prefix + entity.table);
  }
}
///

/// custom-2
// @ts-ignore
const db = verse({
  // @ts-ignore
  config: {
    conventions: (conventions: Convention[]) => {
      conventions.push(new PrefixTables());

      return conventions;
    },
  },
});
///
