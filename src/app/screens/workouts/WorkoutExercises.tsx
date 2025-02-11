import { CustomButton } from "@/app/components/CustomButton"
import { FlatListOfCards } from "@/app/components/FlatListOfCards"
import { onDelete } from "@/app/helpers/alert"
import { useStore } from "@/app/helpers/store"
import { useWorkoutExercisesDb } from "@/app/hooks/useWorkoutExercisesDb"
import { Workout } from "@/lib/types/workout"
import { MaterialIcons } from "@expo/vector-icons"
import { useSQLiteContext } from "expo-sqlite"
import { constVoid, pipe } from "fp-ts/function"
import * as O from "fp-ts/Option"
import * as B from "fp-ts/boolean"
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
    pipe(
      workout,
      O.match(constVoid, w => list(db, w.id))
    )
  }, [workout])

  const SomeWorkout = ({ w }: { w: Workout }) =>
    pipe(
      loading.query,
      B.match(
        () => (
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
                onDelete("Delete Exercise", () => remove(db, item))
              }}
              onEditPress={item => {
                setWorkoutExercise(item)
                navigate("workoutExerciseForm")
              }}
              extraIcon={item =>
                item.notes ? (
                  <MaterialIcons
                    name="sticky-note-2"
                    size={18}
                    color="#000000b3"
                  />
                ) : null
              }
            />
          </View>
        ),
        () => <ActivityIndicator size="large" />
      )
    )

  const onNone = () => {
    fallbackToHome()

    return <></>
  }

  const onSome = (w: Workout) => <SomeWorkout w={w} />

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
