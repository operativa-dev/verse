import { ExpressionVisitor } from "./expression.js";
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

export function printExpr(expr: Expression) {
  return new ExpressionPrinter().visit(expr);
}

class ExpressionPrinter extends ExpressionVisitor<string> {
  protected override visitArrayExpression(expr: ArrayExpression) {
    return `[${expr.elements.map(e => this.visit(e)).join(", ")}]`;
  }

  protected override visitArrowExpression(expr: ArrowFunctionExpression) {
    return `(${expr.params?.map(p => this.visit(p)).join(", ")}) => ${this.visit(expr.body)}`;
  }

  protected override visitBinaryExpression(expr: BinaryExpression) {
    return `(${this.visit(expr.left)} ${expr.operator} ${this.visit(expr.right)})`;
  }

  protected override visitCallExpression(expr: CallExpression) {
    return `${this.visit(expr.callee)}(${expr.arguments.map(arg => this.visit(arg)).join(", ")})`;
  }

  protected override visitIdentifierExpression(expr: IdentifierExpression) {
    return expr.name;
  }

  protected override visitLiteralExpression(expr: LiteralExpression) {
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

  protected override visitPropertyExpression(expr: PropertyExpression) {
    return `${this.visit(expr.key)}${expr.value ? ": " + this.visit(expr.value) : ""}`;
  }

  protected override visitSpreadExpression(expr: SpreadExpression) {
    return `...${this.visit(expr.argument)}`;
  }

  protected override visitTemplateExpression(expr: TemplateExpression) {
    return String(expr.value);
  }

  protected override visitTemplateLiteralExpression(expr: TemplateLiteralExpression) {
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
