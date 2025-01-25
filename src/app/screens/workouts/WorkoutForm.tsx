import { ControlledTextInput } from "@/app/components/ControlledTextInput"
import { CustomButton } from "@/app/components/CustomButton"
import {
  createWorkoutSchema,
  updateWorkoutSchema,
  CreateWorkoutInput,
  UpdateWorkoutInput
} from "@/lib/types/workout"
import { useForm } from "react-hook-form"
import { StyleSheet, Text, View } from "react-native"
import { zodResolver } from "@hookform/resolvers/zod"
import * as O from "fp-ts/Option"
import { useStore } from "@/app/helpers/store"
import { useWorkoutsDb } from "@/app/hooks/useWorkoutsDb"
import { useSQLiteContext } from "expo-sqlite"
import { pipe } from "fp-ts/function"
import { WorkoutPlan } from "@/lib/types/workoutPlan"
import { FormProps } from "@/app/types"

export const WorkoutForm = () => {
  const { workout, fallbackToHome, workoutPlan } = useStore()

  const Form = ({ wp }: { wp: WorkoutPlan }) => {
    const db = useSQLiteContext()

    const { create, loading, update } = useWorkoutsDb()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isUpdate = O.isSome(workout)

    type Form<T extends boolean> = T extends true
      ? UpdateWorkoutInput
      : CreateWorkoutInput
    type FormType = Form<typeof isUpdate>

    const formProps: FormProps<FormType> = pipe(
      workout,
      O.match(
        () => {
          const defaultValues: FormProps<FormType>["defaultValues"] = {
            workoutPlanId: wp.id
          }

          return {
            resolver: zodResolver(createWorkoutSchema),
            defaultValues,
            onSubmit: (data: FormType) =>
              create(db, data as CreateWorkoutInput),
            title: `Create new workout for ${wp.name}`
          }
        },
        w => ({
          resolver: zodResolver(updateWorkoutSchema),
          defaultValues: {
            id: w.id,
            name: w.name
          },
          onSubmit: (data: FormType) => update(db, data as UpdateWorkoutInput),
          title: `Update Workout ${w.name}`
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
            placeholder="Name"
            control={control}
            name="name"
            onBlur={() => trigger("name")}
          />
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

  const onNone = () => {
    fallbackToHome()

    return <></>
  }

  const onSome = (wp: WorkoutPlan) => <Form wp={wp} />

  return pipe(workoutPlan, O.match(onNone, onSome))
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12
  }
})
