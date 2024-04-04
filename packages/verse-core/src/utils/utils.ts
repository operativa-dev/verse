export function array<T>(value?: T | readonly T[]): readonly T[] | undefined {
  if (!value) {
    return undefined;
  }

  return Array.isArray(value) ? value : ([value] as readonly T[]);
}

export function error(message: string) {
  throw new Error(message.replace(/\n\s+/, " "));
}

export function indent(s: string, indent: number = 2) {
  return s.replace(/^(?! )/gm, " ".repeat(indent));
}

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

declare const brand: unique symbol;

export type Brand<T, K extends string> = T & { [brand]: K };

export type Unbrand<T> = Omit<T, typeof brand>;
