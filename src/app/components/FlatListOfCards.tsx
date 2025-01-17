import { FlatList, FlatListProps, StyleSheet } from "react-native"
import { CardWithActions } from "@/app/components/CardWithActions"

interface FlatListOfCardsProps<T> extends Omit<FlatListProps<T>, "renderItem"> {
  title: (item: T) => string
  subtitle?: (item: T) => string | undefined | null
  actionsDisabled: boolean
  onCardPress: (item: T) => void
  onEditPress: (item: T) => void
  onDeletePress: (item: T) => void
}

export const FlatListOfCards = <T,>({
  title,
  subtitle,
  actionsDisabled,
  onCardPress,
  onEditPress,
  onDeletePress,
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
