import * as tt from "io-ts-types"
import * as t from "io-ts"
import * as StringHelpers from "@/lib/helpers/string"

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

interface EmptyStringBrand {
  readonly EmptyString: unique symbol
}

export const EmptyString = t.brand(
  t.string,
  (s): s is t.Branded<string, EmptyStringBrand> => StringHelpers.isEmpty(s),
  "EmptyString"
)

interface NonEmptyStringBrand {
  readonly NonEmptyString: unique symbol
}

export const NonEmptyString = t.brand(
  t.string,
  (s): s is t.Branded<string, NonEmptyStringBrand> =>
    StringHelpers.isNotEmpty(s),
  "NonEmptyString"
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
  (input): input is undefined | string =>
    t.undefined.is(input) || EmptyString.is(input),
  (input, context) =>
    EmptyString.is(input)
      ? t.success(undefined)
      : t.string.validate(input, context),
  value => value ?? ""
)

export const NullFromEmptyString = new t.Type<null | string, string, unknown>(
  "NullFromEmptyString",
  (input): input is null | string => t.null.is(input) || EmptyString.is(input),
  (input, context) =>
    EmptyString.is(input) ? t.success(null) : t.string.validate(input, context),
  value => value ?? ""
)

// Types

export type FriendlyNonEmptyString = t.TypeOf<typeof FriendlyNonEmptyString>
export type MuscleGroup = t.TypeOf<typeof MuscleGroup>
export type EmptyString = t.TypeOf<typeof EmptyString>
export type NonEmptyString = t.TypeOf<typeof NonEmptyString>
export type UndefinedFromEmptyString = t.TypeOf<typeof UndefinedFromEmptyString>
export type NullFromEmptyString = t.TypeOf<typeof NullFromEmptyString>
