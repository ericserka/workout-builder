import * as t from "io-ts"

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

// Types

export type Positive = t.TypeOf<typeof Positive>
export type PositiveInt = t.TypeOf<typeof PositiveInt>
export type Binary = t.TypeOf<typeof Binary>
