import { DeepReadonly } from "ts-essentials";

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
  Eof,
}

export type Token = {
  type: TokenType;
  value?: string | number | RegExp | bigint | undefined;
};

const TokenNames = [
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
  "eof",
];

const Tokens = {
  And: { type: TokenType.And },
  AndAnd: { type: TokenType.AndAnd },
  Caret: { type: TokenType.Caret },
  Colon: { type: TokenType.Colon },
  Dot: { type: TokenType.Dot },
  DotDotDot: { type: TokenType.DotDotDot },
  Eq: { type: TokenType.Eq },
  EqEq: { type: TokenType.EqEq },
  EqEqEq: { type: TokenType.EqEqEq },
  EqGt: { type: TokenType.EqGt },
  Gt: { type: TokenType.Gt },
  GtEq: { type: TokenType.GtEq },
  GtGt: { type: TokenType.GtGt },
  GtGtGt: { type: TokenType.GtGtGt },
  Lt: { type: TokenType.Lt },
  LtEq: { type: TokenType.LtEq },
  LtLt: { type: TokenType.LtLt },
  Minus: { type: TokenType.Minus },
  MinusEq: { type: TokenType.MinusEq },
  MinusMinus: { type: TokenType.MinusMinus },
  Not: { type: TokenType.Not },
  NotEq: { type: TokenType.NotEq },
  NotEqEq: { type: TokenType.NotEqEq },
  Percent: { type: TokenType.Percent },
  PercentEq: { type: TokenType.PercentEq },
  Pipe: { type: TokenType.Pipe },
  PipePipe: { type: TokenType.PipePipe },
  Plus: { type: TokenType.Plus },
  PlusEq: { type: TokenType.PlusEq },
  PlusPlus: { type: TokenType.PlusPlus },
  Question: { type: TokenType.Question },
  QuestionDot: { type: TokenType.QuestionDot },
  QuestionQuestion: { type: TokenType.QuestionQuestion },
  Slash: { type: TokenType.Slash },
  SlashEq: { type: TokenType.SlashEq },
  Star: { type: TokenType.Star },
  StarEq: { type: TokenType.StarEq },
  StarStar: { type: TokenType.StarStar },
  StarStarEq: { type: TokenType.StarStarEq },
  Tilde: { type: TokenType.Tilde },
  LParen: { type: TokenType.LParen },
  RParen: { type: TokenType.RParen },
  LBracket: { type: TokenType.LBracket },
  RBracket: { type: TokenType.RBracket },
  LBrace: { type: TokenType.LBrace },
  RBrace: { type: TokenType.RBrace },
  Comma: { type: TokenType.Comma },
  Semicolon: { type: TokenType.Semicolon },
  Backtick: { type: TokenType.Backtick },
  DollarBrace: { type: TokenType.DollarBrace },
  Await: { type: TokenType.Await },
  Delete: { type: TokenType.Delete },
  False: { type: TokenType.False },
  In: { type: TokenType.In },
  InstanceOf: { type: TokenType.InstanceOf },
  New: { type: TokenType.New },
  Null: { type: TokenType.Null },
  Super: { type: TokenType.Super },
  This: { type: TokenType.This },
  True: { type: TokenType.True },
  Typeof: { type: TokenType.Typeof },
  Undefined: { type: TokenType.Undefined },
  Void: { type: TokenType.Void },
  Eof: { type: TokenType.Eof },
};

export function nameof(token: TokenType) {
  return TokenNames[token];
}

function ws(cp: number) {
  return (
    cp === 0x20 ||
    cp === 0x09 ||
    cp === 0x0b ||
    cp === 0x0c ||
    cp === 0xa0 ||
    (cp >= 0x1680 &&
      [
        0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009,
        0x200a, 0x202f, 0x205f, 0x3000, 0xfeff,
      ].indexOf(cp) >= 0)
  );
}

function lt(cp: number) {
  return cp === 0x0a || cp === 0x0d || cp === 0x2028 || cp === 0x2029;
}

function digit(cp: number) {
  return cp >= 0x30 && cp <= 0x39;
}

