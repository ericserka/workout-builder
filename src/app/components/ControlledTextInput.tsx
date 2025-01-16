import { Control, Controller, FieldValues, Path } from "react-hook-form"
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native"

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
          style={[styles.input, error?.message && styles.inputError]}
          onChangeText={onChange}
          value={value}
        />
        {error?.message && (
          <Text style={styles.errorText}>{error.message}</Text>
        )}
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
