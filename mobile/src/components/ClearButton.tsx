import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ClearButtonProps {
  onClear: () => Promise<void>;
  itemCount: number;
}

export const ClearButton: React.FC<ClearButtonProps> = ({
  onClear,
  itemCount,
}) => {
  const [loading, setLoading] = useState(false);

  const handleClear = () => {
    if (itemCount === 0) {
      Alert.alert("Atenção", "A lista já está vazia");
      return;
    }

    Alert.alert(
      "Limpar Lista",
      `Tem certeza que deseja remover todos os ${itemCount} ${itemCount === 1 ? "item" : "itens"}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Limpar",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await onClear();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível limpar a lista");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        itemCount === 0 && styles.buttonDisabled,
        loading && styles.buttonLoading,
      ]}
      onPress={handleClear}
      disabled={loading || itemCount === 0}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <>
          <Ionicons name="trash" size={18} color="#fff" />
          <Text style={styles.buttonText}>Limpar Lista ({itemCount})</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f44336",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    margin: 16,
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonLoading: {
    backgroundColor: "#e57373",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
