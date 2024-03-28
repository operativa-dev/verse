export enum TokenType {
  And,
  AndAnd,
  Caret,
  Colon,
  Dot,
  DotDotDot,
  Eq,
  EqEq,
  EqEqEq,
  EqGt,
  Gt,
  GtEq,
  GtGt,
  GtGtGt,
  Lt,
  LtEq,
  LtLt,
  Minus,
  MinusEq,
  MinusMinus,
  Not,
  NotEq,
  NotEqEq,
  Percent,
  PercentEq,
  Pipe,
  PipePipe,
  Plus,
  PlusEq,
  PlusPlus,
  Question,
  QuestionDot,
  QuestionQuestion,
  Slash,
  SlashEq,
  Star,
  StarEq,
  StarStar,
  StarStarEq,
  Tilde,

  LParen,
  RParen,
  LBracket,
  RBracket,
  LBrace,
  RBrace,
  Comma,
  Semicolon,
  Backtick,
  DollarBrace,

  Await,
  Delete,
  False,
  In,
  InstanceOf,
  New,
  Null,
  Super,
  This,
  True,
  Typeof,
  Undefined,
  Void,

  Identifier,
  Number,
  String,
  Regex,

  Comment,
  WhiteSpace,
  Eof,
}

export type Token = {
  type: TokenType;
  value?: string | number | RegExp | bigint | undefined;
};

export const tokenNames = [
  "&",
  "&&",
  "^",
  ":",
  ".",
  "...",
  "=",
  "==",
  "===",
  "=>",
  ">",
  ">=",
  ">>",
  ">>>",
  "<",
  "<=",
  "<<",
  "-",
  "-=",
  "--",
  "!",
  "!=",
  "!==",
  "%",
  "%=",
  "|",
  "||",
  "+",
  "+=",
  "++",
  "?",
  "?.",
  "??",
  "/",
  "/=",
  "*",
  "*=",
  "**",
  "**=",
  "~",

  "(",
  ")",
  "[",
  "]",
  "{",
  "}",
  ",",
  ";",
  "`",
  "${",

  "await",
  "delete",
  "false",
  "in",
  "instanceof",
  "new",
  "null",
  "super",
  "this",
  "true",
  "typeof",
  "undefined",
  "void",

  "identifier",
  "number",
  "string",
  "regex",

  "comment",
  "ws",
  "eof",
];

const keywords = new Map([
  ["await", TokenType.Await],
  ["delete", TokenType.Delete],
  ["false", TokenType.False],
  ["in", TokenType.In],
  ["instanceof", TokenType.InstanceOf],
  ["new", TokenType.New],
  ["null", TokenType.Null],
  ["super", TokenType.Super],
  ["this", TokenType.This],
  ["true", TokenType.True],
  ["typeof", TokenType.Typeof],
  ["undefined", TokenType.Undefined],
  ["void", TokenType.Void],
]);

export function nameof(token: TokenType) {
  return tokenNames[token];
}

const idStart = /[$_\p{ID_Start}]/u;
const idContinue = /[$_\p{ID_Continue}]/u;
const ws = /\p{White_Space}/u;
const digit = /\d/;
const octal = /[0-7]/;
const hex = /[0-9a-fA-F]/;
const reFlags = /[gimsuy]/;

