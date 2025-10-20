import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ItemInputProps {
  onAddItem: (name: string) => Promise<void>;
}

export const ItemInput: React.FC<ItemInputProps> = ({ onAddItem }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      Alert.alert("Atenção", "Por favor, digite o nome do item");
      return;
    }

    if (trimmedText.length > 200) {
      Alert.alert(
        "Atenção",
        "O nome do item não pode ter mais de 200 caracteres"
      );
      return;
    }

    setLoading(true);
    try {
      await onAddItem(trimmedText);
      setText(""); // Limpa o campo após adicionar
    } catch (error) {
      Alert.alert("Erro", "Não foi possível adicionar o item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do item..."
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleAdd}
        editable={!loading}
        maxLength={200}
        returnKeyType="done"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleAdd}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Ionicons name="add" size={24} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    width: 48,
    height: 48,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  buttonDisabled: {
    backgroundColor: "#9E9E9E",
  },
});
