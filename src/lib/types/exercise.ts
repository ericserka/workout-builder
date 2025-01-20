import * as t from "io-ts"
import { PositiveInt } from "@/lib/types/branded/number"
import {
  FriendlyNonEmptyString,
  MuscleGroup,
  NullFromEmptyString,
  UndefinedFromEmptyString
} from "@/lib/types/branded/string"
import { Nullable } from "./helpers/nullable"
import { Optional } from "./helpers/optional"

// Codecs

export const ExerciseCodec = t.type({
  id: PositiveInt,
  name: FriendlyNonEmptyString,
  muscleGroup: MuscleGroup,
  description: Nullable(t.string)
})

export const ExerciseRowCodec = t.type({
  id: PositiveInt,
  name: FriendlyNonEmptyString,
  muscle_group: MuscleGroup,
  description: Nullable(t.string)
})

export const CreateExerciseCodec = t.type({
  name: FriendlyNonEmptyString,
  muscleGroup: MuscleGroup,
  description: Optional(UndefinedFromEmptyString)
})

export const UpdateExerciseCodec = t.type({
  id: PositiveInt,
  name: Optional(FriendlyNonEmptyString),
  muscleGroup: Optional(MuscleGroup),
  description: Optional(NullFromEmptyString)
})

// Types

export type Exercise = t.TypeOf<typeof ExerciseCodec>
export type ExerciseRow = t.TypeOf<typeof ExerciseRowCodec>
export type CreateExerciseInput = t.TypeOf<typeof CreateExerciseCodec>
export type UpdateExerciseInput = t.TypeOf<typeof UpdateExerciseCodec>
