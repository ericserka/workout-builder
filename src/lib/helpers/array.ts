export const join =
  <T>(separator: string) =>
  (array: T[]) =>
    array.join(separator)
