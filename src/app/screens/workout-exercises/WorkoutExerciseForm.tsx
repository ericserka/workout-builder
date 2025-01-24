import { ControlledTextInput } from "@/app/components/ControlledTextInput"
import { CustomButton } from "@/app/components/CustomButton"
import {
  CreateWorkoutExerciseCodec,
  UpdateWorkoutExerciseCodec,
  CreateWorkoutExerciseInput,
  UpdateWorkoutExerciseInput
} from "@/lib/types/workoutExercise"
import { Workout } from "@/lib/types/workout"
import { useForm } from "react-hook-form"
import { StyleSheet, Text, View } from "react-native"
import { ioTsResolver } from "@hookform/resolvers/io-ts"
import * as O from "fp-ts/Option"
import * as A from "fp-ts/Array"
import { useStore } from "@/app/helpers/store"
import { useWorkoutExercisesDb } from "@/app/hooks/useWorkoutExercisesDb"
import { useSQLiteContext } from "expo-sqlite"
import { pipe } from "fp-ts/function"
import { FormProps } from "@/app/types"
import { useEffect } from "react"
import { ControlledPickerInput } from "@/app/components/ControlledPickerInput"
import { useExercisesDb } from "@/app/hooks/useExercisesDb"

export const WorkoutExerciseForm = () => {
  const { workout, fallbackToHome, workoutExercise, navigate } = useStore()

  const Form = ({ w }: { w: Workout }) => {
    const db = useSQLiteContext()

    const {
      create,
      loading: workoutExercisesLoading,
      update
    } = useWorkoutExercisesDb()

    const { list: listExercises, exercises } = useExercisesDb()

    const isCreate = O.isNone(workoutExercise)

    type Form<T extends boolean> = T extends true
      ? CreateWorkoutExerciseInput
      : UpdateWorkoutExerciseInput
    type FormType = Form<typeof isCreate>

    const formProps: FormProps<FormType> = pipe(
      workoutExercise,
      O.match(
        () => {
          const defaultValues: FormProps<FormType>["defaultValues"] = {
            workoutId: w.id
          }

          return {
            resolver: ioTsResolver(CreateWorkoutExerciseCodec),
            defaultValues,
            onSubmit: (data: FormType) =>
              create(db, data as CreateWorkoutExerciseInput),
            title: `Create new exercise for ${w.name} workout`
          }
        },
        we => ({
          resolver: ioTsResolver(UpdateWorkoutExerciseCodec),
          defaultValues: {
            id: we.id,
            sets: `${we.sets}`,
            reps: `${we.reps}`,
            weight: we.weight ? `${we.weight}` : undefined,
            notes: we.notes ?? undefined
          },
          onSubmit: (data: FormType) =>
            update(db, data as UpdateWorkoutExerciseInput),
          title: `Update ${we.exerciseName}`
        })
      )
    )

    const { resolver, defaultValues, onSubmit, title } = formProps

    const {
      control,
      trigger,
      handleSubmit,
      setValue,
      formState: { isDirty, isValid }
    } = useForm<FormType>({
      defaultValues,
      resolver
    })

    useEffect(() => {
      if (isCreate) {
        listExercises(db)
      }
    }, [])

    useEffect(() => {
      pipe(
        exercises,
        A.head,
        O.match(
          () => { },
          e => {
            if (isCreate) {
              setValue("exerciseId", e.id)
            }
          }
        )
      )
    }, [exercises])

    return (
      <View>
        <Text style={styles.title}>{title}</Text>
        {isCreate && (
          <CustomButton
            title="Press here to manage exercises"
            disabled={workoutExercisesLoading.mutation}
            onPress={() => navigate("exercises")}
          />
        )}
        <View style={styles.form}>
          {isCreate && (
            <ControlledPickerInput
              control={control}
              name="exerciseId"
              items={exercises.map(e => ({
                label: `${e.muscleGroup} - ${e.name}`,
                value: e.id
              }))}
              label="Exercise"
            />
          )}
          <ControlledTextInput
            label="Sets"
            placeholder="Sets"
            control={control}
            name="sets"
            onBlur={() => trigger("sets")}
            keyboardType="number-pad"
          />
          <ControlledTextInput
            label="Reps"
            placeholder="Reps"
            control={control}
            name="reps"
            onBlur={() => trigger("reps")}
            keyboardType="number-pad"
          />
          <ControlledTextInput
            label="Weight"
            placeholder="Weight"
            control={control}
            name="weight"
            onBlur={() => trigger("weight")}
            keyboardType="number-pad"
          />
          <ControlledTextInput
            label="Notes"
            placeholder="Notes"
            control={control}
            name="notes"
            onBlur={() => trigger("notes")}
          />
        </View>
        <CustomButton
          title="Submit"
          disabled={!isDirty || !isValid || workoutExercisesLoading.mutation}
          loading={workoutExercisesLoading.mutation}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    )
  }

  const onNone = () => {
    fallbackToHome()

    return <></>
  }

  const onSome = (w: Workout) => <Form w={w} />

  return pipe(workout, O.match(onNone, onSome))
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12
  },
  form: {
    marginTop: 12
  }
})
