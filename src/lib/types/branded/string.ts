import * as tt from "io-ts-types"
import * as t from "io-ts"
import * as StringHelpers from "@/lib/helpers/string"
import { pipe } from "fp-ts/function"
import * as E from "fp-ts/Either"
import { Positive, PositiveInt } from "@/lib/types/branded/number"

// Codecs

export const MuscleGroup = t.union([
  t.literal("chest"),
  t.literal("back"),
  t.literal("shoulders"),
  t.literal("legs"),
  t.literal("triceps"),
  t.literal("biceps"),
  t.literal("forearms"),
  t.literal("abs"),
  t.literal("calves"),
  t.literal("glutes")
])

export const EmptyString = new t.Type<string, string, unknown>(
  "EmptyString",
  (u): u is string => t.string.is(u) && StringHelpers.isEmpty(u),
  (i, c) =>
    pipe(
      t.string.validate(i, c),
      E.flatMap(s =>
        StringHelpers.isEmpty(s) ? t.success(s) : t.failure(i, c)
      )
    ),
  t.identity
)

export const NonEmptyString = new t.Type<string, string, unknown>(
  "NonEmptyString",
  (u): u is string => t.string.is(u) && StringHelpers.isNotEmpty(u),
  (i, c) =>
    pipe(
      t.string.validate(i, c),
      E.flatMap(s =>
        StringHelpers.isNotEmpty(s) ? t.success(s) : t.failure(i, c)
      )
    ),
  t.identity
)

export const FriendlyNonEmptyString = tt.withMessage(
  NonEmptyString,
  () => "Required"
)

export const UndefinedFromEmptyString = new t.Type<
  undefined | string,
  string,
  unknown
>(
  "UndefinedFromEmptyString",
  (u): u is undefined | string => t.undefined.is(u) || EmptyString.is(u),
  (i, c) =>
    EmptyString.is(i) ? t.success(undefined) : t.string.validate(i, c),
  value => value ?? ""
)

export const NullFromEmptyString = new t.Type<null | string, string, unknown>(
  "NullFromEmptyString",
  (u): u is null | string => t.null.is(u) || EmptyString.is(u),
  (i, c) => (EmptyString.is(i) ? t.success(null) : t.string.validate(i, c)),
  value => value ?? ""
)

export const PositiveString = new t.Type<string, number | string, unknown>(
  "PositiveString",
  (u): u is string => t.string.is(u),
  (i, c) => pipe(Positive.validate(i, c), E.map(String)),
  t.identity
)

export const UndefinedOrPositiveString = new t.Type<
  undefined | string,
  number | string,
  unknown
>(
  "UndefinedOrPositiveString",
  (u): u is string | undefined => t.string.is(u) || t.undefined.is(u),
  (i, c) => {
    if (EmptyString.is(i)) {
      return t.success(undefined)
    }
    return PositiveString.validate(i, c)
  },
  value => value ?? ""
)

export const NullOrPositiveString = new t.Type<
  null | string,
  number | string,
  unknown
>(
  "NullOrPositiveString",
  (u): u is string | null => t.string.is(u) || t.null.is(u),
  (i, c) => {
    if (EmptyString.is(i)) {
      return t.success(null)
    }
    return PositiveString.validate(i, c)
  },
  value => value ?? ""
)

export const PositiveIntString = new t.Type<string, number | string, unknown>(
  "PositiveIntString",
  (u): u is string => t.string.is(u),
  (i, c) => pipe(PositiveInt.validate(i, c), E.map(String)),
  t.identity
)

// Types

export type FriendlyNonEmptyString = t.TypeOf<typeof FriendlyNonEmptyString>
export type MuscleGroup = t.TypeOf<typeof MuscleGroup>
export type EmptyString = t.TypeOf<typeof EmptyString>
export type NonEmptyString = t.TypeOf<typeof NonEmptyString>
export type UndefinedFromEmptyString = t.TypeOf<typeof UndefinedFromEmptyString>
export type NullFromEmptyString = t.TypeOf<typeof NullFromEmptyString>
export type UndefinedOrPositiveString = t.TypeOf<
  typeof UndefinedOrPositiveString
>
export type NullOrPositiveString = t.TypeOf<typeof NullOrPositiveString>
export type PositiveString = t.TypeOf<typeof PositiveString>
export type PositiveIntString = t.TypeOf<typeof PositiveIntString>
