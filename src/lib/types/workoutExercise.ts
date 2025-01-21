import * as t from "io-ts"
import { Positive, PositiveInt } from "@/lib/types/branded/number"
import {
  MuscleGroup,
  NullFromEmptyString,
  UndefinedFromEmptyString,
  UndefinedOrPositiveString,
  NullOrPositiveString,
  PositiveIntString
} from "@/lib/types/branded/string"
import { Nullable } from "@/lib/types/helpers/nullable"
import { Optional } from "@/lib/types/helpers/optional"

// Codecs

export const WorkoutExerciseCodec = t.type({
  id: PositiveInt,
  sets: PositiveInt,
  reps: PositiveInt,
  weight: Nullable(Positive),
  notes: Nullable(t.string),
  exerciseId: PositiveInt,
  workoutId: PositiveInt,
  exerciseName: t.string,
  muscleGroup: MuscleGroup
})

export const WorkoutExerciseRowCodec = t.type({
  id: PositiveInt,
  sets: PositiveInt,
  reps: PositiveInt,
  weight: Nullable(Positive),
  notes: Nullable(t.string),
  exercise_id: PositiveInt,
  workout_id: PositiveInt,
  exercise_name: t.string,
  muscle_group: MuscleGroup
})

export const CreateWorkoutExerciseCodec = t.type({
  sets: PositiveIntString,
  reps: PositiveIntString,
  weight: Optional(UndefinedOrPositiveString),
  notes: Optional(UndefinedFromEmptyString),
  exerciseId: PositiveInt,
  workoutId: PositiveInt
})

export const UpdateWorkoutExerciseCodec = t.type({
  id: PositiveInt,
  sets: Optional(PositiveIntString),
  reps: Optional(PositiveIntString),
  weight: Optional(NullOrPositiveString),
  notes: Optional(NullFromEmptyString)
})

// Types

export type WorkoutExercise = t.TypeOf<typeof WorkoutExerciseCodec>
export type WorkoutExerciseRow = t.TypeOf<typeof WorkoutExerciseRowCodec>
export type CreateWorkoutExerciseInput = t.TypeOf<
  typeof CreateWorkoutExerciseCodec
>
export type UpdateWorkoutExerciseInput = t.TypeOf<
  typeof UpdateWorkoutExerciseCodec
>
