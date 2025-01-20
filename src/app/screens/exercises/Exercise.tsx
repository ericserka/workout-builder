import { useStore } from "@/app/helpers/store"
import { useWorkoutExercisesDb } from "@/app/hooks/useWorkoutExercisesDb"
import { Exercise } from "@/lib/types/exercise"
import { useSQLiteContext } from "expo-sqlite"
import { pipe } from "fp-ts/function"
import * as O from "fp-ts/Option"
import { useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"

export const ExerciseDetails = () => {
  const { fallbackToHome, exercise } = useStore()

  const SomeExercise = ({ e }: { e: Exercise }) => {
    const db = useSQLiteContext()
    const { latestWeightOfExercise, fetchLatestWeightForExercise } =
      useWorkoutExercisesDb()

    useEffect(() => {
      fetchLatestWeightForExercise(db, e.id)
    }, [])

    const latestWeight = () =>
      pipe(
        latestWeightOfExercise,
        O.match(
          () => "No data",
          w => `${w}kg`
        )
      )

    return (
      <View>
        <Text style={styles.title}>{e.name}</Text>
        <Text style={styles.data}>
          <Text style={styles.field}>Muscle Group: </Text>
          <Text>{e.muscleGroup}</Text>
        </Text>
        <Text style={styles.data}>
          <Text style={styles.field}>Description: </Text>
          <Text>{e.description}</Text>
        </Text>
        <Text style={styles.data}>
          <Text style={styles.field}>Latest Weight: </Text>
          <Text>{latestWeight()}</Text>
        </Text>
      </View>
    )
  }

  const onNone = () => {
    fallbackToHome()

    return <></>
  }

  const onSome = (e: Exercise) => <SomeExercise e={e} />

  return pipe(exercise, O.match(onNone, onSome))
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
