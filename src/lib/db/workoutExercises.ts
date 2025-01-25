import { SQLiteDatabase, SQLiteRunResult } from "expo-sqlite"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import * as A from "fp-ts/Array"
import * as R from "fp-ts/Record"
import * as O from "fp-ts/Option"
import {
  CreateWorkoutExerciseInput,
  UpdateWorkoutExerciseInput,
  WorkoutExercise,
  WorkoutExerciseRow
} from "@/lib/types/workoutExercise"
import {
  tryCatch,
  generateInsertQuery,
  generateUpdateQuery,
  runAsync,
  handleNotFoundFromResult,
  generateDeleteQuery
} from "@/lib/db/helpers/query"
import { DomainError } from "@/lib/types/errors"
import type { Positive, PositiveInt } from "@/lib/types/branded/number"

const WORKOUT_EXERCISES_TABLE = "workout_exercises"

const notFoundErrorMessage = (id: PositiveInt) =>
  `Workout exercise with id ${id} not found`

type CreateWorkoutExercise = (
  db: SQLiteDatabase
) => (
  input: CreateWorkoutExerciseInput
) => TE.TaskEither<DomainError, SQLiteRunResult>
export const createWorkoutExercise: CreateWorkoutExercise = db => input =>
  pipe(
    { table: WORKOUT_EXERCISES_TABLE, values: input },
    generateInsertQuery,
    runAsync(db)
  )

type UpdateWorkoutExercise = (
  db: SQLiteDatabase
) => (
  input: UpdateWorkoutExerciseInput
) => TE.TaskEither<DomainError, SQLiteRunResult>
export const updateWorkoutExercise: UpdateWorkoutExercise = db => input =>
  pipe(
    {
      table: WORKOUT_EXERCISES_TABLE,
      values: R.deleteAt("id")(input),
      where: { id: input.id }
    },
    generateUpdateQuery,
    runAsync(db),
    handleNotFoundFromResult(notFoundErrorMessage(input.id))
  )

type DeleteWorkoutExercise = (
  db: SQLiteDatabase
) => (id: PositiveInt) => TE.TaskEither<DomainError, SQLiteRunResult>
export const deleteWorkoutExercise: DeleteWorkoutExercise = db => id =>
  pipe(
    { table: WORKOUT_EXERCISES_TABLE, where: { id } },
    generateDeleteQuery,
    runAsync(db),
    handleNotFoundFromResult(notFoundErrorMessage(id))
  )

type MapRowToWorkoutExercise = (row: WorkoutExerciseRow) => WorkoutExercise
const mapRowToWorkoutExercise: MapRowToWorkoutExercise = row => ({
  id: row.id,
  sets: row.sets,
  reps: row.reps,
  weight: row.weight,
  notes: row.notes,
  exerciseId: row.exercise_id,
  workoutId: row.workout_id,
  exerciseName: row.exercise_name,
  muscleGroup: row.muscle_group
})

type ListWorkoutExercises = (
  db: SQLiteDatabase
) => (workoutId: PositiveInt) => TE.TaskEither<DomainError, WorkoutExercise[]>
export const listWorkoutExercises: ListWorkoutExercises = db => workoutId => {
  const query = `
SELECT we.*, e.name as exercise_name, e.muscle_group FROM ${WORKOUT_EXERCISES_TABLE} we
INNER JOIN exercises e ON we.exercise_id = e.id WHERE we.workout_id = ? ORDER BY we.id ASC   
`

  return pipe(
    db.getAllAsync<WorkoutExerciseRow>(query, [workoutId]),
    tryCatch,
    TE.map(A.map(mapRowToWorkoutExercise))
  )
}

type GetLatestWeightOfExercise = (
  db: SQLiteDatabase
) => (exerciseId: PositiveInt) => TE.TaskEither<DomainError, O.Option<Positive>>
export const getLatestWeightOfExercise: GetLatestWeightOfExercise =
  db => exerciseId =>
    pipe(
      db.getFirstAsync<WorkoutExerciseRow>(
        `SELECT * FROM ${WORKOUT_EXERCISES_TABLE} WHERE exercise_id = ? ORDER BY id DESC LIMIT 1`,
        [exerciseId]
      ),
      tryCatch,
      TE.map(O.fromNullable),
      TE.map(weOpt =>
        pipe(
          weOpt,
          O.map(we => we.weight)
        )
      ),
      TE.map(weOrNull =>
        pipe(
          weOrNull,
          O.flatMap(O.fromNullable)
        )
      )
    )
