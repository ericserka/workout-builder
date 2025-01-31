import { positiveInt } from "@/lib/types/branded/number"
import { nonEmptyString } from "@/lib/types/branded/string"
import { z } from "zod"

// Schemas

const baseWorkout = z.object({
  id: positiveInt,
  name: nonEmptyString,
  sequence: positiveInt
})

const camelCaseFields = z.object({
  workoutPlanId: positiveInt
})

const snakeCaseFields = z.object({
  workout_plan_id: positiveInt
})

export const workout = baseWorkout.merge(camelCaseFields)

export const workoutRow = baseWorkout.merge(snakeCaseFields)

export const createWorkoutSchema = z.object({
  name: nonEmptyString,
  workoutPlanId: positiveInt
})

export const updateWorkoutSchema = z.object({
  id: positiveInt,
  name: nonEmptyString.optional(),
  sequence: positiveInt.optional()
})

// Types

export type Workout = z.infer<typeof workout>
export type WorkoutRow = z.infer<typeof workoutRow>
export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>
export type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>
