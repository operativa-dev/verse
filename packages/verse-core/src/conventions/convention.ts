/**
 * Conventions are used to apply a set of rules to the model. E.g. to apply default naming conventions.
 *
 * @packageDocumentation
 */

import { AbstractModel } from "../model/model.js";
import { ModelRewriter } from "../model/rewriter.js";

/**
 * Represents a convention that can be applied to a model.
 */
export interface Convention {
  /**
   * Applies the convention to the specified model.
   *
   * @param model The model to apply the convention to.
   * @returns A new instance if the model was modified; otherwise, the original model.
   */
  apply<TModel extends AbstractModel>(model: TModel): TModel;
}

/**
 * Base class for conventions that use {@link ModelRewriter}.
 */
export abstract class AbstractConvention extends ModelRewriter implements Convention {
  apply<TModel extends AbstractModel>(model: TModel) {
    return model.accept(this) as TModel;
  }
}
