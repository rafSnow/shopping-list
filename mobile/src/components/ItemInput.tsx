import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  colors,
  gradients,
  spacing,
  borderRadius,
  typography,
  shadows,
} from "../theme";

interface ItemInputProps {
  onAddItem: (name: string) => Promise<void>;
  loading?: boolean;
}

/**
 * Componente de input para adicionar novos itens à lista
 */
export const ItemInput: React.FC<ItemInputProps> = ({
  onAddItem,
  loading = false,
}) => {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      Alert.alert("Atenção", "Digite o nome do item");
      return;
    }

    if (trimmedText.length > 200) {
      Alert.alert(
        "Atenção",
        "O nome do item não pode ter mais de 200 caracteres"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddItem(trimmedText);
      setText(""); // Limpa o campo após adicionar
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      Alert.alert("Erro", "Não foi possível adicionar o item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Adicione um item..."
          placeholderTextColor={colors.textMuted}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSubmit}
          editable={!isLoading}
          maxLength={200}
          returnKeyType="done"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isLoading ? ["#8E8EA9", "#8E8EA9"] : gradients.success}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.textPrimary} size="small" />
          ) : (
            <Text style={styles.buttonText}>+</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.surfaceLight,
    ...shadows.small,
  },
  input: {
    height: 56,
    paddingHorizontal: spacing.lg,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    ...shadows.medium,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: typography.weights.bold,
    lineHeight: 32,
  },
});
