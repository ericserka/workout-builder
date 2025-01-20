import { Screen } from "@/app/types"
import { WorkoutPlan } from "@/lib/types/workoutPlan"
import { create } from "zustand"
import * as O from "fp-ts/Option"
import { Workout } from "@/lib/types/workout"
import { WorkoutExercise } from "@/lib/types/workoutExercise"
import { Exercise } from "@/lib/types/exercise"

interface WorkoutBuilderState {
  screen: Screen
  workoutPlan: O.Option<WorkoutPlan>
  navigate: (screen: Screen) => void
  setWorkoutPlan: (workoutPlan: WorkoutPlan) => void
  clearWorkoutPlan: () => void
  navigateBack: () => void
  workout: O.Option<Workout>
  setWorkout: (workout: Workout) => void
  clearWorkout: () => void
  fallbackToHome: () => void
  workoutExercise: O.Option<WorkoutExercise>
  setWorkoutExercise: (workout: WorkoutExercise) => void
  clearWorkoutExercise: () => void
  exercise: O.Option<Exercise>
  setExercise: (exercise: Exercise) => void
  clearExercise: () => void
}

export const useStore = create<WorkoutBuilderState>(set => {
  const prevScreen: Record<Screen, Screen> = {
    workoutPlans: "workoutPlans",
    workoutPlanForm: "workoutPlans",
    workoutPlanWorkouts: "workoutPlans",
    workoutForm: "workoutPlanWorkouts",
    workoutExercises: "workoutPlanWorkouts",
    workoutExercise: "workoutExercises",
    workoutExerciseForm: "workoutExercises",
    exerciseForm: "exercises",
    exercises: "workoutExerciseForm",
    exercise: "exercises"
  }

  return {
    screen: "workoutPlans",
    workoutPlan: O.none,
    workout: O.none,
    workoutExercise: O.none,
    exercise: O.none,
    navigate: screen => set({ screen }),
    setWorkoutPlan: workoutPlan => set({ workoutPlan: O.some(workoutPlan) }),
    clearWorkoutPlan: () => set({ workoutPlan: O.none }),
    navigateBack: () => set(state => ({ screen: prevScreen[state.screen] })),
    setWorkout: workout => set({ workout: O.some(workout) }),
    clearWorkout: () => set({ workout: O.none }),
    fallbackToHome: () => set({ screen: "workoutPlans" }),
    setWorkoutExercise: workoutExercise =>
      set({ workoutExercise: O.some(workoutExercise) }),
    clearWorkoutExercise: () => set({ workoutExercise: O.none }),
    setExercise: exercise => set({ exercise: O.some(exercise) }),
    clearExercise: () => set({ exercise: O.none })
  }
})
