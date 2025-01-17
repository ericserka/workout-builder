import { Screen } from "@/app/types"
import { WorkoutPlan } from "@/lib/types/workoutPlan"
import { create } from "zustand"
import * as O from "fp-ts/Option"
import { Workout } from "@/lib/types/workout"

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
}

export const useStore = create<WorkoutBuilderState>(set => {
  const prevScreen: Record<Screen, Screen> = {
    workoutPlans: "workoutPlans",
    workoutPlanForm: "workoutPlans",
    workoutPlanWorkouts: "workoutPlans",
    workoutForm: "workoutPlanWorkouts",
    workoutExercises: "workoutPlanWorkouts"
  }

  return {
    screen: "workoutPlans",
    workoutPlan: O.none,
    workout: O.none,
    navigate: screen => set({ screen }),
    setWorkoutPlan: workoutPlan => set({ workoutPlan: O.some(workoutPlan) }),
    clearWorkoutPlan: () => set({ workoutPlan: O.none }),
    navigateBack: () => set(state => ({ screen: prevScreen[state.screen] })),
    setWorkout: workout => set({ workout: O.some(workout) }),
    clearWorkout: () => set({ workout: O.none })
  }
})