export function* lex(expr: string) {
  if (!expr || expr.trim() === "") {
    throw new Error("Empty expression.");
  }

  let i = 0;
  let type: TokenType;
  let last: TokenType | undefined;
  let value: string | number | RegExp | bigint | undefined;
  let template = [false];

  while (i < expr.length) {
    const char = expr[i]!;

    switch (char) {
      case "=":
        if (expr[i + 1] === "=") {
          if (expr[i + 2] === "=") {
            type = TokenType.EqEqEq;
            i += 2;
          } else {
            type = TokenType.EqEq;
            i++;
          }
        } else if (expr[i + 1] === ">") {
          type = TokenType.EqGt;
          i++;
        } else {
          type = TokenType.Eq;
        }
        break;

      case ".":
        if (expr[i + 1] === "." && expr[i + 2] === ".") {
          type = TokenType.DotDotDot;
          i += 2;
        } else if (i + 1 < expr.length && digit.test(expr[i + 1]!)) {
          [value, i] = lexNumber(char, expr, i, true);
          type = TokenType.Number;
        } else {
          type = TokenType.Dot;
        }
        break;

      case '"':
      case "'":
        [value, i] = lexString(expr, i, char);
        type = TokenType.String;
        break;

      case "`":
        template[template.length - 1] = !template.at(-1);
        type = TokenType.Backtick;

        if (template.at(-1)) {
          [value, i] = lexString(expr, i, char);
          yield { type };
          type = TokenType.String;
        }

        break;

      case "+":
        if (expr[i + 1] === "+") {
          type = TokenType.PlusPlus;
          i++;
        } else if (expr[i + 1] === "=") {
          type = TokenType.PlusEq;
          i++;
        } else {
          type = TokenType.Plus;
        }
        break;

      case "-":
        if (expr[i + 1] === "-") {
          type = TokenType.MinusMinus;
          i++;
        } else if (expr[i + 1] === "=") {
          type = TokenType.MinusEq;
          i++;
        } else {
          type = TokenType.Minus;
        }
        break;

      case "*":
        if (expr[i + 1] === "*") {
          if (expr[i + 2] === "=") {
            type = TokenType.StarStarEq;
            i += 2;
          } else {
            type = TokenType.StarStar;
            i++;
          }
        } else if (expr[i + 1] === "=") {
          type = TokenType.StarEq;
          i++;
        } else {
          type = TokenType.Star;
        }
        break;

      case "/":
        if (expr[i + 1] === "/") {
          type = TokenType.Comment;
          i++;

          outer: while (true) {
            if (i + 1 === expr.length) {
              break;
            }

            switch (expr[i + 1]) {
              case "\n":
              case "\r":
              case "\u2028":
              case "\u2029":
                break outer;
            }

            i++;
          }
        } else if (expr[i + 1] === "*") {
          type = TokenType.Comment;
          i++;

          while (true) {
            if (i + 2 >= expr.length) {
              break;
            }

            if (expr[i + 1] === "*") {
              if (expr[i + 2] === "/") {
                i += 2;
                break;
              }
            }

            i++;
          }
        } else if (expr[i + 1] === "=") {
          type = TokenType.SlashEq;
          i++;
        } else {
          // noinspection JSUnusedAssignment
          if (
            last === undefined ||
            last === TokenType.LParen ||
            last === TokenType.Comma ||
            last === TokenType.Eq ||
            last === TokenType.Colon ||
            last === TokenType.LBracket ||
            last === TokenType.Not ||
            last === TokenType.And ||
            last === TokenType.Pipe ||
            last === TokenType.Question ||
            last === TokenType.LBrace ||
            last === TokenType.RBrace ||
            last === TokenType.Semicolon
          ) {
            type = TokenType.Regex;
            i++;
            value = "";
            let inSet = false;

            while (true) {
              const next = expr[i];

              if (
                next === undefined ||
                next === "\n" ||
                next === "\r" ||
                next === "\u2028" ||
                next === "\u2029"
              ) {
                throw new Error("Unterminated regular expression literal.");
              }

              if (next === "\\") {
                value += "\\";
                i++;
              } else if (next === "[") {
                inSet = true;
              } else if (next === "]") {
                inSet = false;
              } else if (!inSet && next === "/") {
                break;
              }

              value += expr[i++];
            }

            let flags = "";

            while (true) {
              const next = expr[i + 1];

              if (next === undefined || !reFlags.test(next)) {
                break;
              }

              flags += next;
              i++;
            }

            value = new RegExp(value, flags);
          } else {
            type = TokenType.Slash;
          }
        }
        break;

      case "&":
        if (expr[i + 1] === "&") {
          type = TokenType.AndAnd;
          i++;
        } else {
          type = TokenType.And;
        }
        break;

      case "|":
        if (expr[i + 1] === "|") {
          type = TokenType.PipePipe;
          i++;
        } else {
          type = TokenType.Pipe;
        }
        break;

      case "<":
        if (expr[i + 1] === "=") {
          type = TokenType.LtEq;
          i++;
        } else if (expr[i + 1] === "<") {
          type = TokenType.LtLt;
          i++;
        } else {
          type = TokenType.Lt;
        }
        break;

      case ">":
        if (expr[i + 1] === "=") {
          type = TokenType.GtEq;
          i++;
        } else if (expr[i + 1] === ">") {
          if (expr[i + 2] === ">") {
            type = TokenType.GtGtGt;
            i += 2;
          } else {
            type = TokenType.GtGt;
            i++;
          }
        } else {
          type = TokenType.Gt;
        }
        break;

      case "!":
        if (expr[i + 1] === "=") {
          if (expr[i + 2] === "=") {
            type = TokenType.NotEqEq;
            i += 2;
          } else {
            type = TokenType.NotEq;
            i++;
          }
        } else {
          type = TokenType.Not;
        }
        break;

      case "%":
        if (expr[i + 1] === "=") {
          type = TokenType.PercentEq;
          i++;
        } else {
          type = TokenType.Percent;
        }
        break;

      case "?":
        if (expr[i + 1] === "?") {
          type = TokenType.QuestionQuestion;
          i++;
        } else if (expr[i + 1] === ".") {
          type = TokenType.QuestionDot;
          i++;
        } else {
          type = TokenType.Question;
        }
        break;

      case ":":
        type = TokenType.Colon;
        break;

      case ",":
        type = TokenType.Comma;
        break;

      case ";":
        type = TokenType.Semicolon;
        break;

      case "(":
        type = TokenType.LParen;
        break;

      case ")":
        type = TokenType.RParen;
        break;

      case "[":
        type = TokenType.LBracket;
        break;

      case "]":
        type = TokenType.RBracket;
        break;

      case "{":
        type = TokenType.LBrace;
        break;

      case "}":
        type = TokenType.RBrace;

        if (template.length > 1) {
          template.pop();
        }

        if (template.at(-1)) {
          [value, i] = lexString(expr, i, "`");
          yield { type };
          type = TokenType.String;
        }

        break;

      case "~":
        type = TokenType.Tilde;
        break;

      case "^":
        type = TokenType.Caret;
        break;

      default:
        if (ws.test(char)) {
          type = TokenType.WhiteSpace;

          while (true) {
            const next = expr[i + 1];

            if (next === undefined || !ws.test(next)) {
              break;
            }

            i++;
          }

          break;
        }

        if (idStart.test(char)) {
          if (expr[i + 1] === "{") {
            type = TokenType.DollarBrace;
            i++;
            template.push(false);
            break;
          }

          value = char;

          while (true) {
            const next = expr[i + 1];

            if (next === undefined || !idContinue.test(expr[i + 1]!)) {
              break;
            }

            value += next;
            i++;
          }

          const t = keywords.get(value);

          if (t) {
            type = t;
            value = undefined;
          } else {
            type = TokenType.Identifier;
          }

          break;
        }

        if (digit.test(char)) {
          [value, i] = lexNumber(char, expr, i, false);
          type = TokenType.Number;

          break;
        }

        throw new Error(`Unexpected character: ${char}`);
    }

    if (type !== TokenType.WhiteSpace && type !== TokenType.Comment) {
      yield value !== undefined ? { type, value } : { type };
      last = type;
    }

    value = undefined;
    i++;
  }

  yield { type: TokenType.Eof };
}

