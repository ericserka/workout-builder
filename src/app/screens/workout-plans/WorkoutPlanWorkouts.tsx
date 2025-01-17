import { CustomButton } from "@/app/components/CustomButton"
import { FlatListOfCards } from "@/app/components/FlatListOfCards"
import { onDelete } from "@/app/helpers/alert"
import { useStore } from "@/app/helpers/store"
import { useWorkoutsDb } from "@/app/hooks/useWorkoutsDb"
import { WorkoutPlan } from "@/lib/types/workoutPlan"
import { useSQLiteContext } from "expo-sqlite"
import { pipe } from "fp-ts/function"
import * as O from "fp-ts/Option"
import { useEffect } from "react"
import { ActivityIndicator, StyleSheet, Text, View } from "react-native"

export const WorkoutPlanWorkouts = () => {
  const { workoutPlan, navigate, setWorkout, clearWorkout } = useStore()
  const { list, loading, workouts, remove } = useWorkoutsDb()
  const db = useSQLiteContext()

  useEffect(() => {
    if (O.isSome(workoutPlan)) {
      list(db, workoutPlan.value.id)
    }
  }, [workoutPlan])

  const SomeWorkoutPlan = ({ wp }: { wp: WorkoutPlan }) => {
    if (loading.query) {
      return <ActivityIndicator size="large" />
    }

    return (
      <View>
        <CustomButton
          title={"Create new workout for this plan"}
          disabled={loading.mutation}
          onPress={() => {
            clearWorkout()
            navigate("workoutForm")
          }}
        />
        <Text style={styles.title}>{`${wp.name} workouts`}</Text>
        <FlatListOfCards
          data={workouts}
          keyExtractor={item => item.id.toString()}
          title={item => item.name}
          actionsDisabled={loading.mutation}
          onCardPress={item => {
            setWorkout(item)
            navigate("workoutExercises")
          }}
          onDeletePress={item => {
            onDelete("Delete Workout", () => remove(db, item.id))
          }}
          onEditPress={item => {
            setWorkout(item)
            navigate("workoutForm")
          }}
        />
      </View>
    )
  }

  const onNone = () => {
    navigate("workoutPlans")

    return <></>
  }

  const onSome = (wp: WorkoutPlan) => {
    return <SomeWorkoutPlan wp={wp} />
  }

  return pipe(workoutPlan, O.match(onNone, onSome))
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12
  }
})
