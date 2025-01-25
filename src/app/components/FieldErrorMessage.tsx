import { FieldError } from "react-hook-form"
import { StyleSheet, Text, View } from "react-native"
import * as O from "fp-ts/Option"
import { pipe } from "fp-ts/function"

interface FieldErrorMessageProps {
  error: FieldError | undefined
}

export const FieldErrorMessage = ({ error }: FieldErrorMessageProps) => {
  const onError = (e: FieldError) => (
    <View>
      <Text style={styles.errorText}>{e.message}</Text>
    </View>
  )

  const onNoError = () => <></>

  return pipe(error, O.fromNullable, O.match(onNoError, onError))
}

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    fontSize: 12
  }
})
