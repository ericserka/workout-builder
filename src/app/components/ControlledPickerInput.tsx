import {
  Picker,
  PickerItemProps,
  PickerProps
} from "@react-native-picker/picker"
import { Control, Controller, FieldValues, Path } from "react-hook-form"
import { StyleSheet, Text, View } from "react-native"

interface ControlledPickerProps<T extends FieldValues> extends PickerProps {
  control: Control<T>
  name: Path<T>
  items: PickerItemProps[]
  label: string
}

export const ControlledPickerInput = <T extends FieldValues>({
  control,
  name,
  items,
  label,
  ...rest
}: ControlledPickerProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { value, onChange }, fieldState: { error } }) => (
      <View style={styles.inputContainer}>
        <Text>{label}</Text>
        <Picker {...rest} selectedValue={value} onValueChange={onChange}>
          {items.map(item => (
            <Picker.Item {...item} key={item.value} />
          ))}
        </Picker>
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
  inputError: {
    borderColor: "red"
  },
  errorText: {
    color: "red",
    fontSize: 12
  }
})
