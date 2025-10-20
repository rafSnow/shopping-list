import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import {
  ItemInput,
  ItemList,
  ClearButton,
  LoadingSpinner,
} from "../components";
import { useItems } from "../hooks/useItems";

export const HomeScreen: React.FC = () => {
  const { items, loading, error, addNewItem, removeItem, clearList, refresh } =
    useItems();

  // Mostrar erro se houver
  React.useEffect(() => {
    if (error) {
      Alert.alert("Erro", error);
    }
  }, [error]);

  if (loading && items.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🛒 Lista de Compras</Text>
        <Text style={styles.subtitle}>
          {items.length} {items.length === 1 ? "item" : "itens"}
        </Text>
      </View>

      {/* Input */}
      <ItemInput onAddItem={addNewItem} />

      {/* Lista */}
      <ItemList
        items={items}
        onDeleteItem={removeItem}
        onRefresh={refresh}
        refreshing={loading}
      />

      {/* Botão Limpar */}
      {items.length > 0 && (
        <ClearButton onClear={clearList} itemCount={items.length} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
  },
});
