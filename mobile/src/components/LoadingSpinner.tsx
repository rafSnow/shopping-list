import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme";

interface LoadingSpinnerProps {
  message?: string;
}

/**
 * Componente de indicador de carregamento
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Carregando...",
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  message: {
    marginTop: spacing.lg,
    fontSize: typography.sizes.lg,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
});
