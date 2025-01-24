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
import { useSQLiteContext } from "expo-sqlite"
import { ControlledSwitchInput } from "@/app/components/ControlledSwitchInput"
import { pipe } from "fp-ts/function"
import { FormProps } from "@/app/types"

export const WorkoutPlanForm = () => {
  const { workoutPlan } = useStore()

  const db = useSQLiteContext()

  const { create, loading, update } = useWorkoutPlansDb()

  const isUpdate = O.isSome(workoutPlan)

  type Form<T extends boolean> = T extends true
    ? UpdateWorkoutPlanInput
    : CreateWorkoutPlanInput
  type FormType = Form<typeof isUpdate>

  const formProps: FormProps<FormType> = pipe(
    workoutPlan,
    O.match(
      () => ({
        resolver: ioTsResolver(CreateWorkoutPlanCodec) as Resolver<FormType>,
        defaultValues: {},
        onSubmit: (data: FormType) =>
          create(db, data as CreateWorkoutPlanInput),
        title: "Create new workout plan"
      }),
      wp => ({
        resolver: ioTsResolver(UpdateWorkoutPlanCodec) as Resolver<FormType>,
        defaultValues: {
          id: wp.id,
          name: wp.name,
          description: wp.description ?? undefined,
          isActive: wp.isActive
        },
        onSubmit: (data: FormType) =>
          update(db, data as UpdateWorkoutPlanInput),
        title: `Update Workout Plan ${wp.name}`
      })
    )
  )

  const { resolver, defaultValues, onSubmit, title } = formProps

  const {
    control,
    trigger,
    handleSubmit,
    formState: { isDirty, isValid }
  } = useForm<FormType>({
    defaultValues,
    resolver
  })

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <View>
        <ControlledTextInput
          label="Name"
          placeholder="Name"
          control={control}
          name="name"
          onBlur={() => trigger("name")}
        />
        <ControlledTextInput
          label="Description"
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
        disabled={!isDirty || !isValid || loading.mutation}
        loading={loading.mutation}
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
