import { z } from "zod"

// Schemas

export const stringOrNumber = z.union([z.string(), z.number()])

const numberLike = z.coerce.number()

export const positive = stringOrNumber.pipe(numberLike.positive())

export const positiveInt = positive.pipe(z.number().int())

export const binary = z.union([z.literal(0), z.literal(1)])

// Types

export type Positive = z.infer<typeof positive>
export type PositiveInt = z.infer<typeof positiveInt>
