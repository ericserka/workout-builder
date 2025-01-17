import { DomainError } from "@/lib/types/errors"
import { Alert } from "react-native"

export const alertDomainError = (error: DomainError) =>
  Alert.alert(error.type, error.message)

export const onDelete = (title: string, onConfirm: () => void) => {
  Alert.alert(title, "Are you sure?", [
    {
      text: "Cancel",
      style: "cancel"
    },
    {
      text: "Delete",
      onPress: () => onConfirm(),
      style: "default"
    }
  ])
}
