import React from "react";
import { FlatList, View, Text, StyleSheet, RefreshControl } from "react-native";
import { ItemCard } from "./ItemCard";
import type { Item } from "../types/Item";

interface ItemListProps {
  items: Item[];
  onDeleteItem: (id: string) => Promise<void>;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export const ItemList: React.FC<ItemListProps> = ({
  items,
  onDeleteItem,
  onRefresh,
  refreshing = false,
}) => {
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>📝</Text>
        <Text style={styles.emptyTitle}>Lista vazia</Text>
        <Text style={styles.emptySubtitle}>
          Adicione itens conforme consumir durante a semana
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ItemCard item={item} onDelete={onDeleteItem} />
      )}
      contentContainerStyle={styles.listContent}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4CAF50"]}
          />
        ) : undefined
      }
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
