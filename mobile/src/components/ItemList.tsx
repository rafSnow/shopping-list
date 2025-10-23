import React from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import { ItemCard } from "./ItemCard";
import type { Item } from "../types/Item";
import { colors, spacing, typography } from "../theme";

interface ItemListProps {
  items: Item[];
  onTogglePurchased: (item: Item) => Promise<void>;
  onDeleteItem: (itemId: string, itemName: string) => Promise<void>;
}

/**
 * Componente de lista de itens com FlatList
 */
export const ItemList: React.FC<ItemListProps> = ({
  items,
  onTogglePurchased,
  onDeleteItem,
}) => {
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>�</Text>
        <Text style={styles.emptyTitle}>Lista vazia</Text>
        <Text style={styles.emptySubtitle}>
          Comece adicionando seus primeiros itens para comprar
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ItemCard
          item={item}
          onTogglePurchased={onTogglePurchased}
          onDelete={onDeleteItem}
        />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: spacing.lg,
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    textAlign: "center",
    paddingHorizontal: spacing.xl,
    lineHeight: 22,
  },
});
