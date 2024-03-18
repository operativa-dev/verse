import { SIMPLE_TYPES } from "./const";

export function getSimpleAttributes(
  resultsArray: Array<string>,
  keys: Array<string>
) {
  let simpleKeys: string[] | number[] = [];
  keys.forEach((key) => {
    console.log("EditTable resultsArray[0].key", typeof resultsArray[0][key]);
    if (SIMPLE_TYPES.includes(typeof resultsArray[0][key])) {
      simpleKeys.push(key);
    }
  });
  return simpleKeys;
}
