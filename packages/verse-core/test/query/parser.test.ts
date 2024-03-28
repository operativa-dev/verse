//import jsep from "jsep";
import { afterEach, describe, expect, test } from "vitest";
import { Expression, lex, nameof, parse, Token } from "../../src/query/parser.js";
import { snap } from "../infra.js";

let $tokens: Token[] = [];

function testLex(expr: string) {
  $tokens = [...lex(expr)];
}

describe("lexer", () => {
  afterEach(async ctx => {
    await snap(
      ctx,
      $tokens.map(op => ({ ...op, type: nameof(op.type) }))
    );
  });

  test("arithmetic operators", () => {
    testLex("+ - * / ** %");
  });

  test("assignment operators", () => {
    testLex("= += -= *= /= %= **=");
  });

  test("comparison operators", () => {
    testLex("== === != !== < > <= >=");
  });

  test("ternary operator", () => {
    testLex("? :");
  });

  test("logical operators", () => {
    testLex("&& ||");
  });

  test("bitwise operators", () => {
    testLex("~ & | ^ << >> >>>");
  });

  test("unary operators", () => {
    testLex("++ -- !");
  });

  test("nullish coalescing operator", () => {
    testLex("??");
  });

  test("other punctuation", () => {
    testLex(", ; ( ) [ ] { } . ?. => ...");
  });

  test("keywords", () => {
    testLex("this true false null undefined typeof void in instanceof new super");
  });

  test("identifiers", () => {
    testLex("foo $bar _baz $123 _456 $ _ abc123");
  });

  test("whitespace", () => {
    testLex("a \t\n\rb");
  });

  test("strings", () => {
    testLex(
      `"" '' "foo" 'bar' "foo\\"bar" 'bar\\'foo' "foo\\nbar" 
    'bar\\tfoo' "\x00" '\\x00' "😀" '\\u{1F600}' "\\u1234" 
    "\u{0}" "\\u{0}"`
    );
  });

  test("templates", () => {
    testLex(
      "${ `` `$` `\\${` `}` `foo` `${bar}` `abc${bar}def` `${ `a${b}c` }` " +
        "`\\u{1F600}` sql`select`"
    );
  });

  test("long strings", () => {
    testLex(`"abs \\
    def"`);
  });

  test("numbers", () => {
    testLex(
      "123 -123.456 .456 0.456 123e45 123e+45 123e-45 1. +42.4" +
        " -69e12 .34e-5 123456789123456789 123456789123456789n -123n"
    );
  });

  test("binary numbers", () => {
    testLex("0b0 0b1 0B1111 -0b01111 +0b10101010 0b0101n");
  });

  test("octal numbers", () => {
    testLex("0o0 0o1 0O7777 -0o7777 +0o7777 0o123n");
  });

  test("hexadecimal numbers", () => {
    testLex("0x0 0x1 0XFfFF -0xFFFF +0xAaAA 0x123n");
  });

  test("separators", () => {
    testLex("0b1_0_0 1_000_000 1.0e1_1 1_2.3_4 .55_5 0o7_7 0xf_f");
  });

  test("line comments", () => {
    testLex("// foo\n// bar\r// baz qux");
  });

  test("block comments", () => {
    testLex("/* foo */ /* bar\n\nabc */ /*** baz qux **/ /*\\*/ /*/*/");
  });

  test("regexes", () => {
    testLex("/foo/,/fo\\/o/,/fo\\[[/a\\]]a\\/]o\\\\/,/abc/gimsuy");
  });
});

