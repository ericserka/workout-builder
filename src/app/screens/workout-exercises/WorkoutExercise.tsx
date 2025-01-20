import { useStore } from "@/app/helpers/store"
import { WorkoutExercise } from "@/lib/types/workoutExercise"
import { pipe } from "fp-ts/function"
import * as O from "fp-ts/Option"
import { StyleSheet, Text, View } from "react-native"

export const WorkoutExerciseDetails = () => {
  const { fallbackToHome, workoutExercise } = useStore()

  const SomeWorkoutExercise = ({ we }: { we: WorkoutExercise }) => (
    <View>
      <Text style={styles.title}>{we.exerciseName}</Text>
      <Text style={styles.data}>
        <Text style={styles.field}>Muscle Group: </Text>
        <Text>{we.muscleGroup}</Text>
      </Text>
      <Text style={styles.data}>
        <Text style={styles.field}>Weight (kg): </Text>
        <Text>{we.weight ?? "No data"}</Text>
      </Text>
      <Text style={styles.data}>
        <Text style={styles.field}>Reps: </Text>
        <Text>{we.reps}</Text>
      </Text>
      <Text style={styles.data}>
        <Text style={styles.field}>Sets: </Text>
        <Text>{we.sets}</Text>
      </Text>
      <Text style={styles.data}>
        <Text style={styles.field}>Notes: </Text>
        <Text>{we.notes}</Text>
      </Text>
    </View>
  )

  const onNone = () => {
    fallbackToHome()

    return <></>
  }

  const onSome = (we: WorkoutExercise) => <SomeWorkoutExercise we={we} />

  return pipe(workoutExercise, O.match(onNone, onSome))
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12
  },
  data: {
    fontSize: 24
  },
  field: {
    fontWeight: "bold"
  }
})