function lexString(expr: string, i: number, char: string) {
  let value = "";
  const template = char === "`";

  while (true) {
    let next = expr[++i];

    if (next === undefined || next === "\n" || next === "\r") {
      throw new Error("Unterminated string literal.");
    }

    if (next === char) {
      if (template) {
        i--;
      }
      break;
    }

    if (next === "\\") {
      next = expr[++i];

      switch (next) {
        case "b":
          value += "\b";
          break;

        case "f":
          value += "\f";
          break;

        case "n":
          value += "\n";
          break;

        case "r":
          value += "\r";
          break;

        case "t":
          value += "\t";
          break;

        case "v":
          value += "\v";
          break;

        case "0":
          value += "\0";
          break;

        case "\n":
        case "\r":
        case "\u2028":
        case "\u2029":
          break;

        case "x":
          if (i + 3 >= expr.length) {
            throw new Error("Hexadecimal digit expected.");
          }

          const first = expr[++i]!;
          const second = expr[++i]!;

          if (!hex.test(first) || !hex.test(second)) {
            throw new Error("Hexadecimal digit expected.");
          }

          value += String.fromCharCode(parseInt(first + second, 16));

          break;

        case "u":
          if (i + 2 >= expr.length) {
            throw new Error("Hexadecimal digit expected.");
          }

          next = expr[i + 1]!;

          if (hex.test(next)) {
            if (i + 5 >= expr.length) {
              throw new Error("Hexadecimal digit expected.");
            }

            const first = expr[++i]!;
            const second = expr[++i]!;
            const third = expr[++i]!;
            const fourth = expr[++i]!;

            if (!hex.test(first) || !hex.test(second) || !hex.test(third) || !hex.test(fourth)) {
              throw new Error("Hexadecimal digit expected.");
            }

            value += String.fromCharCode(parseInt(first + second + third + fourth, 16));
          } else if (next === "{") {
            let code = "";
            i++;

            while (true) {
              next = expr[++i]!;

              if (next === "}") {
                break;
              }

              if (next === undefined || !hex.test(next)) {
                throw new Error("Unterminated Unicode escape sequence.");
              }

              code += next;
            }

            const point = parseInt(code, 16);

            if (point > 0x10ffff) {
              throw new Error(
                "An extended Unicode escape allows only values between 0x0 and 0x10FFFF."
              );
            }

            value += String.fromCodePoint(point);
          }

          break;

        default:
          value += next;
      }
    } else if (template && next === "$" && expr[i + 1] === "{") {
      i--;
      break;
    } else {
      value += next;
    }
  }
  return [value, i] as const;
}

