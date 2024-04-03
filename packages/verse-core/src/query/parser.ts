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
  return tokenNames[token];
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

export function lex(expr: string): ReadonlyArray<Readonly<Token>> {
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
  let value = "";
  const template = char === 0x60;

  while (true) {
    let code = expr.charCodeAt(++i);

    if (isNaN(code) || code === 0x0a || code === 0x0d) {
      throw new Error("Unterminated string literal.");
    }

    if (code === char) {
      if (template) {
        i--;
      }
      break;
    }

    let next = expr[i];

    if (code === 0x5c) {
      code = expr.charCodeAt(++i);

      switch (code) {
        case 0x6e:
          value += "\n";
          break;

        case 0x74:
          value += "\t";
          break;

        case 0x62:
          value += "\b";
          break;

        case 0x66:
          value += "\f";
          break;

        case 0x72:
          value += "\r";
          break;

        case 0x76:
          value += "\v";
          break;

        case 0x30:
          value += "\0";
          break;

        case 0x0a:
        case 0x0d:
        case 0x2028:
        case 0x2029:
          break;

        case 0x78:
          if (i + 3 >= expr.length) {
            throw new Error("Hexadecimal digit expected.");
          }

          const first = expr.charCodeAt(++i);
          const second = expr.charCodeAt(++i);

          if (!hex(first) || !hex(second)) {
            throw new Error("Hexadecimal digit expected.");
          }

          value += String.fromCharCode(parseInt(expr[i - 2]! + expr[i - 1]!, 16));

          break;

        case 0x75:
          if (i + 2 >= expr.length) {
            throw new Error("Hexadecimal digit expected.");
          }

          code = expr.charCodeAt(i + 1);

          if (hex(code)) {
            if (i + 5 >= expr.length) {
              throw new Error("Hexadecimal digit expected.");
            }

            const first = expr[++i]!;
            const second = expr[++i]!;
            const third = expr[++i]!;
            const fourth = expr[++i]!;

            if (
              !hex(first.charCodeAt(0)) ||
              !hex(second.charCodeAt(0)) ||
              !hex(third.charCodeAt(0)) ||
              !hex(fourth.charCodeAt(0))
            ) {
              throw new Error("Hexadecimal digit expected.");
            }

            value += String.fromCharCode(parseInt(first + second + third + fourth, 16));
          } else if (code === 0x7b) {
            let cp = "";
            i++;

            while (true) {
              code = expr.charCodeAt(++i);

              if (code === 0x7d) {
                break;
              }

              if (!hex(code)) {
                throw new Error("Unterminated Unicode escape sequence.");
              }

              cp += expr[i];
            }

            const point = parseInt(cp, 16);

            if (point > 0x10ffff) {
              throw new Error(
                "An extended Unicode escape allows only values between 0x0 and 0x10FFFF."
              );
            }

            value += String.fromCodePoint(point);
          }

          break;

        default:
          value += expr[i];
      }
    } else if (template && code === 0x24 && expr.codePointAt(i + 1) === 0x7b) {
      i--;
      break;
    } else {
      value += next;
    }
  }
  return [value, i] as const;
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
    let code = expr.charCodeAt(i + 1);

    if (isNaN(code)) {
      break;
    }

    const next = expr[i + 1];

    if (!digit(code)) {
      if (!seenDot && !seenE && code === 0x2e) {
        value += next;
        i++;
        seenDot = true;
        continue;
      } else if (!seenE && (code === 0x65 || code === 0x45)) {
        value += next;
        i++;
        seenE = true;
        continue;
      } else if (code === 0x2b || code === 0x2d) {
        value += next;
        i++;
        continue;
      }

      if (code === 0x6e) {
        return [BigInt(value), i + 1] as const;
      }

      if (sepAllowed && code === 0x5f && digit(expr.charCodeAt(i + 2))) {
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

export interface SuperExpression extends Expression {
  type: "SuperExpression";
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

const Expressions = {
  False: { type: "LiteralExpression", value: false },
  True: { type: "LiteralExpression", value: true },
  Undefined: { type: "LiteralExpression", value: undefined },
  Null: { type: "LiteralExpression", value: null },
  This: { type: "ThisExpression" },
  Super: { type: "SuperExpression" },
};

class Parser {
  readonly #tokens: ReadonlyArray<Token>;

  #pos = 0;
  #cur: Token;
  #prev!: Token;
  #la1: Token | undefined;
  #la2: Token | undefined;

  constructor(expression: string) {
    this.#tokens = lex(expression);
    this.#cur = this.#tokens[this.#pos++]!;
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
      if (this.#check(TokenType.LBrace)) {
        throw new Error("Unexpected token: '{'. Block bodied arrow functions are not supported.");
      }

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
      const right = this.#exponent();
      expr = { type: "BinaryExpression", operator: nameof(op.type), left: expr, right };
    }

    return expr;
  }

  #exponent(): Expression {
    let left = this.#prefix();

    if (this.#match(TokenType.StarStar)) {
      const right = this.#exponent(); // right-associative
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
      const argument = this.#member();

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
      } as UnaryExpression;
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
        } as MemberExpression;
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

        expr = { type: "CallExpression", callee: expr, arguments: args } as CallExpression;
      } else if (this.#check(TokenType.Backtick)) {
        const template = this.#primary() as TemplateLiteralExpression;

        expr = {
          type: "TaggedTemplateExpression",
          tag: expr,
          quasi: template,
        } as TaggedTemplateExpression;
      } else {
        break;
      }
    }

    return expr;
  }

  #primary() {
    if (this.#match(TokenType.Identifier)) {
      return { type: "IdentifierExpression", name: this.#prev.value as string };
    }

    if (this.#match(TokenType.False)) {
      return Expressions.False;
    }

    if (this.#match(TokenType.True)) {
      return Expressions.True;
    }

    if (this.#match(TokenType.Undefined)) {
      return Expressions.Undefined;
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

    if (this.#match(TokenType.Null)) {
      return Expressions.Null;
    }

    if (this.#match(TokenType.This)) {
      return Expressions.This;
    }

    if (this.#match(TokenType.Super)) {
      return Expressions.Super;
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
    this.#prev = this.#cur;
    this.#cur = this.#la1 ?? this.#tokens[this.#pos++]!;
    this.#la1 = this.#la2;
    this.#la2 = undefined;

    return this.#prev;
  }

  #peek() {
    if (!this.#la1) {
      this.#la1 = this.#tokens[this.#pos++];

      return this.#la1;
    }

    if (!this.#la2) {
      this.#la2 = this.#tokens[this.#pos++];
    }

    return this.#la2;
  }

  get #eof() {
    return this.#cur.type === TokenType.Eof;
  }
}
