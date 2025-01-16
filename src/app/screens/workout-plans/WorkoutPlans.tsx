import {
  Text,
  View,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert
} from "react-native"
import { useWorkoutPlansDb } from "@/app/hooks/useWorkoutPlansDb"
import { useStore } from "@/app/helpers/store"
import { useEffect, useState } from "react"
import { useSQLiteContext } from "expo-sqlite"
import { WorkoutPlan } from "@/lib/types/workoutPlan"
import { CustomButton } from "@/app/components/CustomButton"

export const WorkoutPlans = () => {
  const { list, loading, active, remove, inactive } = useWorkoutPlansDb()
  const { navigate, setWorkoutPlan, clearWorkoutPlan } = useStore()
  const db = useSQLiteContext()
  const [showInactive, setShowInactive] = useState(false)

  useEffect(() => {
    list(db)
  }, [])

  const onDelete = (id: number) => {
    Alert.alert("Delete Workout Plan", "Are you sure?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Delete",
        onPress: () => remove(db, id),
        style: "default"
      }
    ])
  }

  const toggleShowInactive = () => {
    setShowInactive(prev => !prev)
  }

  const WorkoutPlanFlatList = ({ data }: { data: WorkoutPlan[] }) => (
    <FlatList
      style={{ height: "80%" }}
      data={data}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <Pressable
          style={styles.workoutPlan}
          onPress={() => {
            setWorkoutPlan(item)
            navigate("workoutPlan")
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.workoutPlanName}>{item.name}</Text>
            <Text>{item.description}</Text>
          </View>

          <CustomButton
            title="Edit"
            disabled={loading.delete}
            onPress={() => {
              setWorkoutPlan(item)
              navigate("workoutPlanForm")
            }}
          />

          <CustomButton
            title="Delete"
            disabled={loading.delete}
            onPress={() => onDelete(item.id)}
            backgroundColor="red"
          />
        </Pressable>
      )}
      contentContainerStyle={{ gap: 12 }}
    />
  )

  if (loading.list) {
    return <ActivityIndicator size="large" />
  }

  return (
    <View>
      <CustomButton
        title={"Create new workout plan"}
        disabled={loading.delete}
        onPress={() => {
          clearWorkoutPlan()
          navigate("workoutPlanForm")
        }}
      />

      <View style={styles.showInactiveBtn}>
        <CustomButton
          title={showInactive ? "Show active" : "Show Inactive"}
          disabled={loading.list}
          loading={loading.list}
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
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12
  },
  workoutPlan: {
    backgroundColor: "#CECECE",
    padding: 24,
    borderRadius: 5,
    gap: 12,
    flexDirection: "row"
  },
  workoutPlanName: {
    fontSize: 20,
    fontWeight: "bold"
  },
  showInactiveBtn: {
    marginTop: 12
  }
})