function lexNumber(value: string, expr: string, i: number, seenDot: boolean) {
  if (!seenDot) {
    if (value === "0") {
      if (expr[i + 1] === "x" || expr[i + 1] === "X") {
        return lexHex("", expr, i + 1);
      }

      if (expr[i + 1] === "b" || expr[i + 1] === "B") {
        return lexBinary("", expr, i + 1);
      }

      if (expr[i + 1] === "o" || expr[i + 1] === "O") {
        return lexOctal("", expr, i + 1);
      }
    }

    if ((value === "-" || value === "+") && expr[i + 1] === "0") {
      if (expr[i + 2] === "x" || expr[i + 2] === "X") {
        return lexHex(value, expr, i + 2);
      }

      if (expr[i + 2] === "o" || expr[i + 2] === "O") {
        return lexOctal(value, expr, i + 2);
      }

      if (expr[i + 2] === "b" || expr[i + 2] === "B") {
        return lexBinary(value, expr, i + 2);
      }
    }
  }

  let seenE = false;
  let sepAllowed = digit.test(value);

  while (true) {
    const next = expr[i + 1];

    if (next === undefined) {
      break;
    }
    if (!digit.test(next)) {
      if (!seenDot && !seenE && next === ".") {
        value += next;
        i++;
        seenDot = true;
        continue;
      } else if (!seenE) {
        if (next === "e" || next === "E") {
          value += next;
          i++;
          seenE = true;
          continue;
        }
      } else if (next === "+" || next === "-") {
        value += next;
        i++;
        continue;
      }

      if (next === "n") {
        return [BigInt(value), i + 1] as const;
      }

      if (sepAllowed && next === "_" && i + 2 < expr.length && digit.test(expr[i + 2]!)) {
        sepAllowed = false;
        i++;
        continue;
      }

      break;
    } else {
      sepAllowed = true;
    }

    value += next;
    i++;
  }

  return [Number(value), i] as const;
}

function lexBinary(value: string, expr: string, i: number) {
  return based(value, expr, i, 2, "0b", c => c === "0" || c === "1");
}

function lexOctal(value: string, expr: string, i: number) {
  return based(value, expr, i, 8, "0o", c => octal.test(c));
}

function lexHex(value: string, expr: string, i: number) {
  return based(value, expr, i, 16, "0x", c => hex.test(c));
}

