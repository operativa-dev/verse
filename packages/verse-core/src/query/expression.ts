import jsepArrow, { ArrowExpression } from "@jsep-plugin/arrow";
import jsepComment from "@jsep-plugin/comment";
import jsepNew, { NewExpression } from "@jsep-plugin/new";
import jsepObject, { ObjectExpression, Property } from "@jsep-plugin/object";
import jsepSpread, { SpreadElement } from "@jsep-plugin/spread";
import jsepTemplateLiteral, { TemplateElement, TemplateLiteral } from "@jsep-plugin/template";
import jsep, {
  ArrayExpression,
  BinaryExpression,
  CallExpression,
  Expression,
  Identifier,
  Literal,
  MemberExpression,
  UnaryExpression,
} from "jsep";

jsep.literals["undefined"] = undefined;

jsep.plugins.register(jsepNew, jsepArrow, jsepComment, jsepObject, jsepSpread, jsepTemplateLiteral);

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
        return this.visitArrowExpression(expr as ArrowExpression);

      case "BinaryExpression":
        return this.visitBinaryExpression(expr as BinaryExpression);

      case "CallExpression":
        return this.visitCallExpression(expr as CallExpression);

      case "EntityExpression":
        return this.visitEntityExpression(expr as EntityExpression);

      case "Identifier":
        return this.visitIdentifier(expr as Identifier);

      case "Literal":
        return this.visitLiteral(expr as Literal);

      case "MemberExpression":
        return this.visitMemberExpression(expr as MemberExpression);

      case "NewExpression":
        return this.visitNewExpression(expr as NewExpression);

      case "ObjectExpression":
        return this.visitObjectExpression(expr as ObjectExpression);

      case "Property":
        return this.visitProperty(expr as Property);

      case "SpreadElement":
        return this.visitSpreadElement(expr as SpreadElement);

      case "TemplateElement":
        return this.visitTemplateElement(expr as TemplateElement);

      case "TemplateLiteral":
        return this.visitTemplateLiteral(expr as TemplateLiteral);

      case "UnaryExpression":
        return this.visitUnaryExpression(expr as UnaryExpression);

      default:
        throw new Error(`Unknown expression type: ${expr.type}`);
    }
  }

  protected visitArrayExpression(expr: ArrayExpression) {
    return this.visitUnhandled(expr);
  }

  protected visitArrowExpression(expr: ArrowExpression) {
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

  protected visitIdentifier(expr: Identifier) {
    return this.visitUnhandled(expr);
  }

  protected visitLiteral(expr: Literal) {
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

  protected visitProperty(expr: Property) {
    return this.visitUnhandled(expr);
  }

  protected visitSpreadElement(expr: SpreadElement) {
    return this.visitUnhandled(expr);
  }

  protected visitTemplateElement(expr: TemplateElement) {
    return this.visitUnhandled(expr);
  }
  protected visitTemplateLiteral(expr: TemplateLiteral) {
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