function octal(cp: number) {
  return cp >= 0x30 && cp <= 0x37;
}

function hex(cp: number) {
  return (cp >= 0x30 && cp <= 0x39) || (cp >= 0x41 && cp <= 0x46) || (cp >= 0x61 && cp <= 0x66);
}

function regexFlag(cp: number) {
  return cp === 0x67 || cp === 0x69 || cp === 0x6d || cp === 0x75 || cp === 0x73 || cp === 0x79;
}

function char(cp: number) {
  return cp < 0x10000
    ? String.fromCharCode(cp)
    : String.fromCharCode(0xd800 + ((cp - 0x10000) >> 10)) +
        String.fromCharCode(0xdc00 + ((cp - 0x10000) & 1023));
}

const ID_START = /\p{ID_Start}/u;

function idStart(cp: number) {
  return (
    cp === 0x24 ||
    cp === 0x5f ||
    (cp >= 0x41 && cp <= 0x5a) ||
    (cp >= 0x61 && cp <= 0x7a) ||
    (cp >= 0x80 && ID_START.test(char(cp)))
  );
}

const ID_CONTINUE = /\p{ID_Continue}/u;

function idContinue(cp: number) {
  return (
    cp === 0x24 ||
    cp === 0x5f ||
    (cp >= 0x41 && cp <= 0x5a) ||
    (cp >= 0x61 && cp <= 0x7a) ||
    (cp >= 0x30 && cp <= 0x39) ||
    (cp >= 0x80 && ID_CONTINUE.test(char(cp)))
  );
}

function keyword(id: string) {
  switch (id.length) {
    case 2:
      return id === "in" ? Tokens.In : undefined;
    case 3:
      return id === "new" ? Tokens.New : undefined;
    case 4:
      return id === "true"
        ? Tokens.True
        : id === "null"
          ? Tokens.Null
          : id === "this"
            ? Tokens.This
            : id === "void"
              ? Tokens.Void
              : undefined;
    case 5:
      return id === "false"
        ? Tokens.False
        : id === "super"
          ? Tokens.Super
          : id === "await"
            ? Tokens.Await
            : undefined;
    case 6:
      return id === "typeof" ? Tokens.Typeof : id === "delete" ? Tokens.Delete : undefined;
    case 9:
      return id === "undefined" ? Tokens.Undefined : undefined;
    case 10:
      return id === "instanceof" ? Tokens.InstanceOf : undefined;
    default:
      return undefined;
  }
}

