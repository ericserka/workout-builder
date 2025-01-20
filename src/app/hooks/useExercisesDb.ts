import {
  createExercise,
  deleteExercise,
  listExercises,
  updateExercise
} from "@/lib/db/exercises"
import {
  CreateExerciseInput,
  UpdateExerciseInput,
  Exercise
} from "@/lib/types/exercise"
import { SQLiteDatabase } from "expo-sqlite"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import * as A from "fp-ts/Array"
import { Alert } from "react-native"
import { useStore } from "@/app/helpers/store"
import { create } from "zustand"
import type { PositiveInt } from "@/lib/types/branded/number"
import { alertDomainError } from "@/app/helpers/alert"
import { Loading } from "@/app/types"

interface UseExercisesDb {
  create: (db: SQLiteDatabase, input: CreateExerciseInput) => void
  update: (db: SQLiteDatabase, input: UpdateExerciseInput) => void
  list: (db: SQLiteDatabase) => void
  remove: (db: SQLiteDatabase, id: PositiveInt) => void
  loading: Loading
  exercises: Exercise[]
}

export const useExercisesDb = create<UseExercisesDb>(set => {
  const { navigate } = useStore.getState()

  const toggleQueryLoading = () =>
    set(state => ({
      loading: { ...state.loading, query: !state.loading.query }
    }))
  const toggleMutationLoading = () =>
    set(state => ({
      loading: { ...state.loading, mutation: !state.loading.mutation }
    }))

  const deleteIdFromStore = (id: PositiveInt) =>
    set(state => ({
      exercises: pipe(
        state.exercises,
        A.filter(e => e.id !== id)
      )
    }))

  return {
    loading: {
      query: false,
      mutation: false
    },
    exercises: [],
    create: (db, input) => {
      toggleMutationLoading()

      pipe(
        input,
        createExercise(db),
        TE.match(
          error => {
            alertDomainError(error)
            toggleMutationLoading()
          },
          () => {
            Alert.alert("New exercise created!")
            toggleMutationLoading()
            navigate("exercises")
          }
        )
      )()
    },
    update: (db, input) => {
      toggleMutationLoading()

      pipe(
        input,
        updateExercise(db),
        TE.match(
          error => {
            alertDomainError(error)
            toggleMutationLoading()
          },
          () => {
            Alert.alert("Exercise updated!")
            toggleMutationLoading()
            navigate("exercises")
          }
        )
      )()
    },
    list: db => {
      toggleQueryLoading()

      pipe(
        db,
        listExercises,
        TE.match(
          error => {
            alertDomainError(error)
            toggleQueryLoading()
          },
          exercises => {
            set({ exercises })
            toggleQueryLoading()
          }
        )
      )()
    },
    remove: (db, id) => {
      toggleMutationLoading()

      pipe(
        id,
        deleteExercise(db),
        TE.match(
          error => {
            alertDomainError(error)
            toggleMutationLoading()
          },
          () => {
            deleteIdFromStore(id)
            Alert.alert("Exercise deleted!")
            toggleMutationLoading()
          }
        )
      )()
    }
  }
})
