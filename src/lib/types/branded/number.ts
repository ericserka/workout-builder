import * as t from "io-ts"
import * as E from "fp-ts/Either"
import * as B from "fp-ts/boolean"
import { pipe } from "fp-ts/function"
import * as S from "fp-ts/string"

// Error messages

const shouldBePositiveErrorMessage = "Should be a positive number"
const shouldBeNumberErrorMessage = "Should be a valid number"
const shouldBeIntegerErrorMessage = "Should be an integer"
const requiredErrorMessage = "Required"

// Codecs

export const Positive = new t.Type<number, number | string, unknown>(
  "Positive",
  (u): u is number => t.number.is(u) && u > 0,
  (i, c) =>
    pipe(
      i,
      S.isString,
      B.match(
        () =>
          pipe(
            t.number.validate(i, c),
            E.flatMap(n =>
              n > 0
                ? E.right(n)
                : E.left([
                    {
                      value: i,
                      context: c,
                      message: shouldBePositiveErrorMessage
                    }
                  ])
            ),
            E.mapLeft(() => [
              { value: i, context: c, message: requiredErrorMessage }
            ])
          ),
        () => {
          const n = Number(i)

          return pipe(
            n,
            isNaN,
            B.match(
              () =>
                n > 0
                  ? t.success(n)
                  : t.failure(i, c, shouldBePositiveErrorMessage),
              () => t.failure(i, c, shouldBeNumberErrorMessage)
            )
          )
        }
      )
    ),
  t.identity
)

export const Int = new t.Type<number, number | string, unknown>(
  "Int",
  (u): u is number => t.number.is(u) && Number.isInteger(u),
  (i, c) =>
    pipe(
      i,
      S.isString,
      B.match(
        () =>
          pipe(
            t.number.validate(i, c),
            E.flatMap(n =>
              Number.isInteger(n)
                ? E.right(n)
                : E.left([
                    {
                      value: i,
                      context: c,
                      message: shouldBeIntegerErrorMessage
                    }
                  ])
            ),
            E.mapLeft(() => [
              { value: i, context: c, message: requiredErrorMessage }
            ])
          ),
        () => {
          const n = Number(i)

          return pipe(
            n,
            isNaN,
            B.match(
              () =>
                Number.isInteger(n)
                  ? t.success(n)
                  : t.failure(i, c, shouldBeIntegerErrorMessage),
              () => t.failure(i, c, shouldBeNumberErrorMessage)
            )
          )
        }
      )
    ),
  t.identity
)

export const PositiveInt = t.intersection([Int, Positive])

export const Binary = t.union([t.literal(0), t.literal(1)])

// Types

export type Positive = t.TypeOf<typeof Positive>
export type Int = t.TypeOf<typeof Int>
export type PositiveInt = t.TypeOf<typeof PositiveInt>
export type Binary = t.TypeOf<typeof Binary>