export function lex(expr: string): readonly Readonly<Token>[] {
  if (!expr || expr.trim() === "") {
    throw new Error("Empty expression.");
  }

  const tokens: Token[] = [];

  let i = 0;

  let token: Token | undefined;
  let last: Token | undefined;
  let value: string | number | RegExp | bigint | undefined;
  let template = [false];
  let braces: boolean[] = [];

  while (i < expr.length) {
    const cp = expr.charCodeAt(i);

    if (ws(cp) || lt(cp)) {
      i++;
      continue;
    }

    if (idStart(cp)) {
      if (template.at(-1) && expr.charCodeAt(i + 1) === 0x7b) {
        token = Tokens.DollarBrace;
        i++;
        template.push(false);
        braces.push(true);
      } else {
        const start = i;

        while (i < expr.length && idContinue(expr.charCodeAt(i + 1))) {
          i++;
        }

        const value = expr.slice(start, i + 1);
        token = { type: TokenType.Identifier, value };

        if (value.length > 1) {
          const newToken = keyword(value);

          if (newToken) {
            token = newToken;
          }
        }
      }
    } else if (cp === 0x28) {
      token = Tokens.LParen;
    } else if (cp === 0x29) {
      token = Tokens.RParen;
    } else if (cp === 0x3b) {
      token = Tokens.Semicolon;
    } else if (cp === 0x22 || cp == 0x27) {
      [value, i] = lexString(expr, i, expr.charCodeAt(i));
      token = { type: TokenType.String, value };
    } else if (digit(cp)) {
      [value, i] = lexNumber(cp, expr, i);
      token = { type: TokenType.Number, value };
    } else {
      const cp1 = expr.charCodeAt(i + 1);
      const cp2 = expr.charCodeAt(i + 2);

      switch (cp) {
        case 0x3a:
          token = Tokens.Colon;
          break;

        case 0x2c:
          token = Tokens.Comma;
          break;

        case 0x5b:
          token = Tokens.LBracket;
          break;

        case 0x5d:
          token = Tokens.RBracket;
          break;

        case 0x7b:
          token = Tokens.LBrace;
          braces.push(false);
          break;

        case 0x7d:
          const brace = braces.pop();

          if (brace) {
            template.pop();
          }

          if (template.at(-1)) {
            [value, i] = lexString(expr, i, 0x60);
            tokens.push(Tokens.RBrace);
            token = { type: TokenType.String, value };
          } else {
            token = Tokens.RBrace;
          }

          break;

        case 0x3d:
          if (cp1 === 0x3d) {
            if (cp2 === 0x3d) {
              token = Tokens.EqEqEq;
              i += 2;
            } else {
              token = Tokens.EqEq;
              i++;
            }
          } else if (cp1 === 0x3e) {
            token = Tokens.EqGt;
            i++;
          } else {
            token = Tokens.Eq;
          }
          break;

        case 0x2e:
          if (cp1 === 0x2e && cp2 === 0x2e) {
            token = Tokens.DotDotDot;
            i += 2;
          } else if (i + 1 < expr.length && digit(cp1)) {
            [value, i] = lexNumber(cp, expr, i, true);
            token = { type: TokenType.Number, value };
          } else {
            token = Tokens.Dot;
          }
          break;

        case 0x60:
          template[template.length - 1] = !template.at(-1);

          if (template.at(-1)) {
            [value, i] = lexString(expr, i, expr.charCodeAt(i));
            tokens.push(Tokens.Backtick);
            token = { type: TokenType.String, value };
          } else {
            token = Tokens.Backtick;
          }

          break;

        case 0x2b:
          if (cp1 === 0x2b) {
            token = Tokens.PlusPlus;
            i++;
          } else if (cp1 === 0x3d) {
            token = Tokens.PlusEq;
            i++;
          } else {
            token = Tokens.Plus;
          }
          break;

        case 0x2d:
          if (cp1 === 0x2d) {
            token = Tokens.MinusMinus;
            i++;
          } else if (cp1 === 0x3d) {
            token = Tokens.MinusEq;
            i++;
          } else {
            token = Tokens.Minus;
          }
          break;

        case 0x2a:
          if (cp1 === 0x2a) {
            if (cp2 === 0x3d) {
              token = Tokens.StarStarEq;
              i += 2;
            } else {
              token = Tokens.StarStar;
              i++;
            }
          } else if (cp1 === 0x3d) {
            token = Tokens.StarEq;
            i++;
          } else {
            token = Tokens.Star;
          }
          break;

        case 0x2f:
          if (cp1 === 0x2f) {
            i++;
            while (++i < expr.length && !lt(expr.charCodeAt(i))) {}
            continue;
          } else if (cp1 === 0x2a) {
            i++;
            while (
              ++i + 1 < expr.length &&
              !(expr.charCodeAt(i) === 0x2a && expr.charCodeAt(i + 1) === 0x2f)
            ) {}
            i += 2;
            continue;
          } else if (cp1 === 0x3d) {
            token = Tokens.SlashEq;
            i++;
          } else {
            // noinspection JSUnusedAssignment
            if (
              last === undefined ||
              last === Tokens.LParen ||
              last === Tokens.Comma ||
              last === Tokens.Eq ||
              last === Tokens.Colon ||
              last === Tokens.LBracket ||
              last === Tokens.Not ||
              last === Tokens.And ||
              last === Tokens.Pipe ||
              last === Tokens.Question ||
              last === Tokens.LBrace ||
              last === Tokens.RBrace ||
              last === Tokens.Semicolon
            ) {
              i++;
              value = "";
              let inSet = false;

              while (true) {
                const cp = expr.charCodeAt(i);

                if (isNaN(cp) || lt(cp)) {
                  throw new Error("Unterminated regular expression literal.");
                }

                if (cp === 0x5c) {
                  value += "\\";
                  i++;
                } else if (cp === 0x5b) {
                  inSet = true;
                } else if (cp === 0x5d) {
                  inSet = false;
                } else if (!inSet && cp === 0x2f) {
                  break;
                }

                value += expr[i++];
              }

              let flags = "";

              while (true) {
                const next = expr.charCodeAt(i + 1);

                if (next === undefined || !regexFlag(next)) {
                  break;
                }

                flags += expr[++i];
              }

              token = { type: TokenType.Regex, value: new RegExp(value, flags) };
            } else {
              token = Tokens.Slash;
            }
          }
          break;

        case 0x26:
          if (cp1 === 0x26) {
            token = Tokens.AndAnd;
            i++;
          } else {
            token = Tokens.And;
          }
          break;

        case 0x7c:
          if (cp1 === 0x7c) {
            token = Tokens.PipePipe;
            i++;
          } else {
            token = Tokens.Pipe;
          }
          break;

        case 0x3c:
          if (cp1 === 0x3d) {
            token = Tokens.LtEq;
            i++;
          } else if (cp1 === 0x3c) {
            token = Tokens.LtLt;
            i++;
          } else {
            token = Tokens.Lt;
          }
          break;

        case 0x3e:
          if (cp1 === 0x3d) {
            token = Tokens.GtEq;
            i++;
          } else if (cp1 === 0x3e) {
            if (cp2 === 0x3e) {
              token = Tokens.GtGtGt;
              i += 2;
            } else {
              token = Tokens.GtGt;
              i++;
            }
          } else {
            token = Tokens.Gt;
          }
          break;

        case 0x21:
          if (cp1 === 0x3d) {
            if (cp2 === 0x3d) {
              token = Tokens.NotEqEq;
              i += 2;
            } else {
              token = Tokens.NotEq;
              i++;
            }
          } else {
            token = Tokens.Not;
          }
          break;

        case 0x25:
          if (cp1 === 0x3d) {
            token = Tokens.PercentEq;
            i++;
          } else {
            token = Tokens.Percent;
          }
          break;

        case 0x3f:
          if (cp1 === 0x3f) {
            token = Tokens.QuestionQuestion;
            i++;
          } else if (cp1 === 0x2e) {
            token = Tokens.QuestionDot;
            i++;
          } else {
            token = Tokens.Question;
          }
          break;

        case 0x7e:
          token = Tokens.Tilde;
          break;

        case 0x5e:
          token = Tokens.Caret;
          break;

        default:
          throw new Error(`Unexpected character: ${expr[i]}`);
      }
    }

    tokens.push(token!);
    last = token;
    token = undefined;
    i++;
  }

  tokens.push(Tokens.Eof);

  return tokens;
}

