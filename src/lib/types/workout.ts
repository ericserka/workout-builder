import * as t from "io-ts"
import { PositiveInt } from "@/lib/types/branded/number"
import { FriendlyNonEmptyString } from "@/lib/types/branded/string"

// Codecs

export const WorkoutCodec = t.type({
  id: PositiveInt,
  name: FriendlyNonEmptyString,
  workoutPlanId: PositiveInt
})

export const WorkoutRowCodec = t.type({
  id: PositiveInt,
  name: FriendlyNonEmptyString,
  workout_plan_id: PositiveInt
})

export const CreateWorkoutCodec = t.type({
  name: FriendlyNonEmptyString,
  workoutPlanId: PositiveInt
})

export const UpdateWorkoutCodec = t.type({
  id: PositiveInt,
  name: t.union([FriendlyNonEmptyString, t.undefined])
})

// Types

export type Workout = t.TypeOf<typeof WorkoutCodec>
export type WorkoutRow = t.TypeOf<typeof WorkoutRowCodec>
export type CreateWorkoutInput = t.TypeOf<typeof CreateWorkoutCodec>
export type UpdateWorkoutInput = t.TypeOf<typeof UpdateWorkoutCodec>
