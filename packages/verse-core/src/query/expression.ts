import {
  ArrayExpression,
  ArrowFunctionExpression,
  BinaryExpression,
  CallExpression,
  Expression,
  IdentifierExpression,
  LiteralExpression,
  MemberExpression,
  NewExpression,
  ObjectExpression,
  PropertyExpression,
  SpreadExpression,
  TemplateExpression,
  TemplateLiteralExpression,
  UnaryExpression,
} from "./parser.js";

export interface EntityExpression extends Expression {
  type: "EntityExpression";
  name: string;
}

export interface ConstantExpression extends Expression {
  type: "ConstantExpression";
  value: any;
}

export abstract class ExpressionVisitor<T = unknown> {
  visit(expr?: Expression): T {
    if (!expr) {
      return undefined as T;
    }

    switch (expr.type) {
      case "ArrayExpression":
        return this.visitArrayExpression(expr as ArrayExpression);

      case "ArrowFunctionExpression":
        return this.visitArrowExpression(expr as ArrowFunctionExpression);

      case "BinaryExpression":
        return this.visitBinaryExpression(expr as BinaryExpression);

      case "CallExpression":
        return this.visitCallExpression(expr as CallExpression);

      case "EntityExpression":
        return this.visitEntityExpression(expr as EntityExpression);

      case "IdentifierExpression":
        return this.visitIdentifier(expr as IdentifierExpression);

      case "LiteralExpression":
        return this.visitLiteral(expr as LiteralExpression);

      case "MemberExpression":
        return this.visitMemberExpression(expr as MemberExpression);

      case "NewExpression":
        return this.visitNewExpression(expr as NewExpression);

      case "ObjectExpression":
        return this.visitObjectExpression(expr as ObjectExpression);

      case "PropertyExpression":
        return this.visitProperty(expr as PropertyExpression);

      case "SpreadExpression":
        return this.visitSpreadElement(expr as SpreadExpression);

      case "TemplateExpression":
        return this.visitTemplateElement(expr as TemplateExpression);

      case "TemplateLiteralExpression":
        return this.visitTemplateLiteral(expr as TemplateLiteralExpression);

      case "UnaryExpression":
        return this.visitUnaryExpression(expr as UnaryExpression);

      default:
        throw new Error(`Unknown expression type: ${expr.type}`);
    }
  }

  protected visitArrayExpression(expr: ArrayExpression) {
    return this.visitUnhandled(expr);
  }

  protected visitArrowExpression(expr: ArrowFunctionExpression) {
    return this.visitUnhandled(expr);
  }

  protected visitBinaryExpression(expr: BinaryExpression) {
    return this.visitUnhandled(expr);
  }

  protected visitCallExpression(expr: CallExpression) {
    return this.visitUnhandled(expr);
  }

  protected visitEntityExpression(expr: EntityExpression) {
    return this.visitUnhandled(expr);
  }

  protected visitIdentifier(expr: IdentifierExpression) {
    return this.visitUnhandled(expr);
  }

  protected visitLiteral(expr: LiteralExpression) {
    return this.visitUnhandled(expr);
  }

  protected visitMemberExpression(expr: MemberExpression) {
    return this.visitUnhandled(expr);
  }

  protected visitNewExpression(expr: NewExpression) {
    return this.visitUnhandled(expr);
  }

  protected visitObjectExpression(expr: ObjectExpression) {
    return this.visitUnhandled(expr);
  }

  protected visitProperty(expr: PropertyExpression) {
    return this.visitUnhandled(expr);
  }

  protected visitSpreadElement(expr: SpreadExpression) {
    return this.visitUnhandled(expr);
  }

  protected visitTemplateElement(expr: TemplateExpression) {
    return this.visitUnhandled(expr);
  }
  protected visitTemplateLiteral(expr: TemplateLiteralExpression) {
    return this.visitUnhandled(expr);
  }

  protected visitUnaryExpression(expr: UnaryExpression) {
    return this.visitUnhandled(expr);
  }

  // @ts-ignore
  protected visitUnhandled(expr: Expression) {
    return undefined as T;
  }
}
