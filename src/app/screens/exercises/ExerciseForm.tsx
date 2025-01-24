import { ControlledTextInput } from "@/app/components/ControlledTextInput"
import { CustomButton } from "@/app/components/CustomButton"
import {
  CreateExerciseCodec,
  UpdateExerciseCodec,
  CreateExerciseInput,
  UpdateExerciseInput
} from "@/lib/types/exercise"
import { useForm } from "react-hook-form"
import { StyleSheet, Text, View } from "react-native"
import { ioTsResolver } from "@hookform/resolvers/io-ts"
import * as O from "fp-ts/Option"
import { useStore } from "@/app/helpers/store"
import { useExercisesDb } from "@/app/hooks/useExercisesDb"
import { useSQLiteContext } from "expo-sqlite"
import { pipe } from "fp-ts/function"
import { FormProps } from "@/app/types"
import { ControlledPickerInput } from "@/app/components/ControlledPickerInput"

export const ExerciseForm = () => {
  const { exercise } = useStore()

  const db = useSQLiteContext()

  const { create, loading, update } = useExercisesDb()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isUpdate = O.isSome(exercise)

  type Form<T extends boolean> = T extends true
    ? UpdateExerciseInput
    : CreateExerciseInput
  type FormType = Form<typeof isUpdate>

  const formProps: FormProps<FormType> = pipe(
    exercise,
    O.match(
      () => {
        const defaultValues: FormProps<FormType>["defaultValues"] = {
          muscleGroup: "abs"
        }

        return {
          resolver: ioTsResolver(CreateExerciseCodec),
          defaultValues,
          onSubmit: (data: FormType) => create(db, data as CreateExerciseInput),
          title: `Create new exercise`
        }
      },
      e => ({
        resolver: ioTsResolver(UpdateExerciseCodec),
        defaultValues: {
          id: e.id,
          name: e.name,
          muscleGroup: e.muscleGroup,
          description: e.description ?? undefined
        },
        onSubmit: (data: FormType) => update(db, data as UpdateExerciseInput),
        title: `Update ${e.name}`
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
        <ControlledPickerInput
          control={control}
          name="muscleGroup"
          items={[
            { label: "Abs", value: "abs" },
            { label: "Back", value: "back" },
            { label: "Biceps", value: "biceps" },
            { label: "Calves", value: "calves" },
            { label: "Chest", value: "chest" },
            { label: "Forearms", value: "forearms" },
            { label: "Glutes", value: "glutes" },
            { label: "Legs", value: "legs" },
            { label: "Shoulders", value: "shoulders" },
            { label: "Triceps", value: "triceps" }
          ]}
          label="Muscle Group"
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

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12
  }
})
