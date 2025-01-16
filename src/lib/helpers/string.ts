import { pipe } from "fp-ts/function"
import * as S from "fp-ts/string"

export const camelToSnake = (str: string) =>
  pipe(str, S.replace(/([a-z])([A-Z])/g, "$1_$2"), S.toLowerCase)
