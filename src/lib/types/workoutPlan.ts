import * as t from "io-ts"
import * as tt from "io-ts-types"

// Codecs

export const WorkoutPlanCodec = t.type({
  id: t.number,
  name: t.string,
  description: t.union([t.string, t.null]),
  isActive: tt.BooleanFromNumber
})

export const WorkoutPlanRowCodec = t.type({
  id: t.number,
  name: t.string,
  description: t.union([t.string, t.null]),
  is_active: t.number
})

export const CreateWorkoutPlanCodec = t.type({
  name: tt.NonEmptyString,
  description: t.union([t.string, t.undefined])
})

export const UpdateWorkoutPlanCodec = t.type({
  id: t.number,
  name: t.union([tt.NonEmptyString, t.undefined]),
  description: t.union([t.string, t.undefined]),
  isActive: t.union([t.boolean, t.undefined])
})

// Types

export type WorkoutPlan = t.TypeOf<typeof WorkoutPlanCodec>
export type WorkoutPlanRow = t.TypeOf<typeof WorkoutPlanRowCodec>
export type CreateWorkoutPlanInput = t.TypeOf<typeof CreateWorkoutPlanCodec>
export type UpdateWorkoutPlanInput = t.TypeOf<typeof UpdateWorkoutPlanCodec>
