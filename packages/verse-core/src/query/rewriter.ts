import { ArrowExpression } from "@jsep-plugin/arrow";
import { ObjectExpression, Property } from "@jsep-plugin/object";
import { SpreadElement } from "@jsep-plugin/spread";
import { TemplateElement, TemplateLiteral } from "@jsep-plugin/template";
import {
  ArrayExpression,
  BinaryExpression,
  CallExpression,
  Expression,
  Identifier,
  Literal,
  MemberExpression,
  UnaryExpression,
} from "jsep";
import { EntityExpression, ExpressionVisitor } from "./expression.js";

export class ExpressionRewriter extends ExpressionVisitor<Expression> {
  protected override visitArrayExpression(expr: ArrayExpression) {
    const [elements, changed] = this.rewriteArray(expr.elements);

    return changed ? { ...expr, elements } : expr;
  }

  protected override visitArrowExpression(expr: ArrowExpression) {
    const body = this.visit(expr.body);

    return body !== expr.body ? { ...expr, body } : expr;
  }

  protected override visitBinaryExpression(expr: BinaryExpression) {
    const left = this.visit(expr.left);
    const right = this.visit(expr.right);

    return left !== expr.left || right !== expr.right ? { ...expr, left, right } : expr;
  }

  protected override visitCallExpression(expr: CallExpression) {
    const [newArguments, changed] = this.rewriteArray(expr.arguments);

    return changed ? { ...expr, arguments: newArguments } : expr;
  }

  protected override visitEntityExpression(expr: EntityExpression) {
    return expr;
  }

  protected override visitIdentifier(expr: Identifier) {
    return expr;
  }

  protected override visitLiteral(expr: Literal) {
    return expr;
  }

  protected override visitMemberExpression(expr: MemberExpression) {
    const object = this.visit(expr.object);
    const property = this.visit(expr.property);

    return object !== expr.object || property !== expr.property
      ? { ...expr, object, property }
      : expr;
  }

  protected override visitObjectExpression(expr: ObjectExpression) {
    const [properties, changed] = this.rewriteArray(expr.properties);

    return changed ? { ...expr, properties } : expr;
  }

  protected override visitProperty(expr: Property) {
    const value = this.visit(expr.value);

    return value !== expr.value ? { ...expr, value } : expr;
  }

  protected override visitSpreadElement(expr: SpreadElement) {
    const argument = this.visit(expr.argument);

    return argument !== expr.argument ? { ...expr, argument } : expr;
  }

  protected override visitTemplateElement(expr: TemplateElement) {
    return expr;
  }

  protected override visitTemplateLiteral(expr: TemplateLiteral) {
    const [expressions, expressionsChanged] = this.rewriteArray(expr.expressions);
    const [quasis, quasisChanged] = this.rewriteArray(expr.quasis);

    return expressionsChanged || quasisChanged ? { ...expr, expressions, quasis } : expr;
  }

  protected override visitUnaryExpression(expr: UnaryExpression) {
    const argument = this.visit(expr.argument);

    return argument !== expr.argument ? { ...expr, argument: argument } : expr;
  }

  rewriteArray<T extends Expression>(array: T[]) {
    let changed = false;

    for (let i = 0; i < array.length; i++) {
      const item = array[i]!;
      const newItem = this.visit(item);
      if (newItem !== item) {
        changed = true;
        array[i] = newItem as T;
      }
    }

    return [array, changed] as const;
  }
}
