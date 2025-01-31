import { SQLiteDatabase, SQLiteRunResult } from "expo-sqlite"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import * as A from "fp-ts/Array"
import {
  CreateWorkoutPlanInput,
  UpdateWorkoutPlanInput,
  WorkoutPlan,
  WorkoutPlanRow
} from "@/lib/types/workoutPlan"
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

const WORKOUT_PLANS_TABLE = "workout_plans"

const notFoundErrorMessage = (id: PositiveInt) =>
  `Workout plan with id ${id} not found`

type CreateWorkoutPlan = (
  db: SQLiteDatabase
) => (
  input: CreateWorkoutPlanInput
) => TE.TaskEither<DomainError, SQLiteRunResult>
export const createWorkoutPlan: CreateWorkoutPlan = db => input =>
  pipe(
    { table: WORKOUT_PLANS_TABLE, values: input },
    generateInsertQuery,
    runAsync(db)
  )

type UpdateWorkoutPlan = (
  db: SQLiteDatabase
) => (
  input: UpdateWorkoutPlanInput
) => TE.TaskEither<DomainError, SQLiteRunResult>
export const updateWorkoutPlan: UpdateWorkoutPlan = db => input =>
  pipe(
    {
      table: WORKOUT_PLANS_TABLE,
      values: { ...input, id: undefined },
      where: { id: input.id }
    },
    generateUpdateQuery,
    runAsync(db),
    handleNotFoundFromResult(notFoundErrorMessage(input.id))
  )

type DeleteWorkoutPlan = (
  db: SQLiteDatabase
) => (id: PositiveInt) => TE.TaskEither<DomainError, SQLiteRunResult>
export const deleteWorkoutPlan: DeleteWorkoutPlan = db => id =>
  pipe(
    { table: WORKOUT_PLANS_TABLE, where: { id } },
    generateDeleteQuery,
    runAsync(db),
    handleNotFoundFromResult(notFoundErrorMessage(id))
  )

type MapRowToWorkoutPlan = (row: WorkoutPlanRow) => WorkoutPlan
const mapRowToWorkoutPlan: MapRowToWorkoutPlan = row => ({
  id: row.id,
  name: row.name,
  description: row.description,
  isActive: row.is_active === 1
})

type ListWorkoutPlans = (
  db: SQLiteDatabase
) => TE.TaskEither<DomainError, WorkoutPlan[]>
export const listWorkoutPlans: ListWorkoutPlans = db =>
  pipe(
    db.getAllAsync<WorkoutPlanRow>(
      `SELECT * FROM ${WORKOUT_PLANS_TABLE} ORDER BY id DESC`
    ),
    tryCatch,
    TE.map(A.map(mapRowToWorkoutPlan))
  )
