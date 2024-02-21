import { List } from "immutable";

export function notNull<T>(args: { [key: string]: T }) {
  Object.entries(args).forEach(([arg, value]) => {
    if (value === undefined || value === null) {
      throw new Error(`Argument '${arg}' cannot be undefined or null!`);
    }
  });
}

export function notEmpty<T extends string | List<unknown> | unknown[] | undefined | null>(args: {
  [key: string]: T;
}) {
  Object.entries(args).forEach(([arg, value]) => {
    if (value === undefined || value === null) {
      throw new Error(`Argument '${arg}' cannot be undefined or null!`);
    }

    if (typeof value === "string" && value.trim().length === 0) {
      throw new Error(`Argument '${arg}' cannot be empty or whitespace!`);
    }

    if ((List.isList(value) && value.size === 0) || (Array.isArray(value) && value.length === 0)) {
      throw new Error(`Argument '${arg}' cannot be empty!`);
    }
  });
}
