export function array<T>(value?: T | T[]): T[] | undefined {
  if (!value) {
    return undefined;
  }

  return Array.isArray(value) ? value : [value];
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
