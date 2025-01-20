import { SQLiteDatabase, SQLiteRunResult } from "expo-sqlite"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import * as A from "fp-ts/Array"
import * as R from "fp-ts/Record"
import {
  CreateExerciseInput,
  UpdateExerciseInput,
  Exercise,
  ExerciseRow
} from "@/lib/types/exercise"
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

const EXERCISES_TABLE = "exercises"

const notFoundErrorMessage = (id: PositiveInt) =>
  `Exercise with id ${id} not found`

type CreateExercise = (
  db: SQLiteDatabase
) => (input: CreateExerciseInput) => TE.TaskEither<DomainError, SQLiteRunResult>
export const createExercise: CreateExercise = db => input =>
  pipe(
    { table: EXERCISES_TABLE, values: input },
    generateInsertQuery,
    runAsync(db)
  )

type UpdateExercise = (
  db: SQLiteDatabase
) => (input: UpdateExerciseInput) => TE.TaskEither<DomainError, SQLiteRunResult>
export const updateExercise: UpdateExercise = db => input =>
  pipe(
    {
      table: EXERCISES_TABLE,
      values: R.deleteAt("id")(input),
      where: { id: input.id }
    },
    generateUpdateQuery,
    runAsync(db),
    handleNotFoundFromResult(notFoundErrorMessage(input.id))
  )

type DeleteExercise = (
  db: SQLiteDatabase
) => (id: PositiveInt) => TE.TaskEither<DomainError, SQLiteRunResult>
export const deleteExercise: DeleteExercise = db => id =>
  pipe(
    { table: EXERCISES_TABLE, where: { id } },
    generateDeleteQuery,
    runAsync(db),
    handleNotFoundFromResult(notFoundErrorMessage(id))
  )

type MapRowToExercise = (row: ExerciseRow) => Exercise
const mapRowToExercise: MapRowToExercise = row => ({
  id: row.id,
  name: row.name,
  muscleGroup: row.muscle_group,
  description: row.description
})

type ListExercises = (
  db: SQLiteDatabase
) => TE.TaskEither<DomainError, Exercise[]>
export const listExercises: ListExercises = db =>
  pipe(
    db.getAllAsync<ExerciseRow>(
      `SELECT * FROM ${EXERCISES_TABLE} ORDER BY muscle_group ASC, name ASC`
    ),
    tryCatch,
    TE.map(A.map(mapRowToExercise))
  )
