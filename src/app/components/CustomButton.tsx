import {
  ActivityIndicator,
  Pressable,
  Text,
  PressableProps,
  StyleSheet
} from "react-native"

interface CustomButtonProps extends PressableProps {
  title: string
  loading?: boolean
  backgroundColor?: string
}

export const CustomButton = ({
  loading = false,
  title,
  disabled,
  backgroundColor = "blue",
  ...rest
}: CustomButtonProps) => (
  <Pressable
    style={[styles.pressable, { backgroundColor }, disabled && styles.disabled]}
    disabled={disabled}
    {...rest}
  >
    {loading ? (
      <ActivityIndicator size="small" color="white" />
    ) : (
      <Text style={styles.title}>{title}</Text>
    )}
  </Pressable>
)

const styles = StyleSheet.create({
  pressable: {
    height: 40,
    padding: 10,
    alignItems: "center"
  },
  title: {
    color: "white",
    fontWeight: "bold"
  },
  disabled: {
    opacity: 0.5
  }
})
