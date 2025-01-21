import { pipe } from "fp-ts/function"
import * as S from "fp-ts/string"

export const camelToSnake = (str: string) =>
  pipe(str, S.replace(/([a-z])([A-Z])/g, "$1_$2"), S.toLowerCase)

export const isEmpty = (str: string) => pipe(str, S.trim, S.isEmpty)

export const isNotEmpty = (str: string) => !isEmpty(str)

export const isNotNumeric = (str: string) => pipe(str, Number, isNaN)

export const isNumeric = (str: string) => !isNotNumeric(str)
