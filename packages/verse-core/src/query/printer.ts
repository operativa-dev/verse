import { ArrowExpression } from "@jsep-plugin/arrow";
import { NewExpression } from "@jsep-plugin/new";
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
import { ExpressionVisitor } from "./expression.js";

export function printExpr(expr: Expression) {
  return new ExpressionPrinter().visit(expr);
}

class ExpressionPrinter extends ExpressionVisitor<string> {
  protected override visitArrayExpression(expr: ArrayExpression) {
    return `[${expr.elements.map(e => this.visit(e)).join(", ")}]`;
  }

  protected override visitArrowExpression(expr: ArrowExpression) {
    return `(${expr.params?.map(p => this.visit(p)).join(", ")}) => ${this.visit(expr.body)}`;
  }

  protected override visitBinaryExpression(expr: BinaryExpression) {
    return `(${this.visit(expr.left)} ${expr.operator} ${this.visit(expr.right)})`;
  }

  protected override visitCallExpression(expr: CallExpression) {
    return `${this.visit(expr.callee)}(${expr.arguments.map(arg => this.visit(arg)).join(", ")})`;
  }

  protected override visitIdentifier(expr: Identifier) {
    return expr.name;
  }

  protected override visitLiteral(expr: Literal) {
    return `${expr.raw}`;
  }

  protected override visitMemberExpression(expr: MemberExpression) {
    return `${this.visit(expr.object)}.${this.visit(expr.property)}`;
  }

  protected override visitNewExpression(expr: NewExpression) {
    return `new ${this.visit(expr.callee)}(${expr.arguments
      .map(arg => this.visit(arg))
      .join(", ")})`;
  }

  protected override visitObjectExpression(expr: ObjectExpression) {
    return `{${expr.properties.map(p => this.visit(p)).join(", ")}}`;
  }

  protected override visitProperty(expr: Property) {
    return `${this.visit(expr.key)}${expr.value ? ": " + this.visit(expr.value) : ""}`;
  }

  protected override visitSpreadElement(expr: SpreadElement) {
    return `...${this.visit(expr.argument)}`;
  }

  protected override visitTemplateElement(expr: TemplateElement) {
    return expr.value.raw;
  }

  protected override visitTemplateLiteral(expr: TemplateLiteral) {
    return (
      "`" +
      expr.quasis
        .map(
          (quasi, i) =>
            this.visit(quasi) +
            (expr.expressions[i] ? "${" + this.visit(expr.expressions[i]) + "}" : "")
        )
        .join("") +
      "`"
    );
  }

  protected override visitUnaryExpression(expr: UnaryExpression) {
    return `(${expr.operator}${this.visit(expr.argument)})`;
  }
}
