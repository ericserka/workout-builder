import { FlatList, FlatListProps, StyleSheet } from "react-native"
import { CardWithActions } from "@/app/components/CardWithActions"
import React from "react"

interface FlatListOfCardsProps<T> extends Omit<FlatListProps<T>, "renderItem"> {
  title: (item: T) => string
  subtitle?: (item: T) => string | undefined | null
  actionsDisabled: boolean
  onCardPress: (item: T) => void
  onEditPress: (item: T) => void
  onDeletePress: (item: T) => void
  extraIcon?: (item: T) => React.JSX.Element | null
}

export const FlatListOfCards = <T,>({
  title,
  subtitle,
  actionsDisabled,
  onCardPress,
  onEditPress,
  onDeletePress,
  extraIcon,
  ...rest
}: FlatListOfCardsProps<T>) => (
  <FlatList
    {...rest}
    style={styles.flatList}
    renderItem={({ item }) => (
      <CardWithActions
        item={item}
        title={title}
        subtitle={subtitle}
        actionsDisabled={actionsDisabled}
        onCardPress={onCardPress}
        onEditPress={onEditPress}
        onDeletePress={onDeletePress}
        extraIcon={extraIcon}
      />
    )}
    contentContainerStyle={{ gap: 12 }}
  />
)

const styles = StyleSheet.create({
  flatList: {
    height: "80%"
  }
})
