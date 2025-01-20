import {
  handleError,
  invalidQueryError,
  notFoundError
} from "@/lib/db/helpers/errors"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"
import * as O from "fp-ts/Option"
import * as R from "fp-ts/Record"
import * as A from "fp-ts/Array"
import * as ArrayHelpers from "@/lib/helpers/array"
import { SQLiteBindValue, SQLiteDatabase, SQLiteRunResult } from "expo-sqlite"
import { DomainError } from "@/lib/types/errors"
import { camelToSnake } from "@/lib/helpers/string"

export const tryCatch = <T>(query: Promise<T>) =>
  TE.tryCatch(() => query, handleError)

type RunAsync = (
  db: SQLiteDatabase
) => (
  query: O.Option<[string, SQLiteBindValue[]]>
) => TE.TaskEither<DomainError, SQLiteRunResult>
export const runAsync: RunAsync = db => query =>
  pipe(
    query,
    TE.fromOption(invalidQueryError),
    TE.map(([query, params]) => db.runAsync(query, ...params)),
    TE.flatMap(tryCatch)
  )

export const handleNotFoundFromNullable = <T>(message: string) =>
  TE.flatMap((result: T | null) =>
    pipe(
      result,
      O.fromNullable,
      TE.fromOption(() => notFoundError(message))
    )
  )

export const handleNotFoundFromResult = (message: string) =>
  TE.flatMap((result: SQLiteRunResult) => {
    if (result.changes === 0) {
      return pipe(message, notFoundError, TE.left)
    }
    return TE.right(result)
  })

const generateUnnamedParams = (length: number): string =>
  pipe(A.replicate(length, "?"), ArrayHelpers.join(", "))

const normalizeValue = (value: SQLiteBindValue) =>
  typeof value === "boolean" ? (value ? 1 : 0) : value

type RecordEntry = [string, SQLiteBindValue]
const normalizeRecord = ([key, value]: RecordEntry): RecordEntry => [
  camelToSnake(key),
  normalizeValue(value)
]

const removeNullablesAndUnzip = (
  record: Record<string, SQLiteBindValue | undefined>
) =>
  pipe(
    record,
    R.filter(value => value !== undefined),
    R.toEntries,
    A.map(normalizeRecord),
    A.unzip
  )

const noneIfCondition = <T>(condition: boolean, expression: T) =>
  condition ? O.none : expression

interface GenerateInsertQueryInput {
  table: string
  values: Record<string, SQLiteBindValue | undefined>
}
type GenerateInsertQuery = (
  input: GenerateInsertQueryInput
) => O.Option<[string, SQLiteBindValue[]]>
export const generateInsertQuery: GenerateInsertQuery = input =>
  pipe(input.values, removeNullablesAndUnzip, ([columns, params]) =>
    noneIfCondition(
      A.isEmpty(columns),
      O.some([
        `INSERT INTO ${input.table} (${ArrayHelpers.join(", ")(columns)}) VALUES (${pipe(columns, A.size, generateUnnamedParams)})`,
        params
      ])
    )
  )

interface GenerateUpdateQueryInput {
  table: string
  values: Record<string, SQLiteBindValue | undefined>
  where: Record<string, SQLiteBindValue>
}
type GenerateUpdateQuery = (
  input: GenerateUpdateQueryInput
) => O.Option<[string, SQLiteBindValue[]]>
export const generateUpdateQuery: GenerateUpdateQuery = input =>
  pipe(input.values, removeNullablesAndUnzip, ([setColumns, setParams]) =>
    noneIfCondition(
      A.isEmpty(setColumns),
      pipe(
        input.where,
        removeNullablesAndUnzip,
        ([whereColumns, whereParams]) =>
          noneIfCondition(
            A.isEmpty(whereColumns),
            O.some([
              `UPDATE ${input.table} SET ${pipe(
                setColumns,
                A.map(col => `${col} = ?`),
                ArrayHelpers.join(", ")
              )} WHERE ${pipe(
                whereColumns,
                A.map(col => `${col} = ?`),
                ArrayHelpers.join(" AND ")
              )}`,
              [...setParams, ...whereParams]
            ])
          )
      )
    )
  )

interface GenerateDeleteQueryInput {
  table: string
  where: Record<string, SQLiteBindValue>
}
type GenerateDeleteQuery = (
  input: GenerateDeleteQueryInput
) => O.Option<[string, SQLiteBindValue[]]>
export const generateDeleteQuery: GenerateDeleteQuery = input =>
  pipe(input.where, removeNullablesAndUnzip, ([columns, params]) =>
    noneIfCondition(
      A.isEmpty(columns),
      O.some([
        `DELETE FROM ${input.table} WHERE ${pipe(
          columns,
          A.map(col => `${col} = ?`),
          ArrayHelpers.join(" AND ")
        )}`,
        params
      ])
    )
  )
