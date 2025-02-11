import { Text, View, StyleSheet, ActivityIndicator } from "react-native"
import { useWorkoutPlansDb } from "@/app/hooks/useWorkoutPlansDb"
import { useStore } from "@/app/helpers/store"
import { useEffect, useState } from "react"
import { useSQLiteContext } from "expo-sqlite"
import { WorkoutPlan } from "@/lib/types/workoutPlan"
import { CustomButton } from "@/app/components/CustomButton"
import { onDelete } from "@/app/helpers/alert"
import { FlatListOfCards } from "@/app/components/FlatListOfCards"
import { pipe } from "fp-ts/function"
import * as B from "fp-ts/boolean"

export const WorkoutPlans = () => {
  const { list, loading, active, remove, inactive } = useWorkoutPlansDb()
  const { navigate, setWorkoutPlan, clearWorkoutPlan } = useStore()
  const db = useSQLiteContext()
  const [showInactive, setShowInactive] = useState(false)

  useEffect(() => {
    list(db)
  }, [])

  const toggleShowInactive = () => {
    setShowInactive(prev => !prev)
  }

  const WorkoutPlanFlatList = ({ data }: { data: WorkoutPlan[] }) => (
    <FlatListOfCards
      data={data}
      keyExtractor={item => item.id.toString()}
      title={item => item.name}
      subtitle={item => item.description}
      actionsDisabled={loading.mutation}
      onCardPress={item => {
        setWorkoutPlan(item)
        navigate("workoutPlanWorkouts")
      }}
      onDeletePress={item => {
        onDelete("Delete Workout Plan", () => remove(db, item.id))
      }}
      onEditPress={item => {
        setWorkoutPlan(item)
        navigate("workoutPlanForm")
      }}
    />
  )

  return pipe(
    loading.query,
    B.match(
      () => (
        <View>
          <CustomButton
            title={"Create new workout plan"}
            disabled={loading.mutation}
            onPress={() => {
              clearWorkoutPlan()
              navigate("workoutPlanForm")
            }}
          />

          <View style={styles.showInactiveBtn}>
            <CustomButton
              title={showInactive ? "Show active" : "Show Inactive"}
              disabled={loading.query}
              loading={loading.query}
              onPress={toggleShowInactive}
            />
          </View>

          {!showInactive && (
            <View>
              <Text style={styles.title}>Active Workout Plans</Text>
              <WorkoutPlanFlatList data={active} />
            </View>
          )}

          {showInactive && (
            <View>
              <Text style={styles.title}>Inactive Workout Plans</Text>
              <WorkoutPlanFlatList data={inactive} />
            </View>
          )}
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
  },
  showInactiveBtn: {
    marginTop: 12
  }
})