function based(
  value: string,
  expr: string,
  i: number,
  base: number,
  prefix: string,
  test: (s: string) => boolean
) {
  let sepAllowed = false;

  while (true) {
    const next = expr[i + 1];

    if (next === undefined) {
      break;
    }

    if (!test(next)) {
      if (next === "n") {
        return [BigInt(prefix + value), i + 1] as const;
      }

      if (sepAllowed && next === "_" && i + 2 < expr.length && test(expr[i + 2]!)) {
        sepAllowed = false;
        i++;
      } else {
        break;
      }
    }

    value += expr[++i];
    sepAllowed = true;
  }

  return [parseInt(value, base), i] as const;
}

export type baseTypes = string | number | boolean | RegExp | null | undefined | object | bigint;

export interface Expression {
  type: string;
  [key: string]: baseTypes | Expression | Array<baseTypes | Expression>;
}

export interface ArrowFunctionExpression extends Expression {
  type: "ArrowFunctionExpression";
  params: Expression[] | null;
  body: Expression;
  async?: boolean;
}

export interface ArrayExpression extends Expression {
  type: "ArrayExpression";
  elements: Expression[];
}

export interface BinaryExpression extends Expression {
  type: "BinaryExpression";
  operator: string;
  left: Expression;
  right: Expression;
}

export interface CallExpression extends Expression {
  type: "CallExpression";
  arguments: Expression[];
  callee: Expression;
}

export interface CommaExpression extends Expression {
  type: "CommaExpression";
  expressions: Expression[];
}

export interface ConditionalExpression extends Expression {
  type: "ConditionalExpression";
  test: Expression;
  consequent: Expression;
  alternate: Expression;
}

export interface IdentifierExpression extends Expression {
  type: "IdentifierExpression";
  name: string;
}

export interface LiteralExpression extends Expression {
  type: "LiteralExpression";
  value: boolean | number | string | RegExp | null | undefined | bigint;
  raw: string;
}

export interface MemberExpression extends Expression {
  type: "MemberExpression";
  computed: boolean;
  object: Expression;
  property: Expression;
  optional?: boolean;
}

export interface NewExpression extends Expression {
  type: "NewExpression";
  arguments: Expression[];
  callee: Expression;
}

export interface ObjectExpression extends Expression {
  type: "ObjectExpression";
  properties: (PropertyExpression | SpreadExpression)[];
}

export interface PropertyExpression extends Expression {
  type: "PropertyExpression";
  computed: boolean;
  key: Expression;
  shorthand: boolean;
  value?: Expression;
}

export interface SpreadExpression extends Expression {
  type: "SpreadExpression";
  argument: Expression;
}

export interface TaggedTemplateExpression extends Expression {
  type: "TaggedTemplateExpression";
  readonly tag: Expression;
  readonly quasi: TemplateLiteralExpression;
}

export interface TemplateLiteralExpression extends Expression {
  type: "TemplateLiteralExpression";
  quasis: TemplateExpression[];
  expressions: Expression[];
}

export interface TemplateExpression extends Expression {
  type: "TemplateExpression";
  value: { cooked: string; raw?: string };
  tail: boolean;
}

export interface ThisExpression extends Expression {
  type: "ThisExpression";
}

export interface UnaryExpression extends Expression {
  type: "UnaryExpression";
  operator: string;
  argument: Expression;
  prefix: boolean;
}

export function parse(expression: string) {
  return new Parser(expression).parse();
}

class Parser {
  #tokens: Generator<Token>;
  #cur: Token;
  #prev!: Token;
  #la1: Token | undefined;
  #la2: Token | undefined;

  constructor(expression: string) {
    this.#tokens = lex(expression);
    this.#cur = this.#tokens.next().value;
  }

  parse() {
    const expr = this.#expr();

    if (!this.#eof) {
      throw new Error(`Unexpected token: '${nameof(this.#cur.type)}'.`);
    }

    return expr;
  }

