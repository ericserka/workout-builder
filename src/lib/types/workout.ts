import * as t from "io-ts"
import * as tt from "io-ts-types"
import { PositiveInt } from "@/lib/types/branded/number"

// Codecs

export const WorkoutCodec = t.type({
  id: PositiveInt,
  name: t.string,
  workoutPlanId: PositiveInt
})

export const WorkoutRowCodec = t.type({
  id: PositiveInt,
  name: t.string,
  workout_plan_id: PositiveInt
})

export const CreateWorkoutCodec = t.type({
  name: tt.NonEmptyString,
  workoutPlanId: PositiveInt
})

export const UpdateWorkoutCodec = t.type({
  id: PositiveInt,
  name: t.union([tt.NonEmptyString, t.undefined])
})

// Types

export type Workout = t.TypeOf<typeof WorkoutCodec>
export type WorkoutRow = t.TypeOf<typeof WorkoutRowCodec>
export type CreateWorkoutInput = t.TypeOf<typeof CreateWorkoutCodec>
export type UpdateWorkoutInput = t.TypeOf<typeof UpdateWorkoutCodec>
