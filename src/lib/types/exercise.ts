import { positiveInt } from "@/lib/types/branded/number"
import {
  muscleGroup,
  nonEmptyString,
  nullFromEmptyString,
  undefinedFromEmptyString
} from "@/lib/types/branded/string"
import { z } from "zod"

// Schemas

const baseExercise = z.object({
  id: positiveInt,
  name: nonEmptyString,
  description: z.string().nullable()
})

const camelCaseFields = z.object({
  muscleGroup: muscleGroup
})

const snakeCaseFields = z.object({
  muscle_group: muscleGroup
})

export const exercise = baseExercise.merge(camelCaseFields)

export const exerciseRow = baseExercise.merge(snakeCaseFields)

export const createExerciseSchema = z.object({
  name: nonEmptyString,
  muscleGroup: muscleGroup,
  description: undefinedFromEmptyString.optional()
})

export const updateExerciseSchema = z.object({
  id: positiveInt,
  name: nonEmptyString.optional(),
  muscleGroup: muscleGroup.optional(),
  description: nullFromEmptyString.optional()
})

// Types

export type Exercise = z.infer<typeof exercise>
export type ExerciseRow = z.infer<typeof exerciseRow>
export type CreateExerciseInput = z.infer<typeof createExerciseSchema>
export type UpdateExerciseInput = z.infer<typeof updateExerciseSchema>
