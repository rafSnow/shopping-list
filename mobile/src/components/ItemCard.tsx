import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { Item } from "../types/Item";
import {
  colors,
  gradients,
  spacing,
  borderRadius,
  typography,
  shadows,
} from "../theme";

interface ItemCardProps {
  item: Item;
  onTogglePurchased: (item: Item) => Promise<void>;
  onDelete: (itemId: string, itemName: string) => Promise<void>;
}

/**
 * Componente de card individual para cada item da lista
 */
export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onTogglePurchased,
  onDelete,
}) => {
  return (
    <View
      style={[styles.container, item.purchased && styles.containerPurchased]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={() => onTogglePurchased(item)}
        activeOpacity={0.8}
      >
        <View style={styles.checkboxContainer}>
          {item.purchased ? (
            <LinearGradient
              colors={gradients.success}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.checkbox}
            >
              <Text style={styles.checkmark}>✓</Text>
            </LinearGradient>
          ) : (
            <View style={styles.checkboxEmpty} />
          )}
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.name, item.purchased && styles.namePurchased]}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(item.id, item.name)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={gradients.danger}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.deleteGradient}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.surfaceLight,
    ...shadows.medium,
  },
  containerPurchased: {
    opacity: 0.6,
    borderColor: colors.success,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxContainer: {
    marginRight: spacing.md,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxEmpty: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.textMuted,
  },
  checkmark: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  namePurchased: {
    textDecorationLine: "line-through",
    color: colors.textMuted,
  },
  deleteButton: {
    marginLeft: spacing.md,
    borderRadius: borderRadius.sm,
    overflow: "hidden",
  },
  deleteGradient: {
    padding: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIcon: {
    fontSize: 20,
  },
});