test("lexer errors", () => {
  // @ts-ignore
  expect(() => testLex(null)).toThrow("Empty expression.");
  // @ts-ignore
  expect(() => testLex(undefined)).toThrow("Empty expression.");
  expect(() => testLex("")).toThrow("Empty expression.");
  expect(() => testLex(" ")).toThrow("Empty expression.");

  expect(() => testLex('"')).toThrow("Unterminated string literal.");
  expect(() => testLex("'")).toThrow("Unterminated string literal.");
  expect(() => testLex("'\n'")).toThrow("Unterminated string literal.");
  expect(() => testLex("'\r'")).toThrow("Unterminated string literal.");
  expect(() => testLex("'\\' 12")).toThrow("Unterminated string literal.");
  expect(() => testLex("`${` 12")).toThrow("Unterminated string literal.");

  expect(() => testLex('"\\x"')).toThrow("Hexadecimal digit expected.");
  expect(() => testLex('"\\x0"')).toThrow("Hexadecimal digit expected.");
  expect(() => testLex('"\\u0"')).toThrow("Hexadecimal digit expected.");
  expect(() => testLex('"\\u01"')).toThrow("Hexadecimal digit expected.");
  expect(() => testLex('"\\u012"')).toThrow("Hexadecimal digit expected.");
  expect(() => testLex('"\\u012z"')).toThrow("Hexadecimal digit expected.");

  expect(() => testLex('"\\u{1F600A}"')).toThrow(
    "An extended Unicode escape allows only values between 0x0 and 0x10FFFF."
  );

  expect(() => testLex('"\\u{1F600A"')).toThrow("Unterminated Unicode escape sequence.");
  expect(() => testLex('"\\u{1F600AAAAA"')).toThrow("Unterminated Unicode escape sequence.");
  expect(() => testLex('"\\u{1FW}"')).toThrow("Unterminated Unicode escape sequence.");
  expect(() => testLex('"\\u{1FA')).toThrow("Unterminated Unicode escape sequence.");

  expect(() => testLex("/abc")).toThrow("Unterminated regular expression literal.");
});

let $ast: Expression[];

function testParse(...expr: string[]) {
  $ast = [...expr.map(e => parse(e))];
}

function precedence(expr: string, expected: string) {
  const ast1 = parse(expr);
  const ast2 = parse(expected);

  expect(ast1).toEqual(ast2);
}

