import { ControlledTextInput } from "@/app/components/ControlledTextInput"
import { CustomButton } from "@/app/components/CustomButton"
import {
  CreateWorkoutPlanCodec,
  UpdateWorkoutPlanCodec,
  CreateWorkoutPlanInput,
  UpdateWorkoutPlanInput
} from "@/lib/types/workoutPlan"
import { Resolver, useForm } from "react-hook-form"
import { StyleSheet, Text, View } from "react-native"
import { ioTsResolver } from "@hookform/resolvers/io-ts"
import * as O from "fp-ts/Option"
import { useStore } from "@/app/helpers/store"
import { useWorkoutPlansDb } from "@/app/hooks/useWorkoutPlansDb"
import { useEffect, useState } from "react"
import { useSQLiteContext } from "expo-sqlite"
import { ControlledSwitchInput } from "@/app/components/ControlledSwitchInput"

export const WorkoutPlanForm = () => {
  const { workoutPlan } = useStore()

  const db = useSQLiteContext()

  const { create, loading, update } = useWorkoutPlansDb()

  const isUpdate = O.isSome(workoutPlan)

  type Form<T extends boolean> = T extends true
    ? UpdateWorkoutPlanInput
    : CreateWorkoutPlanInput
  type FormType = Form<typeof isUpdate>

  const resolver = (
    isUpdate
      ? ioTsResolver(UpdateWorkoutPlanCodec)
      : ioTsResolver(CreateWorkoutPlanCodec)
  ) as Resolver<FormType>

  const defaultValues = isUpdate
    ? {
        id: workoutPlan.value.id,
        name: workoutPlan.value.name,
        description: workoutPlan.value.description ?? undefined,
        isActive: workoutPlan.value.isActive
      }
    : {}

  const {
    control,
    trigger,
    handleSubmit,
    formState: { isDirty, isValid }
  } = useForm<FormType>({
    defaultValues,
    resolver
  })

  const onSubmit = (data: FormType) =>
    isUpdate
      ? update(db, data as UpdateWorkoutPlanInput)
      : create(db, data as CreateWorkoutPlanInput)

  const title = isUpdate
    ? `Update Workout ${defaultValues.name}`
    : "Create new workout plan"

  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    setFormLoading(isUpdate ? loading.update : loading.create)
  }, [loading])

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <View>
        <ControlledTextInput
          placeholder="Name"
          control={control}
          name="name"
          onBlur={() => trigger("name")}
        />
        <ControlledTextInput
          placeholder="Description"
          control={control}
          name="description"
          onBlur={() => trigger("description")}
        />
        {isUpdate && (
          <View style={styles.switch}>
            <Text>Active?</Text>
            <ControlledSwitchInput control={control} name="isActive" />
          </View>
        )}
      </View>
      <CustomButton
        title="Submit"
        disabled={!isDirty || !isValid || formLoading}
        loading={formLoading}
        onPress={handleSubmit(onSubmit)}
      />
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
  switch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12
  }
})
