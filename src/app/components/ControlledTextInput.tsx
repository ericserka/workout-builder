import { Control, Controller, FieldValues, Path } from "react-hook-form"
import { StyleSheet, TextInput, TextInputProps, View } from "react-native"
import { FieldErrorMessage } from "@/app/components/FieldErrorMessage"
import { containsError } from "@/app/helpers/form"

interface ControlledTextInputProps<T extends FieldValues>
  extends TextInputProps {
  control: Control<T>
  name: Path<T>
}

export const ControlledTextInput = <T extends FieldValues>({
  control,
  name,
  ...rest
}: ControlledTextInputProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { value, onChange }, fieldState: { error } }) => (
      <View style={styles.inputContainer}>
        <TextInput
          {...rest}
          style={[styles.input, containsError(error) && styles.inputError]}
          onChangeText={onChange}
          value={value}
        />
        <FieldErrorMessage error={error} />
      </View>
    )}
  />
)

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 12
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10
  },
  inputError: {
    borderColor: "red"
  },
  errorText: {
    color: "red",
    fontSize: 12
  }
})
