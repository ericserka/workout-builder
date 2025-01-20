import { CustomButton } from "@/app/components/CustomButton"
import { FlatListOfCards } from "@/app/components/FlatListOfCards"
import { onDelete } from "@/app/helpers/alert"
import { useStore } from "@/app/helpers/store"
import { useWorkoutExercisesDb } from "@/app/hooks/useWorkoutExercisesDb"
import { Workout } from "@/lib/types/workout"
import { useSQLiteContext } from "expo-sqlite"
import { pipe } from "fp-ts/function"
import * as O from "fp-ts/Option"
import { useEffect } from "react"
import { ActivityIndicator, StyleSheet, Text, View } from "react-native"

export const WorkoutExercises = () => {
  const {
    workout,
    navigate,
    setWorkoutExercise,
    clearWorkoutExercise,
    fallbackToHome
  } = useStore()
  const { list, loading, workoutExercises, remove } = useWorkoutExercisesDb()
  const db = useSQLiteContext()

  useEffect(() => {
    if (O.isSome(workout)) {
      list(db, workout.value.id)
    }
  }, [workout])

  const SomeWorkout = ({ w }: { w: Workout }) => {
    if (loading.query) {
      return <ActivityIndicator size="large" />
    }

    return (
      <View>
        <CustomButton
          title={"Add a new exercise to this workout"}
          disabled={loading.mutation}
          onPress={() => {
            clearWorkoutExercise()
            navigate("workoutExerciseForm")
          }}
        />
        <Text style={styles.title}>{`${w.name} exercises`}</Text>
        <FlatListOfCards
          data={workoutExercises}
          keyExtractor={item => item.id.toString()}
          title={item => item.exerciseName}
          subtitle={item =>
            `${item.sets}x ${item.reps} ${item.weight ? `- ${item.weight}kg` : ""}`
          }
          actionsDisabled={loading.mutation}
          onCardPress={item => {
            setWorkoutExercise(item)
            navigate("workoutExercise")
          }}
          onDeletePress={item => {
            onDelete("Delete Exercise", () => remove(db, item.id))
          }}
          onEditPress={item => {
            setWorkoutExercise(item)
            navigate("workoutExerciseForm")
          }}
        />
      </View>
    )
  }

  const onNone = () => {
    fallbackToHome()

    return <></>
  }

  const onSome = (w: Workout) => {
    return <SomeWorkout w={w} />
  }

  return pipe(workout, O.match(onNone, onSome))
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12
  }
})
