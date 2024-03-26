import { EntityExpression, ExpressionVisitor } from "./expression.js";
import {
  ArrayExpression,
  ArrowFunctionExpression,
  BinaryExpression,
  CallExpression,
  Expression,
  IdentifierExpression,
  LiteralExpression,
  MemberExpression,
  ObjectExpression,
  PropertyExpression,
  SpreadExpression,
  TemplateExpression,
  TemplateLiteralExpression,
  UnaryExpression,
} from "./parser.js";

export class ExpressionRewriter extends ExpressionVisitor<Expression> {
  protected override visitArrayExpression(expr: ArrayExpression) {
    const [elements, changed] = this.rewriteArray(expr.elements);

    return changed ? { ...expr, elements } : expr;
  }

  protected override visitArrowExpression(expr: ArrowFunctionExpression) {
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

  protected override visitIdentifier(expr: IdentifierExpression) {
    return expr;
  }

  protected override visitLiteral(expr: LiteralExpression) {
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

  protected override visitProperty(expr: PropertyExpression) {
    const value = this.visit(expr.value);

    return value !== expr.value ? { ...expr, value } : expr;
  }

  protected override visitSpreadElement(expr: SpreadExpression) {
    const argument = this.visit(expr.argument);

    return argument !== expr.argument ? { ...expr, argument } : expr;
  }

  protected override visitTemplateElement(expr: TemplateExpression) {
    return expr;
  }

  protected override visitTemplateLiteral(expr: TemplateLiteralExpression) {
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
