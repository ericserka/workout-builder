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
