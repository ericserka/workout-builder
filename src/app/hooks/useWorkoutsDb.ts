import {
  createWorkout,
  deleteWorkout,
  listWorkoutPlanWorkouts,
  updateWorkout
} from "@/lib/db/workouts"
import {
  CreateWorkoutInput,
  UpdateWorkoutInput,
  Workout
} from "@/lib/types/workout"
import { SQLiteDatabase } from "expo-sqlite"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import * as A from "fp-ts/Array"
import { Alert } from "react-native"
import { useStore } from "@/app/helpers/store"
import { create } from "zustand"
import { type PositiveInt } from "@/lib/types/branded/number"
import { alertDomainError } from "@/app/helpers/alert"
import { Loading } from "@/app/types"

interface UseWorkoutsDb {
  create: (db: SQLiteDatabase, input: CreateWorkoutInput) => void
  update: (db: SQLiteDatabase, input: UpdateWorkoutInput) => void
  list: (db: SQLiteDatabase, workoutPlanId: PositiveInt) => void
  remove: (db: SQLiteDatabase, id: PositiveInt) => void
  loading: Loading
  workouts: Workout[]
}

export const useWorkoutsDb = create<UseWorkoutsDb>(set => {
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
      workouts: pipe(
        state.workouts,
        A.filter(w => w.id !== id)
      )
    }))

  return {
    loading: {
      query: false,
      mutation: false
    },
    workouts: [],
    create: (db, input) => {
      toggleMutationLoading()

      pipe(
        input,
        createWorkout(db),
        TE.match(
          error => {
            alertDomainError(error)
            toggleMutationLoading()
          },
          () => {
            Alert.alert("New workout created!")
            toggleMutationLoading()
            navigate("workoutPlanWorkouts")
          }
        )
      )()
    },
    update: (db, input) => {
      toggleMutationLoading()

      pipe(
        input,
        updateWorkout(db),
        TE.match(
          error => {
            alertDomainError(error)
            toggleMutationLoading()
          },
          () => {
            Alert.alert("Workout updated!")
            toggleMutationLoading()
            navigate("workoutPlanWorkouts")
          }
        )
      )()
    },
    list: (db, workoutPlanId) => {
      toggleQueryLoading()

      pipe(
        workoutPlanId,
        listWorkoutPlanWorkouts(db),
        TE.match(
          error => {
            alertDomainError(error)
            toggleQueryLoading()
          },
          workouts => {
            set({ workouts })
            toggleQueryLoading()
          }
        )
      )()
    },
    remove: (db, id) => {
      toggleMutationLoading()

      pipe(
        id,
        deleteWorkout(db),
        TE.match(
          error => {
            alertDomainError(error)
            toggleMutationLoading()
          },
          () => {
            deleteIdFromStore(id)
            Alert.alert("Workout deleted!")
            toggleMutationLoading()
          }
        )
      )()
    }
  }
})
