export function getArrayStrings<const T extends string>(
  query: Maybe<string>,
  items: readonly T[],
): T[] {
  const queryItems: string[] =
    typeof query === 'string' ? query.split(',') : [];
  return queryItems.filter((rel) => items.includes(rel as T)) as T[];
}

export function parsePositionOrId(str: string) {
  return Number.isNaN(Number(str)) ? str : Number(str);
}
