import * as t from "io-ts"
import * as tt from "io-ts-types"
import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import { EmptyString } from "@/lib/types/branded/string"

// Codecs

interface PositiveBrand {
  readonly Positive: unique symbol
}

export const Positive = t.brand(
  t.number,
  (n): n is t.Branded<number, PositiveBrand> => n > 0,
  "Positive"
)

export const PositiveInt = t.intersection([t.Int, Positive])

export const Binary = t.union([t.literal(0), t.literal(1)])

export const PositiveFromString = tt.withMessage(
  tt.NumberFromString.pipe(Positive, "PositiveFromString"),
  () => "Must be a positive number"
)

export const PositiveIntFromString = tt.withMessage(
  tt.NumberFromString.pipe(PositiveInt, "PositiveIntFromString"),
  () => "Must be a positive integer"
)

export const UndefinedOrPositiveFromString = new t.Type<
  undefined | number,
  string,
  unknown
>(
  "UndefinedOrPositiveFromString",
  (u): u is undefined | number => t.undefined.is(u) || t.number.is(u),
  (i, c) =>
    pipe(
      t.string.validate(i, c),
      E.flatMap(string => {
        if (EmptyString.is(string)) {
          return t.success(undefined)
        }
        return PositiveFromString.validate(string, c)
      })
    ),
  String
)

export const NullOrPositiveFromString = new t.Type<
  null | number,
  string,
  unknown
>(
  "NullOrPositiveFromString",
  (u): u is null | number => t.null.is(u) || t.number.is(u),
  (i, c) =>
    pipe(
      t.string.validate(i, c),
      E.flatMap(string => {
        if (EmptyString.is(string)) {
          return t.success(null)
        }
        return PositiveFromString.validate(string, c)
      })
    ),
  String
)

// Types

export type Positive = t.TypeOf<typeof Positive>
export type PositiveInt = t.TypeOf<typeof PositiveInt>
export type Binary = t.TypeOf<typeof Binary>
export type PositiveFromString = t.TypeOf<typeof PositiveFromString>
export type PositiveIntFromString = t.TypeOf<typeof PositiveIntFromString>
export type UndefinedOrPositiveFromString = t.TypeOf<
  typeof UndefinedOrPositiveFromString
>
export type NullOrPositiveFromString = t.TypeOf<typeof NullOrPositiveFromString>
