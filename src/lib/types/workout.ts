import * as t from "io-ts"
import { PositiveInt } from "@/lib/types/branded/number"
import { FriendlyNonEmptyString } from "@/lib/types/branded/string"
import { Optional } from "@/lib/types/helpers/optional"

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
  name: Optional(FriendlyNonEmptyString)
})

// Types

export type Workout = t.TypeOf<typeof WorkoutCodec>
export type WorkoutRow = t.TypeOf<typeof WorkoutRowCodec>
export type CreateWorkoutInput = t.TypeOf<typeof CreateWorkoutCodec>
export type UpdateWorkoutInput = t.TypeOf<typeof UpdateWorkoutCodec>
