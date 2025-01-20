import { Resolver, FieldValues } from "react-hook-form"

export type Screen =
  | "workoutPlans"
  | "workoutPlanForm"
  | "workoutPlanWorkouts"
  | "workoutForm"
  | "workoutExercises"
  | "workoutExercise"
  | "workoutExerciseForm"
  | "exercises"
  | "exercise"
  | "exerciseForm"

export type Loading = {
  query: boolean
  mutation: boolean
}

export type FormProps<T extends FieldValues> = {
  resolver: Resolver<T>
  defaultValues: Partial<T>
  onSubmit: (data: T) => void
  title: string
}
