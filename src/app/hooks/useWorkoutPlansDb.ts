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
import { DomainError } from "@/lib/types/errors"
import { create } from "zustand"

type Loading = {
  create: boolean
  list: boolean
  update: boolean
  delete: boolean
}

interface UseWorkoutPlansDb {
  create: (db: SQLiteDatabase, input: CreateWorkoutPlanInput) => void
  update: (db: SQLiteDatabase, input: UpdateWorkoutPlanInput) => void
  list: (db: SQLiteDatabase) => void
  remove: (db: SQLiteDatabase, id: number) => void
  loading: Loading
  active: WorkoutPlan[]
  inactive: WorkoutPlan[]
  all: WorkoutPlan[]
}

export const useWorkoutPlansDb = create<UseWorkoutPlansDb>(set => {
  const { navigate } = useStore.getState()

  const toggleCreateLoading = () =>
    set(state => ({
      loading: { ...state.loading, create: !state.loading.create }
    }))
  const toggleListLoading = () =>
    set(state => ({
      loading: { ...state.loading, list: !state.loading.list }
    }))
  const toggleUpdateLoading = () =>
    set(state => ({
      loading: { ...state.loading, update: !state.loading.update }
    }))
  const toggleDeleteLoading = () =>
    set(state => ({
      loading: { ...state.loading, delete: !state.loading.delete }
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

  const deleteIdFromStore = (id: number) =>
    set(state => ({
      all: pipe(
        state.all,
        A.filter(wp => wp.id !== id)
      )
    }))

  const alertDomainError = (error: DomainError) =>
    Alert.alert(error.type, error.message)

  return {
    loading: {
      create: false,
      list: false,
      update: false,
      delete: false
    },
    active: [],
    inactive: [],
    all: [],
    create: (db, input) => {
      toggleCreateLoading()

      pipe(
        input,
        createWorkoutPlan(db),
        TE.match(
          error => {
            alertDomainError(error)
            toggleCreateLoading()
          },
          () => {
            Alert.alert("New workout plan created!")
            toggleCreateLoading()
            navigate("workoutPlans")
          }
        )
      )()
    },
    update: (db, input) => {
      toggleUpdateLoading()

      pipe(
        input,
        updateWorkoutPlan(db),
        TE.match(
          error => {
            alertDomainError(error)
            toggleUpdateLoading()
          },
          () => {
            Alert.alert("Workout plan updated!")
            toggleUpdateLoading()
            navigate("workoutPlans")
          }
        )
      )()
    },
    list: db => {
      toggleListLoading()

      pipe(
        db,
        listWorkoutPlans,
        TE.match(
          error => {
            alertDomainError(error)
            toggleListLoading()
          },
          workoutPlans => {
            set({ all: workoutPlans })
            updateActive()
            updateInactive()
            toggleListLoading()
          }
        )
      )()
    },
    remove: (db, id) => {
      toggleDeleteLoading()

      pipe(
        id,
        deleteWorkoutPlan(db),
        TE.match(
          error => {
            alertDomainError(error)
            toggleDeleteLoading()
          },
          () => {
            deleteIdFromStore(id)
            updateActive()
            updateInactive()
            Alert.alert("Workout plan deleted!")
            toggleDeleteLoading()
          }
        )
      )()
    }
  }
})
