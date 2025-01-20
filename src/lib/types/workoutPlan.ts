import * as t from "io-ts"
import * as tt from "io-ts-types"
import { Binary, PositiveInt } from "@/lib/types/branded/number"
import {
  FriendlyNonEmptyString,
  NullFromEmptyString,
  UndefinedFromEmptyString
} from "@/lib/types/branded/string"
import { Optional } from "@/lib/types/helpers/optional"
import { Nullable } from "@/lib/types/helpers/nullable"

// Codecs

export const WorkoutPlanCodec = t.type({
  id: PositiveInt,
  name: FriendlyNonEmptyString,
  description: Nullable(t.string),
  isActive: tt.BooleanFromNumber
})

export const WorkoutPlanRowCodec = t.type({
  id: PositiveInt,
  name: FriendlyNonEmptyString,
  description: Nullable(t.string),
  is_active: Binary
})

export const CreateWorkoutPlanCodec = t.type({
  name: FriendlyNonEmptyString,
  description: Optional(UndefinedFromEmptyString)
})

export const UpdateWorkoutPlanCodec = t.type({
  id: PositiveInt,
  name: Optional(FriendlyNonEmptyString),
  description: Optional(NullFromEmptyString),
  isActive: Optional(t.boolean)
})

// Types

export type WorkoutPlan = t.TypeOf<typeof WorkoutPlanCodec>
export type WorkoutPlanRow = t.TypeOf<typeof WorkoutPlanRowCodec>
export type CreateWorkoutPlanInput = t.TypeOf<typeof CreateWorkoutPlanCodec>
export type UpdateWorkoutPlanInput = t.TypeOf<typeof UpdateWorkoutPlanCodec>
