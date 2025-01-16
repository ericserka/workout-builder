import { DomainError } from "@/lib/types/errors"
import { pipe, identity } from "fp-ts/function"
import * as A from "fp-ts/Array"
import * as O from "fp-ts/Option"

const isKnownError = (error: unknown): error is Error => error instanceof Error

const handleKnownError = (error: Error): DomainError => ({
  type: "DatabaseError",
  message: error.message
})

type ErrorHandler = (error: unknown) => O.Option<DomainError>

const errorHandlers: ErrorHandler[] = [
  error =>
    isKnownError(error) ? pipe(error, handleKnownError, O.some) : O.none
]

export const handleError = (error: unknown): DomainError =>
  pipe(
    errorHandlers,
    A.findFirst(handler => pipe(error, handler, O.isSome)),
    O.flatMap(handler => handler(error)),
    O.match(
      () => ({
        type: "DatabaseError",
        message: "An unexpected database error occurred"
      }),
      identity
    )
  )

export const notFoundError = (message: string): DomainError => ({
  type: "NotFoundError",
  message
})

export const invalidQueryError = (): DomainError => ({
  type: "DatabaseError",
  message: "Invalid query. Check input values."
})
