import { Resolver, FieldValues } from "react-hook-form"

export type Screen =
  | "workoutPlans"
  | "workoutPlanForm"
  | "workoutPlanWorkouts"
  | "workoutForm"
  | "workoutExercises"

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