  #expr() {
    return this.#comma();
  }

  #comma() {
    let args = [this.#spread()];

    while (this.#check(TokenType.Comma)) {
      this.#next();
      args.push(this.#spread());
    }

    return args.length === 1 ? args[0]! : { type: "CommaExpression", expressions: args };
  }

  #spread() {
    if (this.#match(TokenType.DotDotDot)) {
      return { type: "SpreadExpression", argument: this.#arrow() };
    }

    return this.#arrow();
  }

  #arrow(): Expression {
    let expr: Expression;
    let params: Expression[] | undefined;

    if (this.#check(TokenType.LParen) && this.#peek()?.type === TokenType.RParen) {
      this.#next();
      this.#next();
      params = [];
    }

    if (!params) {
      expr = this.#ternary();

      if (expr.type === "CommaExpression") {
        params = (expr as CommaExpression).expressions;
      } else {
        params = [expr];
      }
    }

    if (
      this.#check(TokenType.Comma) &&
      this.#peek()?.type === TokenType.RParen &&
      this.#peek()?.type === TokenType.EqGt
    ) {
      this.#next();
    }

    if (params && this.#match(TokenType.EqGt)) {
      const body = this.#spread();

      return {
        type: "ArrowFunctionExpression",
        params: params.length === 0 ? null : params,
        body,
      };
    }

    return expr!;
  }

  #ternary() {
    let expr = this.#logicalOr();

    if (this.#match(TokenType.Question)) {
      const consequent = this.#spread();
      this.#consume(TokenType.Colon, "Expected ':' after ternary operator.");
      const alternate = this.#spread();

      expr = { type: "ConditionalExpression", test: expr, consequent, alternate };
    }

    return expr;
  }

  #logicalOr() {
    let expr = this.#logicalAnd();

    while (this.#match(TokenType.PipePipe, TokenType.QuestionQuestion)) {
      const op = this.#prev;
      const right = this.#logicalAnd();
      expr = { type: "BinaryExpression", operator: nameof(op.type), left: expr, right };
    }

    return expr;
  }

  #logicalAnd() {
    let expr = this.#bitwiseOr();

    while (this.#match(TokenType.AndAnd)) {
      const right = this.#bitwiseOr();
      expr = { type: "BinaryExpression", operator: "&&", left: expr, right };
    }

    return expr;
  }

  #bitwiseOr() {
    let expr = this.#bitwiseXor();

    while (this.#match(TokenType.Pipe)) {
      const right = this.#bitwiseXor();
      expr = { type: "BinaryExpression", operator: "|", left: expr, right };
    }

    return expr;
  }

  #bitwiseXor() {
    let expr = this.#bitwiseAnd();

    while (this.#match(TokenType.Caret)) {
      const right = this.#bitwiseAnd();
      expr = { type: "BinaryExpression", operator: "^", left: expr, right };
    }

    return expr;
  }

  #bitwiseAnd() {
    let expr = this.#equality();

    while (this.#match(TokenType.And)) {
      const right = this.#equality();
      expr = { type: "BinaryExpression", operator: "&", left: expr, right };
    }

    return expr;
  }

  #equality() {
    let expr = this.#relational();

    while (this.#match(TokenType.EqEq, TokenType.EqEqEq, TokenType.NotEq, TokenType.NotEqEq)) {
      const op = this.#prev;
      const right = this.#relational();
      expr = { type: "BinaryExpression", operator: nameof(op.type), left: expr, right };
    }

    return expr;
  }

  #relational() {
    let expr = this.#bitwiseShift();

    while (
      this.#match(
        TokenType.Lt,
        TokenType.LtEq,
        TokenType.Gt,
        TokenType.GtEq,
        TokenType.In,
        TokenType.InstanceOf
      )
    ) {
      const op = this.#prev;
      const right = this.#bitwiseShift();
      expr = { type: "BinaryExpression", operator: nameof(op.type), left: expr, right };
    }

    return expr;
  }

  #bitwiseShift() {
    let expr = this.#additive();

    while (this.#match(TokenType.LtLt, TokenType.GtGt, TokenType.GtGtGt)) {
      const op = this.#prev;
      const right = this.#additive();
      expr = { type: "BinaryExpression", operator: nameof(op.type), left: expr, right };
    }

    return expr;
  }

  #additive() {
    let expr = this.#multiplicative();

    while (this.#match(TokenType.Plus, TokenType.Minus)) {
      const op = this.#prev;
      const right = this.#multiplicative();
      expr = { type: "BinaryExpression", operator: nameof(op.type), left: expr, right };
    }

    return expr;
  }

  #multiplicative() {
    let expr = this.#exponent();

    while (this.#match(TokenType.Slash, TokenType.Star, TokenType.Percent)) {
      const op = this.#prev;
      const right = this.#prefix();
      expr = { type: "BinaryExpression", operator: nameof(op.type), left: expr, right };
    }

    return expr;
  }

  #exponent(): Expression {
    let left = this.#prefix();

    if (this.#match(TokenType.StarStar)) {
      const right = this.#exponent();
      return { type: "BinaryExpression", operator: "**", left, right };
    }

    return left;
  }

  #prefix(): Expression {
    if (
      this.#match(
        TokenType.PlusPlus,
        TokenType.MinusMinus,
        TokenType.Not,
        TokenType.Tilde,
        TokenType.Plus,
        TokenType.Minus,
        TokenType.Typeof,
        TokenType.Void,
        TokenType.Delete,
        TokenType.Await
      )
    ) {
      const op = this.#prev;
      const argument = this.#prefix();

      return {
        type: "UnaryExpression",
        operator: nameof(op.type),
        argument,
        prefix: true,
      };
    }

    return this.#postfix();
  }

  #postfix() {
    let expr = this.#new();

    while (this.#match(TokenType.PlusPlus, TokenType.MinusMinus)) {
      const op = this.#prev;

      expr = {
        type: "UnaryExpression",
        operator: nameof(op.type),
        argument: expr,
        prefix: false,
      };
    }

    return expr;
  }

  #new() {
    if (this.#match(TokenType.New)) {
      const expr = this.#member();

      if (expr.type !== "CallExpression") {
        throw new Error("Expected '(' before arguments.");
      }

      const call = expr as CallExpression;

      return {
        type: "NewExpression",
        callee: call.callee,
        arguments: call.arguments,
      };
    }

    return this.#member();
  }

  #member() {
    let expr = this.#primary();

    while (true) {
      if (this.#match(TokenType.Dot, TokenType.QuestionDot, TokenType.LBracket)) {
        let optional = undefined;
        let computed = false;
        let property: Expression;

        if (this.#prev.type === TokenType.QuestionDot) {
          optional = true;
        }

        if (this.#prev.type === TokenType.LBracket) {
          computed = true;
          property = this.#expr();
        } else {
          const ident = this.#consume(TokenType.Identifier, "Expected property name after '.'.");
          property = { type: "IdentifierExpression", name: ident.value as string };
        }

        if (computed) {
          this.#consume(TokenType.RBracket, "Expected ']' after computed property.");
        }

        expr = {
          type: "MemberExpression",
          computed,
          object: expr,
          optional,
          property,
        };
      } else if (this.#check(TokenType.LParen)) {
        this.#consume(TokenType.LParen, "Expected '(' before arguments.");

        const args: Expression[] = [];

        while (!this.#check(TokenType.RParen) && !this.#eof) {
          const expr = this.#spread();

          args.push(expr);

          if (this.#check(TokenType.Comma)) {
            this.#next();
          }
        }

        this.#consume(TokenType.RParen, "Expected ')' after arguments.");

        expr = { type: "CallExpression", callee: expr, arguments: args };
      } else {
        break;
      }
    }

    if (this.#check(TokenType.Backtick)) {
      const template = this.#primary() as TemplateLiteralExpression;

      expr = {
        type: "TaggedTemplateExpression",
        tag: expr,
        quasi: template,
      };
    }

    return expr;
  }

  #primary() {
    if (this.#match(TokenType.Identifier)) {
      return { type: "IdentifierExpression", name: this.#prev.value as string };
    }

    if (this.#match(TokenType.False)) {
      return { type: "LiteralExpression", value: false };
    }

    if (this.#match(TokenType.True)) {
      return { type: "LiteralExpression", value: true };
    }

    if (this.#match(TokenType.Null)) {
      return { type: "LiteralExpression", value: null };
    }

    if (this.#match(TokenType.Undefined)) {
      return { type: "LiteralExpression", value: undefined };
    }

    if (this.#match(TokenType.This)) {
      return { type: "ThisExpression" };
    }

    if (this.#match(TokenType.Super)) {
      return { type: "IdentifierExpression", name: "super" };
    }

    if (this.#match(TokenType.Number, TokenType.String, TokenType.Regex)) {
      return { type: "LiteralExpression", value: this.#prev.value };
    }

    if (this.#match(TokenType.Backtick)) {
      const quasis: TemplateExpression[] = [];
      const expressions: Expression[] = [];

      while (!this.#check(TokenType.Backtick) && !this.#eof) {
        if (this.#match(TokenType.DollarBrace)) {
          const expr = this.#expr();

          expressions.push(expr);

          this.#consume(TokenType.RBrace, "Expected '}' after expression.");
        } else {
          const expr = this.#primary() as LiteralExpression;

          quasis.push({
            type: "TemplateExpression",
            value: { cooked: expr.value as string },
            tail: false,
          });
        }
      }

      quasis.at(-1)!.tail = true;

      this.#consume(TokenType.Backtick, "Expected '`' after template literal.");

      return { type: "TemplateLiteralExpression", quasis, expressions };
    }

    if (this.#match(TokenType.LParen)) {
      const expr = this.#expr();
      this.#consume(TokenType.RParen, "Expected ')' after expression.");
      return expr;
    }

    if (this.#match(TokenType.LBracket)) {
      const elements: Expression[] = [];

      while (!this.#check(TokenType.RBracket) && !this.#eof) {
        const expr = this.#spread();

        elements.push(expr);

        if (this.#check(TokenType.Comma)) {
          this.#next();
        }
      }

      this.#consume(TokenType.RBracket, "Expected ']' after array elements.");

      return { type: "ArrayExpression", elements };
    }

    if (this.#match(TokenType.LBrace)) {
      const properties: (PropertyExpression | SpreadExpression)[] = [];

      while (!this.#check(TokenType.RBrace)) {
        const expr = this.#spread();

        if (this.#check(TokenType.Colon)) {
          const key = expr;
          this.#next();
          const value = this.#spread();

          properties.push({
            type: "PropertyExpression",
            key,
            value,
            shorthand: false,
            computed: key.type === "ArrayExpression",
          });
        } else {
          if (expr.type === "SpreadExpression") {
            properties.push(expr as SpreadExpression);
          } else if (expr.type !== "IdentifierExpression") {
            throw new Error("':' expected.");
          } else {
            properties.push({
              type: "PropertyExpression",
              key: expr,
              value: expr,
              shorthand: true,
              computed: false,
            });
          }
        }

        if (this.#check(TokenType.Comma)) {
          this.#next();
        }
      }

      this.#consume(TokenType.RBrace, "Expected '}' after object properties.");

      return {
        type: "ObjectExpression",
        properties,
      };
    }

    throw new Error(`Unexpected token: '${nameof(this.#cur.type)}'.`);
  }

  #match(...types: TokenType[]) {
    for (const type of types) {
      if (this.#check(type)) {
        this.#next();
        return true;
      }
    }

    return false;
  }

  #consume(type: TokenType, message: string) {
    if (!this.#check(type)) {
      throw new Error(message);
    }

    return this.#next();
  }

  #check(type: TokenType) {
    return this.#cur.type == type;
  }

  #next() {
    if (!this.#eof) {
      this.#prev = this.#cur;
      this.#cur = this.#la1 ?? this.#tokens.next().value;
      this.#la1 = this.#la2;
      this.#la2 = undefined;
    }

    return this.#prev;
  }

  #peek() {
    if (this.#eof) {
      return this.#cur;
    }

    if (!this.#la1) {
      this.#la1 = this.#tokens.next().value;

      return this.#la1;
    }

    if (!this.#la2) {
      this.#la2 = this.#tokens.next().value;
    }

    return this.#la2;
  }

  get #eof() {
    return this.#cur.type === TokenType.Eof;
  }
}
