import { FieldError } from "react-hook-form"
import * as O from "fp-ts/Option"
import { constFalse, constTrue, pipe } from "fp-ts/function"

type ContainsError = (error: FieldError | undefined) => boolean
export const containsError: ContainsError = error =>
  pipe(error, O.fromNullable, O.match(constFalse, constTrue))
