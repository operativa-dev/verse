import { SqlRewriter } from "./rewriter.js";
import {
  sqlBin,
  SqlBinary,
  SqlBinaryOperator,
  SqlIsNotNull,
  SqlIsNull,
  SqlNode,
  SqlParameter,
} from "./sql.js";

export class SqlNullSemantics extends SqlRewriter {
  override visitBinary(binary: SqlBinary) {
    const leftNullable = !!binary.left.nullable;
    const rightNullable = !!binary.right.nullable;
    const rightParameter = binary.right instanceof SqlParameter;
    const leftParameter = binary.left instanceof SqlParameter;

    function compensate(binary: SqlBinary, op: SqlBinaryOperator, left: SqlNode, right: SqlNode) {
      return sqlBin(binary, op, sqlBin(left, "and", right));
    }

    if (binary.op === "=") {
      if (
        (leftNullable && rightParameter) ||
        (rightNullable && leftParameter) ||
        (leftNullable && rightNullable)
      ) {
        return compensate(binary, "or", new SqlIsNull(binary.left), new SqlIsNull(binary.right));
      }
    }

    if (binary.op === "<>") {
      if (leftNullable && rightParameter) {
        return compensate(binary, "or", new SqlIsNull(binary.right), new SqlIsNotNull(binary.left));
      }

      if (rightNullable && leftParameter) {
        return compensate(binary, "or", new SqlIsNull(binary.left), new SqlIsNotNull(binary.right));
      }

      if (leftNullable && rightNullable) {
        return compensate(
          binary,
          "or",
          new SqlIsNotNull(binary.left),
          new SqlIsNotNull(binary.right)
        );
      }
    }

    return super.visitBinary(binary);
  }
}
