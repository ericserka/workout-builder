import { FieldError } from "react-hook-form"
import { StyleSheet, Text, View } from "react-native"
import { parseErrors } from "@/app/helpers/form"
import * as A from "fp-ts/Array"
import { pipe } from "fp-ts/function"

interface FieldErrorMessageProps {
  error: FieldError | undefined
}

export const FieldErrorMessage = ({ error }: FieldErrorMessageProps) => {
  if (error) {
    return (
      <View>
        {pipe(
          error,
          parseErrors,
          A.map(e => (
            <Text key={`${e.type}-${e.message}`} style={styles.errorText}>
              {e.message}
            </Text>
          ))
        )}
      </View>
    )
  }

  return <></>
}

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    fontSize: 12
  }
})
