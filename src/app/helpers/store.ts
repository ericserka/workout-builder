import { Screen } from "@/app/types"
import { WorkoutPlan } from "@/lib/types/workoutPlan"
import { create } from "zustand"
import * as O from "fp-ts/Option"

interface WorkoutBuilderState {
  screen: Screen
  workoutPlan: O.Option<WorkoutPlan>
  navigate: (screen: Screen) => void
  setWorkoutPlan: (workoutPlan: WorkoutPlan) => void
  clearWorkoutPlan: () => void
  navigateBack: () => void
}

export const useStore = create<WorkoutBuilderState>(set => {
  const prevScreen: Record<Screen, Screen> = {
    workoutPlans: "workoutPlans",
    workoutPlanForm: "workoutPlans",
    workoutPlan: "workoutPlans"
  }

  return {
    screen: "workoutPlans",
    workoutPlan: O.none,
    navigate: screen => set({ screen }),
    setWorkoutPlan: workoutPlan => set({ workoutPlan: O.some(workoutPlan) }),
    clearWorkoutPlan: () => set({ workoutPlan: O.none }),
    navigateBack: () => set(state => ({ screen: prevScreen[state.screen] }))
  }
})
