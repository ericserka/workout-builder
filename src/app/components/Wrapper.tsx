import { useStore } from "@/app/helpers/store"
import { WorkoutPlans } from "@/app/screens/workout-plans/WorkoutPlans"
import { Screen } from "@/app/types"
import { WorkoutPlanForm } from "@/app/screens/workout-plans/WorkoutPlanForm"

export const Wrapper = () => {
  const { screen } = useStore()

  const screensComponents: Record<Screen, React.JSX.Element> = {
    workoutPlans: <WorkoutPlans />,
    workoutPlanForm: <WorkoutPlanForm />,
    workoutPlan: <></>
  }

  return screensComponents[screen]
}
