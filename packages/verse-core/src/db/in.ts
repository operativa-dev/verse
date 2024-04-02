import { List } from "immutable";
import { SqlRewriter } from "./rewriter.js";
import { SqlComposite, SqlIn, SqlNode, SqlParameter } from "./sql.js";

export function explodeIn(node: SqlIn, args: unknown[]) {
  if (node.values instanceof SqlParameter) {
    const arg = args[node.values.id];

    if (Array.isArray(arg)) {
      args.splice(node.values.id, 1);
      const offset = args.length;
      args.push(...arg);

      const values = new SqlComposite(List(arg.map((_, i) => new SqlParameter(offset + i))));

      return new SqlIn(node.operand, values);
    }
  }

  return node;
}

export function hasInParameter(sql: SqlNode): boolean {
  const detector = new InParameterDetector();
  sql.accept(detector);
  return detector.detected;
}

class InParameterDetector extends SqlRewriter {
  detected = false;

  override visitIn(_in: SqlIn) {
    if (_in.values instanceof SqlParameter) {
      this.detected = true;
    }

    return super.visitIn(_in);
  }
}
