import * as t from "io-ts"
import * as tt from "io-ts-types"
import { Binary, PositiveInt } from "@/lib/types/branded/number"
import { FriendlyNonEmptyString } from "@/lib/types/branded/string"

// Codecs

export const WorkoutPlanCodec = t.type({
  id: PositiveInt,
  name: FriendlyNonEmptyString,
  description: t.union([t.string, t.null]),
  isActive: tt.BooleanFromNumber
})

export const WorkoutPlanRowCodec = t.type({
  id: PositiveInt,
  name: FriendlyNonEmptyString,
  description: t.union([t.string, t.null]),
  is_active: Binary
})

export const CreateWorkoutPlanCodec = t.type({
  name: FriendlyNonEmptyString,
  description: t.union([t.string, t.undefined])
})

export const UpdateWorkoutPlanCodec = t.type({
  id: PositiveInt,
  name: t.union([FriendlyNonEmptyString, t.undefined]),
  description: t.union([t.string, t.undefined]),
  isActive: t.union([t.boolean, t.undefined])
})

// Types

export type WorkoutPlan = t.TypeOf<typeof WorkoutPlanCodec>
export type WorkoutPlanRow = t.TypeOf<typeof WorkoutPlanRowCodec>
export type CreateWorkoutPlanInput = t.TypeOf<typeof CreateWorkoutPlanCodec>
export type UpdateWorkoutPlanInput = t.TypeOf<typeof UpdateWorkoutPlanCodec>
