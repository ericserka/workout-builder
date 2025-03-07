import { SQLiteDatabase, SQLiteRunResult } from "expo-sqlite"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import * as A from "fp-ts/Array"
import {
  CreateWorkoutInput,
  UpdateWorkoutInput,
  Workout,
  WorkoutRow
} from "@/lib/types/workout"
import {
  tryCatch,
  generateInsertQuery,
  generateUpdateQuery,
  runAsync,
  handleNotFoundFromResult,
  generateDeleteQuery
} from "@/lib/db/helpers/query"
import { DomainError } from "@/lib/types/errors"
import type { PositiveInt } from "@/lib/types/branded/number"

const WORKOUTS_TABLE = "workouts"

const notFoundErrorMessage = (id: PositiveInt) =>
  `Workout with id ${id} not found`

type CreateWorkout = (
  db: SQLiteDatabase
) => (input: CreateWorkoutInput) => TE.TaskEither<DomainError, SQLiteRunResult>
export const createWorkout: CreateWorkout = db => input =>
  pipe(
    { table: WORKOUTS_TABLE, values: input },
    generateInsertQuery,
    runAsync(db)
  )

type UpdateWorkout = (
  db: SQLiteDatabase
) => (input: UpdateWorkoutInput) => TE.TaskEither<DomainError, SQLiteRunResult>
export const updateWorkout: UpdateWorkout = db => input =>
  pipe(
    {
      table: WORKOUTS_TABLE,
      values: { ...input, id: undefined },
      where: { id: input.id }
    },
    generateUpdateQuery,
    runAsync(db),
    handleNotFoundFromResult(notFoundErrorMessage(input.id))
  )

type DeleteWorkout = (
  db: SQLiteDatabase
) => (id: PositiveInt) => TE.TaskEither<DomainError, SQLiteRunResult>
export const deleteWorkout: DeleteWorkout = db => id =>
  pipe(
    { table: WORKOUTS_TABLE, where: { id } },
    generateDeleteQuery,
    runAsync(db),
    handleNotFoundFromResult(notFoundErrorMessage(id))
  )

type MapRowToWorkout = (row: WorkoutRow) => Workout
const mapRowToWorkout: MapRowToWorkout = row => ({
  id: row.id,
  name: row.name,
  sequence: row.sequence,
  workoutPlanId: row.workout_plan_id
})

type ListWorkoutPlanWorkouts = (
  db: SQLiteDatabase
) => (workoutPlanId: PositiveInt) => TE.TaskEither<DomainError, Workout[]>
export const listWorkoutPlanWorkouts: ListWorkoutPlanWorkouts =
  db => workoutPlanId =>
    pipe(
      db.getAllAsync<WorkoutRow>(
        `SELECT * FROM ${WORKOUTS_TABLE} WHERE workout_plan_id = ? ORDER BY sequence ASC`,
        [workoutPlanId]
      ),
      tryCatch,
      TE.map(A.map(mapRowToWorkout))
    )