describe("parser", () => {
  afterEach(async ctx => {
    await snap(ctx, $ast);
  });

  test("primaries", () => {
    testParse(
      "false",
      "true",
      "null",
      "undefined",
      "this",
      "super",
      "123",
      `"abc"`,
      "/foo/",
      "(123)",
      "[123]",
      "[123,]",
      "[123, 456]",
      "[]",
      "[_, al]",
      "{}",
      "{foo}",
      "{foo, bar}",
      "{foo: 123}",
      '{1: "foo"}',
      '{"foo:bar": 42}',
      "{...foo}",
      "{foo: {bar} }",
      "{ album: a.title, artist: ar.name, track: t.name }",
      "``",
      "`abc`",
      "`${foo}`",
      "`$`",
      "`\\${`",
      "`${ `a${b}c` }`",
      "tag`foo`",
      "sql`select * from table`"
    );
  });

  test("computed key", () => {
    testParse("{[abc]: 123}");
  });

  test("comma", () => {
    testParse("a, 12, b", "(a, 12)", "foo[a, b]");
  });

  test("spread", () => {
    testParse("...foo", "...foo.bar", "foo(...bar)", "foo(...bar, ...baz)");
  });

  test("arrow", () => {
    testParse(
      "foo => bar",
      "() => a+b",
      "(a, [b, _]) => a+b",
      "() => (a, b) => a+b",
      "([_, al]) => al.title"
    );
  });

  test("ternary", () => {
    testParse("foo ? bar : baz", "foo ? bar : baz ? qux : quux");
    precedence("foo ? bar : baz ? qux : quux", "foo ? bar : (baz ? qux : quux)");
  });

  test("nullish", () => {
    testParse("foo ?? bar", "foo ?? bar ?? baz");
    precedence("foo ?? bar ?? baz", "(foo ?? bar) ?? baz");
  });

  test("logicalOr", () => {
    testParse("123 || 456");
    precedence("123 || 456 || 789", "(123 || 456) || 789");
    precedence("123 || 456 && 789", "123 || (456 && 789)");
  });

  test("logicalAnd", () => {
    testParse("123 && 456", "foo || bar && baz");
    precedence("foo && bar && baz", "(foo && bar) && baz");
    precedence("foo && bar | baz", "foo && (bar | baz)");
  });

  test("bitwiseOr", () => {
    testParse("123 | 456");
    precedence("123 | 456 | 789", "(123 | 456) | 789");
    precedence("123 | 456 ^ 789", "123 | (456 ^ 789)");
  });

  test("bitwiseXor", () => {
    testParse("123 ^ 456");
    precedence("123 ^ 456 ^ 789", "(123 ^ 456) ^ 789");
    precedence("123 ^ 456 & 789", "123 ^ (456 & 789)");
  });

  test("bitwiseAnd", () => {
    testParse("123 & 456");
    precedence("123 & 456 & 789", "(123 & 456) & 789");
    precedence("123 & 456 === 789", "123 & (456 === 789)");
  });

  test("equality", () => {
    testParse("123 == bar[12]", "123 === 456", "123 != 456", "123 !== 456");
    precedence("123 == 456 === 789", "(123 == 456) === 789");
    precedence("123 == 456 < 789", "123 == (456 < 789)");
  });

  test("relational", () => {
    testParse("123 < foo.bar", "123 > 456", '123 <= "abc"', "bar >= 456");
    precedence("123 < 456 > 789", "(123 < 456) > 789");
    precedence("123 < 456 << foo", "123 < (456 << foo)");
  });

  test("bitwiseShift", () => {
    testParse("123 << 456", "123 >> 456", "123 >>> 456");
  });

  test("additive", () => {
    testParse("123 + 456", "123 - 456 * 789");
    precedence("123 + 456 + 789", "(123 + 456) + 789");
    precedence("123 + 456 * 789", "123 + (456 * 789)");
  });

  test("multiplicative", () => {
    testParse("123 / 456 * 789", "123 % (456 / abc.def)");
    precedence("123 * 456 / 789", "(123 * 456) / 789");
    precedence("123 * 456 ** 789", "123 * (456 ** 789)");
  });

  test("exponentiation", () => {
    testParse("123 ** 456 ** 789");
    precedence("123 ** 456 ** 789", "123 ** (456 ** 789)");
    precedence("123 ** -456", "123 ** (-456)");
  });

  test("prefix", () => {
    testParse("+123", "+abc", "-abc", "!abc", "-(foo)", "~foo");
  });

  test("prefix increment", () => {
    testParse("++foo", "--foo", "void 0", "typeof foo", "await obj[key]", "delete obj[key]");
  });

  test("postfix", () => {
    testParse("foo++", "abc--");
  });

  test("members", () => {
    testParse(
      "a[10]",
      "this.foo",
      "foo.bar.baz",
      "foo?.bar?.baz",
      "foo[bar]",
      "foo[bar]?.baz",
      "foo[(a, b)]"
    );
  });

  test("new", () => {
    testParse("new Foo()", "new Foo(123)", "new x(y)");
  });

  test("call", () => {
    testParse("foo()", "foo.bar()", "foo.bar()[baz?.qux()]", "foo(12, abc)");
  });

  test("trailing commas", () => {
    testParse("foo(12,)", "{foo,}", "(foo,)=>123");
  });
});

test("parser errors", () => {
  expect(() => testParse("(")).toThrow("Unexpected token: 'eof'.");
  expect(() => testParse("new Foo")).toThrow("Expected '(' before arguments.");
  expect(() => testParse("new Foo(12")).toThrow("Expected ')' after arguments.");
  expect(() => testParse("foo.")).toThrow("Expected property name after '.'.");
  expect(() => testParse("foo[12")).toThrow("Expected ']' after computed property.");
  expect(() => testParse("(12")).toThrow("Expected ')' after expression.");
  expect(() => testParse("12,")).toThrow("Unexpected token: 'eof'.");
  expect(() => testParse("(12,)")).toThrow("Unexpected token: ')'.");
  expect(() => testParse("foo(12")).toThrow("Expected ')' after arguments.");
  expect(() => testParse("[,]")).toThrow("Unexpected token: ','.");
  expect(() => testParse("foo(,)")).toThrow("Unexpected token: ','.");
  expect(() => testParse("{12}")).toThrow("':' expected.");
});
