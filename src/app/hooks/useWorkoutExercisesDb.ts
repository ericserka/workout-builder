import {
  createWorkoutExercise,
  deleteWorkoutExercise,
  getLatestWeightOfExercise,
  listWorkoutExercises,
  updateWorkoutExercise
} from "@/lib/db/workoutExercises"
import {
  CreateWorkoutExerciseInput,
  UpdateWorkoutExerciseInput,
  WorkoutExercise
} from "@/lib/types/workoutExercise"
import { SQLiteDatabase } from "expo-sqlite"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import * as A from "fp-ts/Array"
import * as O from "fp-ts/Option"
import { Alert } from "react-native"
import { useStore } from "@/app/helpers/store"
import { create } from "zustand"
import type { Positive, PositiveInt } from "@/lib/types/branded/number"
import { alertDomainError } from "@/app/helpers/alert"
import { Loading } from "@/app/types"

interface UseWorkoutExercisesDb {
  create: (db: SQLiteDatabase, input: CreateWorkoutExerciseInput) => void
  update: (db: SQLiteDatabase, input: UpdateWorkoutExerciseInput) => void
  list: (db: SQLiteDatabase, workoutId: PositiveInt) => void
  remove: (db: SQLiteDatabase, id: PositiveInt) => void
  loading: Loading
  workoutExercises: WorkoutExercise[]
  latestWeightOfExercise: O.Option<Positive>
  fetchLatestWeightForExercise: (
    db: SQLiteDatabase,
    exerciseId: PositiveInt
  ) => void
}

export const useWorkoutExercisesDb = create<UseWorkoutExercisesDb>(set => {
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
      workoutExercises: pipe(
        state.workoutExercises,
        A.filter(we => we.id !== id)
      )
    }))

  return {
    loading: {
      query: false,
      mutation: false
    },
    workoutExercises: [],
    latestWeightOfExercise: O.none,
    fetchLatestWeightForExercise: (db, exerciseId) => {
      toggleQueryLoading()

      pipe(
        exerciseId,
        getLatestWeightOfExercise(db),
        TE.match(
          error => {
            alertDomainError(error)
            toggleQueryLoading()
          },
          latestWeightOfExercise => {
            set({ latestWeightOfExercise })
            toggleQueryLoading()
          }
        )
      )()
    },
    create: (db, input) => {
      toggleMutationLoading()

      pipe(
        input,
        createWorkoutExercise(db),
        TE.match(
          error => {
            alertDomainError(error)
            toggleMutationLoading()
          },
          () => {
            Alert.alert("New workout exercise created!")
            toggleMutationLoading()
            navigate("workoutExercises")
          }
        )
      )()
    },
    update: (db, input) => {
      toggleMutationLoading()

      pipe(
        input,
        updateWorkoutExercise(db),
        TE.match(
          error => {
            alertDomainError(error)
            toggleMutationLoading()
          },
          () => {
            Alert.alert("Workout exercise updated!")
            toggleMutationLoading()
            navigate("workoutExercises")
          }
        )
      )()
    },
    list: (db, workoutId) => {
      toggleQueryLoading()

      pipe(
        workoutId,
        listWorkoutExercises(db),
        TE.match(
          error => {
            alertDomainError(error)
            toggleQueryLoading()
          },
          workoutExercises => {
            set({ workoutExercises })
            toggleQueryLoading()
          }
        )
      )()
    },
    remove: (db, id) => {
      toggleMutationLoading()

      pipe(
        id,
        deleteWorkoutExercise(db),
        TE.match(
          error => {
            alertDomainError(error)
            toggleMutationLoading()
          },
          () => {
            deleteIdFromStore(id)
            Alert.alert("Workout exercise deleted!")
            toggleMutationLoading()
          }
        )
      )()
    }
  }
})
