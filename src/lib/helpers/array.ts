import * as A from "fp-ts/Array"
import { pipe } from "fp-ts/function"
import * as R from "fp-ts/Record"
import * as O from "fp-ts/Option"
import * as Eq from "fp-ts/Eq"

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

type RemoveDuplicates = <A>(eq: Eq.Eq<A>) => (arr: A[]) => A[]
export const removeDuplicates: RemoveDuplicates =
  <A>(eq: Eq.Eq<A>) =>
  (arr: A[]): A[] =>
    pipe(
      arr,
      A.reduce<A, A[]>([], (acc, elem) =>
        pipe(
          acc,
          A.findFirst(item => eq.equals(item, elem)),
          O.match(
            () => [...acc, elem],
            () => acc
          )
        )
      )
    )
