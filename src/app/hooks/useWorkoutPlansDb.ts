import {
  createWorkoutPlan,
  deleteWorkoutPlan,
  listWorkoutPlans,
  updateWorkoutPlan
} from "@/lib/db/workoutPlans"
import {
  CreateWorkoutPlanInput,
  UpdateWorkoutPlanInput,
  WorkoutPlan
} from "@/lib/types/workoutPlan"
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

interface UseWorkoutPlansDb {
  create: (db: SQLiteDatabase, input: CreateWorkoutPlanInput) => void
  update: (db: SQLiteDatabase, input: UpdateWorkoutPlanInput) => void
  list: (db: SQLiteDatabase) => void
  remove: (db: SQLiteDatabase, id: PositiveInt) => void
  loading: Loading
  active: WorkoutPlan[]
  inactive: WorkoutPlan[]
  all: WorkoutPlan[]
}

export const useWorkoutPlansDb = create<UseWorkoutPlansDb>(set => {
  const { navigate } = useStore.getState()

  const toggleQueryLoading = () =>
    set(state => ({
      loading: { ...state.loading, query: !state.loading.query }
    }))
  const toggleMutationLoading = () =>
    set(state => ({
      loading: { ...state.loading, mutation: !state.loading.mutation }
    }))

  const updateActive = () =>
    set(state => ({
      active: pipe(
        state.all,
        A.filter(wp => wp.isActive)
      )
    }))
  const updateInactive = () =>
    set(state => ({
      inactive: pipe(
        state.all,
        A.filter(wp => !wp.isActive)
      )
    }))

  const deleteIdFromStore = (id: PositiveInt) =>
    set(state => ({
      all: pipe(
        state.all,
        A.filter(wp => wp.id !== id)
      )
    }))

  return {
    loading: {
      query: false,
      mutation: false
    },
    active: [],
    inactive: [],
    all: [],
    create: (db, input) => {
      toggleMutationLoading()

      pipe(
        input,
        createWorkoutPlan(db),
        TE.match(
          error => {
            alertDomainError(error)
            toggleMutationLoading()
          },
          () => {
            Alert.alert("New workout plan created!")
            toggleMutationLoading()
            navigate("workoutPlans")
          }
        )
      )()
    },
    update: (db, input) => {
      toggleMutationLoading()

      pipe(
        input,
        updateWorkoutPlan(db),
        TE.match(
          error => {
            alertDomainError(error)
            toggleMutationLoading()
          },
          () => {
            Alert.alert("Workout plan updated!")
            toggleMutationLoading()
            navigate("workoutPlans")
          }
        )
      )()
    },
    list: db => {
      toggleQueryLoading()

      pipe(
        db,
        listWorkoutPlans,
        TE.match(
          error => {
            alertDomainError(error)
            toggleQueryLoading()
          },
          workoutPlans => {
            set({ all: workoutPlans })
            updateActive()
            updateInactive()
            toggleQueryLoading()
          }
        )
      )()
    },
    remove: (db, id) => {
      toggleMutationLoading()

      pipe(
        id,
        deleteWorkoutPlan(db),
        TE.match(
          error => {
            alertDomainError(error)
            toggleMutationLoading()
          },
          () => {
            deleteIdFromStore(id)
            updateActive()
            updateInactive()
            Alert.alert("Workout plan deleted!")
            toggleMutationLoading()
          }
        )
      )()
    }
  }
})
