import React from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  colors,
  gradients,
  spacing,
  borderRadius,
  typography,
  shadows,
} from "../theme";

interface ClearButtonProps {
  onClear: () => Promise<void>;
  itemCount: number;
}

/**
 * Componente de botão para limpar toda a lista
 */
export const ClearButton: React.FC<ClearButtonProps> = ({
  onClear,
  itemCount,
}) => {
  const handlePress = () => {
    if (itemCount === 0) {
      Alert.alert("Info", "A lista já está vazia");
      return;
    }

    Alert.alert(
      "Confirmar",
      `Deseja limpar toda a lista? (${itemCount} ${
        itemCount === 1 ? "item" : "itens"
      })`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Limpar",
          style: "destructive",
          onPress: async () => {
            try {
              await onClear();
            } catch (error) {
              console.error("Erro ao limpar lista:", error);
              Alert.alert("Erro", "Não foi possível limpar a lista");
            }
          },
        },
      ]
    );
  };

  if (itemCount === 0) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={gradients.danger}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.icon}>🧹</Text>
        <Text style={styles.text}>Limpar Lista</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: spacing.lg,
    marginTop: 0,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    ...shadows.large,
  },
  gradient: {
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: typography.sizes.xl,
    marginRight: spacing.sm,
  },
  text: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
});
