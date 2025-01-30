import { Pressable, StyleSheet, Text, View } from "react-native"
import { CustomButton } from "@/app/components/CustomButton"
import React from "react"

interface CardWithActionsProps<T> {
  title: (item: T) => string
  subtitle?: (item: T) => string | undefined | null
  actionsDisabled: boolean
  item: T
  onCardPress: (item: T) => void
  onEditPress: (item: T) => void
  onDeletePress: (item: T) => void
  extraIcon?: (item: T) => React.JSX.Element | null
}

export const CardWithActions = <T,>({
  title,
  subtitle,
  item,
  actionsDisabled,
  onCardPress,
  onEditPress,
  onDeletePress,
  extraIcon
}: CardWithActionsProps<T>) => (
  <Pressable
    style={styles.card}
    onPress={() => {
      onCardPress(item)
    }}
  >
    <View style={styles.cardInfo}>
      <View style={styles.titleWithIcon}>
        <Text style={styles.cardTitle}>{title(item)}</Text>
        {extraIcon && extraIcon(item)}
      </View>
      {subtitle && <Text>{subtitle(item)}</Text>}
    </View>

    <CustomButton
      title="Edit"
      disabled={actionsDisabled}
      onPress={() => {
        onEditPress(item)
      }}
    />

    <CustomButton
      title="Delete"
      disabled={actionsDisabled}
      onPress={() => {
        onDeletePress(item)
      }}
      backgroundColor="red"
    />
  </Pressable>
)

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#CECECE",
    padding: 24,
    borderRadius: 5,
    gap: 12,
    flexDirection: "row"
  },
  cardInfo: {
    flex: 1
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold"
  },
  titleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  }
})
