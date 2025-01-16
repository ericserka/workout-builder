import { Control, Controller, FieldValues, Path } from "react-hook-form"
import { StyleSheet, Text, Switch, SwitchProps, View } from "react-native"

interface ControlledSwitchInputProps<T extends FieldValues>
  extends SwitchProps {
  control: Control<T>
  name: Path<T>
}

export const ControlledSwitchInput = <T extends FieldValues>({
  control,
  name,
  ...rest
}: ControlledSwitchInputProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { value, onChange }, fieldState: { error } }) => (
      <View style={styles.inputContainer}>
        <Switch {...rest} onValueChange={onChange} value={value} />
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
  errorText: {
    color: "red",
    fontSize: 12
  }
})
