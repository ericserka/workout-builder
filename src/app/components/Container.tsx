import { SQLiteProvider } from "expo-sqlite"
import { StatusBar } from "expo-status-bar"
import { PropsWithChildren, Suspense } from "react"
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native"
import { initializeDb } from "@/lib/db/initializeDb"
import { MaterialIcons } from "@expo/vector-icons"
import { useStore } from "@/app/helpers/store"

export const Container = ({ children }: PropsWithChildren<object>) => {
  const databaseName = "workout-builder.db"
  const { navigateBack } = useStore()

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName={databaseName}
        useSuspense
        onInit={initializeDb}
      >
        <View style={styles.container}>
          <TouchableOpacity onPress={navigateBack}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          {children}
          <StatusBar style="auto" />
        </View>
      </SQLiteProvider>
    </Suspense>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginHorizontal: 8
  }
})
