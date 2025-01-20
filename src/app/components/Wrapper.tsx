import { useStore } from "@/app/helpers/store"
import { WorkoutPlans } from "@/app/screens/workout-plans/WorkoutPlans"
import { Screen } from "@/app/types"
import { WorkoutPlanForm } from "@/app/screens/workout-plans/WorkoutPlanForm"
import { WorkoutPlanWorkouts } from "@/app/screens/workout-plans/WorkoutPlanWorkouts"
import { WorkoutForm } from "@/app/screens/workouts/WorkoutForm"
import { WorkoutExercises } from "@/app/screens/workouts/WorkoutExercises"
import { WorkoutExerciseForm } from "@/app/screens/workout-exercises/WorkoutExerciseForm"
import { WorkoutExerciseDetails } from "@/app/screens/workout-exercises/WorkoutExercise"
import { ExerciseForm } from "@/app/screens/exercises/ExerciseForm"
import { ExerciseDetails } from "@/app/screens/exercises/Exercise"
import { Exercises } from "@/app/screens/exercises/Exercises"

export const Wrapper = () => {
  const { screen } = useStore()

  const screensComponents: Record<Screen, React.JSX.Element> = {
    workoutPlans: <WorkoutPlans />,
    workoutPlanForm: <WorkoutPlanForm />,
    workoutPlanWorkouts: <WorkoutPlanWorkouts />,
    workoutForm: <WorkoutForm />,
    workoutExercises: <WorkoutExercises />,
    workoutExerciseForm: <WorkoutExerciseForm />,
    workoutExercise: <WorkoutExerciseDetails />,
    exerciseForm: <ExerciseForm />,
    exercise: <ExerciseDetails />,
    exercises: <Exercises />
  }

  return screensComponents[screen]
}
