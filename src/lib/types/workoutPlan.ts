import { binary, positiveInt } from "@/lib/types/branded/number"
import {
  nonEmptyString,
  nullFromEmptyString,
  undefinedFromEmptyString
} from "@/lib/types/branded/string"
import { z } from "zod"

// Schemas

const baseWorkoutPlan = z.object({
  id: positiveInt,
  name: nonEmptyString,
  description: z.string().nullable()
})

const camelCaseFields = z.object({
  isActive: z.boolean()
})

const snakeCaseFields = z.object({
  is_active: binary
})

export const workoutPlan = baseWorkoutPlan.merge(camelCaseFields)

export const workoutPlanRow = baseWorkoutPlan.merge(snakeCaseFields)

export const createWorkoutPlanSchema = z.object({
  name: nonEmptyString,
  description: undefinedFromEmptyString.optional()
})

export const updateWorkoutPlanSchema = z.object({
  id: positiveInt,
  name: nonEmptyString.optional(),
  description: nullFromEmptyString.optional(),
  isActive: z.boolean().optional()
})

// Types

export type WorkoutPlan = z.infer<typeof workoutPlan>
export type WorkoutPlanRow = z.infer<typeof workoutPlanRow>
export type CreateWorkoutPlanInput = z.infer<typeof createWorkoutPlanSchema>
export type UpdateWorkoutPlanInput = z.infer<typeof updateWorkoutPlanSchema>
