import { FieldError } from "react-hook-form"
import * as O from "fp-ts/Option"
import * as Ord from "fp-ts/Ord"
import * as A from "fp-ts/Array"
import * as S from "fp-ts/string"
import * as Eq from "fp-ts/Eq"
import { pipe } from "fp-ts/function"
import * as ArrayHelpers from "@/lib/helpers/array"
import { PositiveIntString } from "@/lib/types/branded/string"

type ContainsError = (error: FieldError | undefined) => boolean
export const containsError: ContainsError = error =>
  pipe(
    error,
    O.fromNullable,
    O.match(
      () => false,
      () => true
    )
  )

const eqFieldError: Eq.Eq<FieldError> = {
  equals: (x, y) =>
    pipe(
      [x.message, y.message],
      A.map(O.fromNullable),
      ([xMessage, yMessage]) => O.getEq(S.Eq).equals(xMessage, yMessage)
    )
}

type RemoveDuplicates = (arr: FieldError[]) => FieldError[]
const removeDuplicates: RemoveDuplicates = arr =>
  pipe(
    arr,
    A.filterMap(O.fromNullable),
    ArrayHelpers.removeDuplicates(eqFieldError)
  )

type ContainsPositiveIntKeys = (obj: FieldError) => boolean
const containsPositiveIntKeys: ContainsPositiveIntKeys = obj =>
  pipe(obj, Object.keys, A.some(PositiveIntString.is))

const ordByKey: Ord.Ord<[string, FieldError]> = pipe(
  S.Ord,
  Ord.contramap(([k, _v]) => k)
)

type ExtractPositiveIntValuesAsArray = (obj: FieldError) => FieldError[]
const extractPositiveIntValuesAsArray: ExtractPositiveIntValuesAsArray = obj =>
  pipe(
    obj,
    O.fromPredicate(containsPositiveIntKeys),
    O.map(o =>
      pipe(
        o,
        Object.entries,
        A.filter(([k, _v]) => PositiveIntString.is(k)),
        A.sortBy([ordByKey]),
        A.map(([_k, v]) => v)
      )
    ),
    O.getOrElse<FieldError[]>(() => [])
  )

type ParseErrors = (error: FieldError) => FieldError[]
export const parseErrors: ParseErrors = error => {
  if (Array.isArray(error)) {
    return removeDuplicates(error)
  }
  if (containsPositiveIntKeys(error)) {
    const mainError: FieldError = { type: error.type, message: error.message }
    const otherErrors = pipe(
      error,
      extractPositiveIntValuesAsArray,
      removeDuplicates
    )

    const allErrors = [mainError, ...otherErrors]

    return pipe(
      allErrors,
      A.filter(e => e.type !== "undefined")
    )
  }

  return [error]
}