function lexString(expr: string, i: number, char: number) {
  let s = "";
  let j = i + 1;

  const template = char === 0x60;

  while (true) {
    let cp = expr.charCodeAt(++i);

    if (isNaN(cp) || cp === 0x0a || cp === 0x0d) {
      throw new Error("Unterminated string literal.");
    }

    if (cp === char) {
      if (i > j) {
        s += expr.slice(j, i);
      }
      if (template) {
        i--;
      }
      break;
    }

    if (cp === 0x5c) {
      if (i > j) {
        s += expr.slice(j, i);
      }
      cp = expr.charCodeAt(++i);

      switch (cp) {
        case 0x6e:
          s += "\n";
          break;

        case 0x74:
          s += "\t";
          break;

        case 0x62:
          s += "\b";
          break;

        case 0x66:
          s += "\f";
          break;

        case 0x72:
          s += "\r";
          break;

        case 0x76:
          s += "\v";
          break;

        case 0x30:
          s += "\0";
          break;

        case 0x0a:
        case 0x0d:
        case 0x2028:
        case 0x2029:
          break;

        case 0x78:
          if (i + 3 >= expr.length || !hex(expr.charCodeAt(++i)) || !hex(expr.charCodeAt(++i))) {
            throw new Error("Hexadecimal digit expected.");
          }

          s += String.fromCharCode(parseInt(expr.slice(i - 2, i), 16));
          break;

        case 0x75:
          if (i + 2 >= expr.length) {
            throw new Error("Hexadecimal digit expected.");
          }

          cp = expr.charCodeAt(++i);

          if (hex(cp)) {
            if (
              i + 5 >= expr.length ||
              !hex(cp) ||
              !hex(expr.charCodeAt(++i)) ||
              !hex(expr.charCodeAt(++i)) ||
              !hex(expr.charCodeAt(++i))
            ) {
              throw new Error("Hexadecimal digit expected.");
            }

            s += String.fromCharCode(parseInt(expr.slice(i - 3, i + 1), 16));
          } else if (cp === 0x7b) {
            let j = i + 1;

            while (true) {
              cp = expr.charCodeAt(++i);

              if (cp === 0x7d) {
                break;
              }

              if (!hex(cp)) {
                throw new Error("Unterminated Unicode escape sequence.");
              }
            }

            const point = parseInt(expr.slice(j, i), 16);

            if (point > 0x10ffff) {
              throw new Error(
                "An extended Unicode escape allows only values between 0x0 and 0x10FFFF."
              );
            }

            s += String.fromCodePoint(point);
          }

          break;

        default:
          s += expr[i];
      }

      j = i + 1;
    } else if (template && cp === 0x24 && expr.codePointAt(i + 1) === 0x7b) {
      if (i > j) {
        s += expr.slice(j, i);
      }
      i--;
      break;
    }
  }

  return [s, i] as const;
}

