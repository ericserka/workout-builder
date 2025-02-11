import { CustomButton } from "@/app/components/CustomButton"
import { FlatListOfCards } from "@/app/components/FlatListOfCards"
import { onDelete } from "@/app/helpers/alert"
import { useStore } from "@/app/helpers/store"
import { useExercisesDb } from "@/app/hooks/useExercisesDb"
import { useSQLiteContext } from "expo-sqlite"
import { useEffect } from "react"
import { ActivityIndicator, StyleSheet, Text, View } from "react-native"
import { pipe } from "fp-ts/function"
import * as B from "fp-ts/boolean"

export const Exercises = () => {
  const { navigate, setExercise, clearExercise } = useStore()
  const { list, loading, exercises, remove } = useExercisesDb()
  const db = useSQLiteContext()

  useEffect(() => {
    list(db)
  }, [])

  return pipe(
    loading.query,
    B.match(
      () => (
        <View>
          <CustomButton
            title={"Create new exercise"}
            disabled={loading.mutation}
            onPress={() => {
              clearExercise()
              navigate("exerciseForm")
            }}
          />
          <Text style={styles.title}>{"Exercises"}</Text>
          <FlatListOfCards
            data={exercises}
            keyExtractor={item => item.id.toString()}
            title={item => `${item.muscleGroup} - ${item.name}`}
            subtitle={item => item.description}
            actionsDisabled={loading.mutation}
            onCardPress={item => {
              setExercise(item)
              navigate("exercise")
            }}
            onDeletePress={item => {
              onDelete("Delete Exercise", () => remove(db, item.id))
            }}
            onEditPress={item => {
              setExercise(item)
              navigate("exerciseForm")
            }}
          />
        </View>
      ),
      () => <ActivityIndicator size="large" />
    )
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12
  }
})
