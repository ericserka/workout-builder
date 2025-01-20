import * as A from "fp-ts/Array"
import { pipe } from "fp-ts/function"
import * as R from "fp-ts/Record"
import * as O from "fp-ts/Option"

export const join =
  <T>(separator: string) =>
  (array: T[]) =>
    array.join(separator)

type GroupBy = <T, K extends string>(
  fn: (a: T) => K
) => (array: T[]) => Record<K, T[]>
export const groupBy: GroupBy =
  <T, K extends string>(fn: (a: T) => K) =>
  (array: T[]) =>
    pipe(
      array,
      A.reduce({} as Record<K, T[]>, (acc, item) => {
        const key = fn(item)

        return pipe(
          acc,
          R.modifyAt(key, items => [...items, item]),
          O.getOrElse(() => R.upsertAt(key, [item])(acc))
        )
      })
    )
