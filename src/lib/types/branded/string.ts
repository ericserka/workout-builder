import {
  positive,
  positiveInt,
  stringOrNumber
} from "@/lib/types/branded/number"
import { pipe, constVoid } from "fp-ts/function"
import * as O from "fp-ts/Option"
import { z } from "zod"

// Schemas

export const muscleGroup = z.enum([
  "chest",
  "back",
  "shoulders",
  "legs",
  "triceps",
  "biceps",
  "forearms",
  "abs",
  "calves",
  "glutes",
  "traps"
])

const trimmedString = z.string().trim()

const emptyString = trimmedString.length(0)

export const nonEmptyString = trimmedString.min(1)

type TransformEmptyString = <A>(
  valIfEmptyString: A
) => (val: string) => string | A
const transformEmptyString: TransformEmptyString = valIfEmptyString => val =>
  emptyString.safeParse(val).success ? valIfEmptyString : val.trim()

export const undefinedFromEmptyString = z
  .string()
  .transform(transformEmptyString(undefined))

export const nullFromEmptyString = z
  .string()
  .transform(transformEmptyString(null))

const stringLike = z.coerce.string()

const positiveString = positive.pipe(stringLike)

const stringOrNumberToString = stringOrNumber.pipe(stringLike)

type SuperRefine = <A>(val: A, ctx: z.RefinementCtx) => void
const superRefine: SuperRefine = (val, ctx) => {
  pipe(
    val,
    O.fromNullable,
    O.flatMap(stringVal =>
      pipe(stringVal, positiveString.safeParse, res =>
        res.success ? O.none : O.some(res.error.issues[0])
      )
    ),
    O.match(constVoid, issue =>
      ctx.addIssue({ code: "custom", message: issue.message })
    )
  )
}

export const undefinedOrPositiveString = stringOrNumberToString
  .pipe(undefinedFromEmptyString)
  .superRefine(superRefine)

export const nullOrPositiveString = stringOrNumberToString
  .pipe(nullFromEmptyString)
  .superRefine(superRefine)

export const positiveIntString = positiveInt.pipe(stringLike)
