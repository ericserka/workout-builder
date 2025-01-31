import { positive, positiveInt } from "@/lib/types/branded/number"
import {
  muscleGroup,
  positiveIntString,
  undefinedOrPositiveString,
  undefinedFromEmptyString,
  nullFromEmptyString,
  nullOrPositiveString
} from "@/lib/types/branded/string"
import { z } from "zod"

// Schemas

const baseWorkoutExercise = z.object({
  id: positiveInt,
  sets: positiveInt,
  reps: positiveInt,
  weight: positive.nullable(),
  notes: z.string().nullable(),
  sequence: positiveInt
})

const camelCaseFields = z.object({
  exerciseId: positiveInt,
  workoutId: positiveInt,
  exerciseName: z.string(),
  muscleGroup: muscleGroup
})

const snakeCaseFields = z.object({
  exercise_id: positiveInt,
  workout_id: positiveInt,
  exercise_name: z.string(),
  muscle_group: muscleGroup
})

export const workoutExercise = baseWorkoutExercise.merge(camelCaseFields)

export const workoutExerciseRow = baseWorkoutExercise.merge(snakeCaseFields)

export const createWorkoutExerciseSchema = z.object({
  sets: positiveIntString,
  reps: positiveIntString,
  weight: undefinedOrPositiveString.optional(),
  notes: undefinedFromEmptyString.optional(),
  exerciseId: positiveInt,
  workoutId: positiveInt
})

export const updateWorkoutExerciseSchema = z.object({
  id: positiveInt,
  sets: positiveIntString.optional(),
  reps: positiveIntString.optional(),
  weight: nullOrPositiveString.optional(),
  notes: nullFromEmptyString.optional(),
  sequence: positiveInt.optional()
})

// Types

export type WorkoutExercise = z.infer<typeof workoutExercise>
export type WorkoutExerciseRow = z.infer<typeof workoutExerciseRow>
export type CreateWorkoutExerciseInput = z.infer<
  typeof createWorkoutExerciseSchema
>
export type UpdateWorkoutExerciseInput = z.infer<
  typeof updateWorkoutExerciseSchema
>