function lexNumber(cp: number, expr: string, i: number, seenDot = false) {
  let value = expr[i]!;

  if (!seenDot) {
    const cp1 = expr.charCodeAt(i + 1);

    if (cp === 0x30) {
      if (cp1 === 0x78 || cp1 === 0x58) {
        return lexHex("", expr, i + 1);
      }

      if (cp1 === 0x62 || cp1 === 0x42) {
        return lexBinary("", expr, i + 1);
      }

      if (cp1 === 0x6f || cp1 === 0x4f) {
        return lexOctal("", expr, i + 1);
      }
    }

    if ((cp === 0x2d || cp === 0x2b) && cp1 === 0x30) {
      const cp2 = expr.charCodeAt(i + 2);

      if (cp2 === 0x78 || cp2 === 0x58) {
        return lexHex(value, expr, i + 2);
      }

      if (cp2 === 0x62 || cp2 === 0x42) {
        return lexOctal(value, expr, i + 2);
      }

      if (cp2 === 0x6f || cp2 === 0x4f) {
        return lexBinary(value, expr, i + 2);
      }
    }
  }

  let seenE = false;
  let sepAllowed = digit(cp);

  while (true) {
    let cp = expr.charCodeAt(i + 1);

    if (isNaN(cp)) {
      break;
    }

    const next = expr[i + 1];

    if (!digit(cp)) {
      if (!seenDot && !seenE && cp === 0x2e) {
        value += next;
        i++;
        seenDot = true;
        continue;
      } else if (!seenE && (cp === 0x65 || cp === 0x45)) {
        value += next;
        i++;
        seenE = true;
        continue;
      } else if (cp === 0x2b || cp === 0x2d) {
        value += next;
        i++;
        continue;
      }

      if (cp === 0x6e) {
        return [BigInt(value), i + 1] as const;
      }

      if (sepAllowed && cp === 0x5f && digit(expr.charCodeAt(i + 2))) {
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
  return based(value, expr, i, 2, "0b", cp => cp === 0x30 || cp === 0x31);
}

function lexOctal(value: string, expr: string, i: number) {
  return based(value, expr, i, 8, "0o", cp => octal(cp));
}

function lexHex(value: string, expr: string, i: number) {
  return based(value, expr, i, 16, "0x", cp => hex(cp));
}

function based(
  value: string,
  expr: string,
  i: number,
  base: number,
  prefix: string,
  test: (cp: number) => boolean
) {
  let sep = false;

  while (i + 1 < expr.length) {
    const cp = expr.charCodeAt(i + 1);

    if (!test(cp)) {
      if (cp === 0x6e) {
        return [BigInt(prefix + value), i + 1] as const;
      }

      if (sep && cp === 0x5f && test(expr.charCodeAt(i + 2))) {
        sep = false;
        i++;
      } else {
        break;
      }
    }

    value += expr[++i];
    sep = true;
  }

  return [parseInt(value, base), i] as const;
}

export type baseTypes =
  | string
  | number
  | boolean
  | RegExp
  | null
  | undefined
  | object
  | bigint
  | unknown;

export interface Expression {
  type: string;
  [key: string]: baseTypes | Expression | Array<baseTypes | Expression>;
}

export interface ArrowFunctionExpression extends Expression {
  type: "ArrowFunctionExpression";
  params: readonly Expression[];
  body: Expression;
  async?: boolean;
}

export interface ArrayExpression extends Expression {
  type: "ArrayExpression";
  elements: readonly Expression[];
}

export interface BinaryExpression extends Expression {
  type: "BinaryExpression";
  operator: string;
  left: Expression;
  right: Expression;
}

export interface CallExpression extends Expression {
  type: "CallExpression";
  arguments: readonly Expression[];
  callee: Expression;
}

export interface CommaExpression extends Expression {
  type: "CommaExpression";
  expressions: readonly Expression[];
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
  arguments: readonly Expression[];
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
  quasis: readonly TemplateExpression[];
  expressions: readonly Expression[];
}

export interface TemplateExpression extends Expression {
  type: "TemplateExpression";
  value: { cooked: string; raw?: string };
  tail: boolean;
}

export interface ThisExpression extends Expression {
  type: "ThisExpression";
}

export interface SuperExpression extends Expression {
  type: "SuperExpression";
}

export interface UnaryExpression extends Expression {
  type: "UnaryExpression";
  operator: string;
  argument: Expression;
  prefix: boolean;
}

export function parse(expression: string): DeepReadonly<Expression> {
  return new Parser(expression).parse();
}

const Expressions = {
  False: { type: "LiteralExpression", value: false },
  True: { type: "LiteralExpression", value: true },
  Undefined: { type: "LiteralExpression", value: undefined },
  Null: { type: "LiteralExpression", value: null },
  This: { type: "ThisExpression" },
  Super: { type: "SuperExpression" },
};

const Precedence: number[] = [];

Precedence[TokenType.Comma] = 1;
Precedence[TokenType.DotDotDot] = 2;
Precedence[TokenType.EqGt] = 2;
Precedence[TokenType.Question] = 2;
Precedence[TokenType.PipePipe] = 3;
Precedence[TokenType.QuestionQuestion] = 3;
Precedence[TokenType.AndAnd] = 4;
Precedence[TokenType.Pipe] = 5;
Precedence[TokenType.Caret] = 6;
Precedence[TokenType.And] = 7;
Precedence[TokenType.EqEq] = 8;
Precedence[TokenType.EqEqEq] = 8;
Precedence[TokenType.NotEq] = 8;
Precedence[TokenType.NotEqEq] = 8;
Precedence[TokenType.Lt] = 9;
Precedence[TokenType.LtEq] = 9;
Precedence[TokenType.Gt] = 9;
Precedence[TokenType.GtEq] = 9;
Precedence[TokenType.In] = 9;
Precedence[TokenType.InstanceOf] = 9;
Precedence[TokenType.LtLt] = 10;
Precedence[TokenType.GtGt] = 10;
Precedence[TokenType.GtGtGt] = 10;
Precedence[TokenType.Plus] = 11;
Precedence[TokenType.Minus] = 11;
Precedence[TokenType.Star] = 12;
Precedence[TokenType.Slash] = 12;
Precedence[TokenType.Percent] = 12;
Precedence[TokenType.StarStar] = 13;
Precedence[TokenType.PlusPlus] = 15;
Precedence[TokenType.MinusMinus] = 15;
Precedence[TokenType.Dot] = 17;
Precedence[TokenType.QuestionDot] = 17;
Precedence[TokenType.LBracket] = 17;
Precedence[TokenType.Backtick] = 17;
Precedence[TokenType.LParen] = 17;

class Parser {
  readonly #tokens: ReadonlyArray<Token>;

  #pos = 0;

  constructor(expression: string) {
    this.#tokens = lex(expression);
  }

  parse() {
    const expr = this.#expr();

    if (this.#cur.type !== TokenType.Eof) {
      throw new Error(`Unexpected token: '${nameof(this.#cur.type)}'.`);
    }

    return expr;
  }

  #expr(precedence = 0): Expression {
    let token = this.#next();
    let expr = this.#prefix(token);

    while (precedence < Precedence[this.#cur.type]!) {
      token = this.#next();
      expr = this.#infix(token, expr);
    }

    return expr;
  }

  #prefix(token: Token) {
    switch (token.type) {
      case TokenType.Identifier:
        return { type: "IdentifierExpression", name: token.value };

      case TokenType.Undefined:
        return Expressions.Undefined;

      case TokenType.String:
      case TokenType.Number:
      case TokenType.Regex:
        return { type: "LiteralExpression", value: token.value };

      case TokenType.Backtick:
        const quasis: TemplateExpression[] = [];
        const expressions: Expression[] = [];

        while (!this.#check(TokenType.Backtick)) {
          if (this.#match(TokenType.DollarBrace)) {
            expressions.push(this.#expr(1));
            this.#consume(TokenType.RBrace);
          } else {
            const expr = this.#consume(TokenType.String) as Token;

            quasis.push({
              type: "TemplateExpression",
              value: { cooked: expr.value as string },
              tail: false,
            });
          }
        }

        quasis.at(-1)!.tail = true;

        this.#consume(TokenType.Backtick);

        return { type: "TemplateLiteralExpression", quasis, expressions };

      case TokenType.LParen:
        if (this.#cur.type === TokenType.RParen) {
          this.#next();
          return { type: "CommaExpression", expressions: [] };
        }

        const expr = this.#expr();
        this.#consume(TokenType.RParen);
        return expr;

      case TokenType.LBrace:
        const properties: (PropertyExpression | SpreadExpression)[] = [];

        while (!this.#check(TokenType.RBrace)) {
          const expr = this.#expr(1);

          if (this.#check(TokenType.Colon)) {
            const key = expr;
            this.#next();
            const value = this.#expr(1);

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

        this.#consume(TokenType.RBrace);

        return {
          type: "ObjectExpression",
          properties,
        };

      case TokenType.LBracket:
        const elements: Expression[] = [];

        while (!this.#check(TokenType.RBracket)) {
          elements.push(this.#expr(1));

          if (this.#check(TokenType.Comma)) {
            this.#next();
          }
        }

        this.#consume(TokenType.RBracket);

        return { type: "ArrayExpression", elements };

      case TokenType.DotDotDot:
        return { type: "SpreadExpression", argument: this.#expr(1) };

      case TokenType.New:
        const ctor = this.#expr(16);

        if (ctor.type !== "CallExpression") {
          throw new Error("Expected '(' before arguments.");
        }

        const call = ctor as CallExpression;

        return {
          type: "NewExpression",
          callee: call.callee,
          arguments: call.arguments,
        };

      case TokenType.True:
        return Expressions.True;

      case TokenType.False:
        return Expressions.False;

      case TokenType.Null:
        return Expressions.Null;

      case TokenType.This:
        return Expressions.This;

      case TokenType.PlusPlus:
      case TokenType.MinusMinus:
      case TokenType.Tilde:
      case TokenType.Not:
      case TokenType.Minus:
      case TokenType.Await:
      case TokenType.Plus:
      case TokenType.Typeof:
      case TokenType.Delete:
      case TokenType.Void:
        return {
          type: "UnaryExpression",
          operator: nameof(token.type),
          argument: this.#expr(14),
          prefix: true,
        };

      case TokenType.Super:
        return Expressions.Super;

      default:
        throw new Error(`Unexpected token: '${nameof(token.type)}'.`);
    }
  }

  #infix(token: Token, expr: Expression) {
    switch (token.type) {
      case TokenType.LParen:
        const args: Expression[] = [];

        while (!this.#check(TokenType.RParen)) {
          args.push(this.#expr(1));
          if (this.#check(TokenType.Comma)) {
            this.#next();
          }
        }

        this.#consume(TokenType.RParen);

        return { type: "CallExpression", callee: expr, arguments: args } as CallExpression;

      case TokenType.QuestionDot:
        return this.#member(expr, this.#expr(17), false, true);

      case TokenType.LBracket:
        const property = this.#expr();
        this.#consume(TokenType.RBracket);
        return this.#member(expr, property, true);

      case TokenType.Dot:
        return this.#member(expr, this.#expr(17));

      case TokenType.AndAnd:
        return this.#binary(expr, token, 4);

      case TokenType.EqGt:
        return {
          type: "ArrowFunctionExpression",
          params: expr.type === "CommaExpression" ? (expr as CommaExpression).expressions : [expr],
          body: this.#expr(1),
        };

      case TokenType.EqEq:
      case TokenType.EqEqEq:
      case TokenType.NotEq:
      case TokenType.NotEqEq:
        return this.#binary(expr, token, 8);

      case TokenType.PipePipe:
      case TokenType.QuestionQuestion:
        return this.#binary(expr, token, 3);

      case TokenType.Question:
        const consequent = this.#expr(1);
        this.#consume(TokenType.Colon);
        const alternate = this.#expr(1);
        return { type: "ConditionalExpression", test: expr, consequent, alternate };

      case TokenType.Lt:
      case TokenType.LtEq:
      case TokenType.Gt:
      case TokenType.GtEq:
        return this.#binary(expr, token, 9);

      case TokenType.Plus:
      case TokenType.Minus:
        return this.#binary(expr, token, 11);

      case TokenType.Star:
      case TokenType.Slash:
      case TokenType.Percent:
        return this.#binary(expr, token, 12);

      case TokenType.Backtick:
        return {
          type: "TaggedTemplateExpression",
          tag: expr,
          quasi: this.#prefix(token),
        };

      case TokenType.PlusPlus:
      case TokenType.MinusMinus:
        return {
          type: "UnaryExpression",
          operator: nameof(token.type),
          argument: expr,
          prefix: false,
        };

      case TokenType.LtLt:
      case TokenType.GtGt:
      case TokenType.GtGtGt:
        return this.#binary(expr, token, 10);

      case TokenType.StarStar:
        return this.#binary(expr, token, 12);

      case TokenType.Pipe:
        return this.#binary(expr, token, 5);

      case TokenType.Caret:
        return this.#binary(expr, token, 6);

      case TokenType.And:
        return this.#binary(expr, token, 7);

      case TokenType.Comma:
        if (this.#check(TokenType.RParen) && this.#la?.type === TokenType.EqGt) {
          return expr;
        }

        let expressions = [expr];

        do {
          expressions.push(this.#expr(1));
        } while (this.#match(TokenType.Comma));

        return { type: "CommaExpression", expressions };

      default:
        throw new Error(`Unexpected token: '${nameof(token.type)}'.`);
    }
  }

  #binary(left: Expression, op: Token, precedence: number) {
    return {
      type: "BinaryExpression",
      operator: nameof(op.type),
      left,
      right: this.#expr(precedence),
    };
  }

  #member(
    object: Expression,
    property: Expression,
    computed = false,
    optional: boolean | undefined = undefined
  ) {
    return {
      type: "MemberExpression",
      computed,
      object,
      optional,
      property,
    };
  }

  #match(expected: TokenType) {
    const token = this.#cur;

    if (token.type != expected) {
      return false;
    }

    this.#next();

    return true;
  }

  #consume(expected: TokenType) {
    const token = this.#cur;

    if (token.type != expected) {
      throw new Error(`Expected token '${nameof(expected)}' but was '${nameof(token.type)}'.`);
    }

    return this.#next();
  }

  #check(type: TokenType) {
    return this.#cur.type === type;
  }

  #next() {
    return this.#tokens[this.#pos++]!;
  }

  get #cur() {
    return this.#tokens[this.#pos]!;
  }

  get #la() {
    return this.#tokens[this.#pos + 1];
  }
}
