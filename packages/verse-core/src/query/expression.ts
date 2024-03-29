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
  TaggedTemplateExpression,
  TemplateExpression,
  TemplateLiteralExpression,
  UnaryExpression,
} from "./parser.js";

export interface EntityExpression extends Expression {
  type: "EntityExpression";
  name: string;
}

export function constant(value: any) {
  return {
    type: "ConstantExpression",
    value,
  };
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
        return this.visitIdentifierExpression(expr as IdentifierExpression);

      case "LiteralExpression":
        return this.visitLiteralExpression(expr as LiteralExpression);

      case "MemberExpression":
        return this.visitMemberExpression(expr as MemberExpression);

      case "NewExpression":
        return this.visitNewExpression(expr as NewExpression);

      case "ObjectExpression":
        return this.visitObjectExpression(expr as ObjectExpression);

      case "PropertyExpression":
        return this.visitPropertyExpression(expr as PropertyExpression);

      case "SpreadExpression":
        return this.visitSpreadExpression(expr as SpreadExpression);

      case "TaggedTemplateExpression":
        return this.visitTaggedTemplateExpression(expr as TaggedTemplateExpression);

      case "TemplateExpression":
        return this.visitTemplateExpression(expr as TemplateExpression);

      case "TemplateLiteralExpression":
        return this.visitTemplateLiteralExpression(expr as TemplateLiteralExpression);

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

  protected visitIdentifierExpression(expr: IdentifierExpression) {
    return this.visitUnhandled(expr);
  }

  protected visitLiteralExpression(expr: LiteralExpression) {
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

  protected visitPropertyExpression(expr: PropertyExpression) {
    return this.visitUnhandled(expr);
  }

  protected visitSpreadExpression(expr: SpreadExpression) {
    return this.visitUnhandled(expr);
  }

  protected visitTemplateExpression(expr: TemplateExpression) {
    return this.visitUnhandled(expr);
  }

  protected visitTaggedTemplateExpression(expr: TaggedTemplateExpression) {
    return this.visitUnhandled(expr);
  }

  protected visitTemplateLiteralExpression(expr: TemplateLiteralExpression) {
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
