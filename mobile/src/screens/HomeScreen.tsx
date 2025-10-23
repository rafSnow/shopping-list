import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import {
  colors,
  gradients,
  spacing,
  borderRadius,
  typography,
  shadows,
} from "../theme";
import {
  ItemInput,
  ItemList,
  ClearButton,
  LoadingSpinner,
} from "../components";
import { useNotifications } from "../hooks/useNotifications";
import {
  listenToItems,
  addItem,
  togglePurchased,
  deleteItem,
  clearAllItems,
  Item,
} from "../services/firebase";

// Configurar comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Tela principal do aplicativo de lista de compras
 */
export const HomeScreen: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(true);

  // Hook de notificações
  const {
    hasPermission,
    requestPermissions,
    notifyItemAdded,
    notifyItemRemoved,
    notifyListCleared,
  } = useNotifications();

  // Solicitar permissão de notificações ao montar
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (!hasPermission) {
        const granted = await requestPermissions();
        if (!granted) {
          console.log("⚠️ Usuário negou permissão para notificações");
        }
      }
    };

    // Aguardar 1 segundo para solicitar (melhor UX)
    const timer = setTimeout(() => {
      requestNotificationPermission();
    }, 1000);

    return () => clearTimeout(timer);
  }, [hasPermission, requestPermissions]);

  // Listener para itens em tempo real
  useEffect(() => {
    const unsubscribe = listenToItems(
      (updatedItems) => {
        setItems(updatedItems);
        setSyncing(false); // Primeira carga completa
      },
      (error) => {
        console.error("Erro ao carregar itens:", error);
        Alert.alert("Erro", "Não foi possível carregar os itens");
        setSyncing(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /**
   * Adicionar novo item à lista
   */
  const handleAddItem = async (name: string) => {
    setLoading(true);
    try {
      await addItem(name);
      // Notificar usuário
      await notifyItemAdded(name);
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      Alert.alert("Erro", "Não foi possível adicionar o item");
      throw error; // Re-lançar para o componente ItemInput lidar
    } finally {
      setLoading(false);
    }
  };

  /**
   * Alternar estado de comprado do item
   */
  const handleTogglePurchased = async (item: Item) => {
    try {
      await togglePurchased(item.id, !item.purchased);
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
      Alert.alert("Erro", "Não foi possível atualizar o item");
    }
  };

  /**
   * Remover item da lista
   */
  const handleDeleteItem = async (itemId: string, itemName: string) => {
    try {
      await deleteItem(itemId);
      // Notificar usuário
      await notifyItemRemoved(itemName);
    } catch (error) {
      console.error("Erro ao remover item:", error);
      Alert.alert("Erro", "Não foi possível remover o item");
    }
  };

  /**
   * Limpar toda a lista
   */
  const handleClearAll = async () => {
    try {
      const itemCount = items.length;
      await clearAllItems();
      // Notificar usuário
      await notifyListCleared(itemCount);
    } catch (error) {
      console.error("Erro ao limpar lista:", error);
      Alert.alert("Erro", "Não foi possível limpar a lista");
      throw error; // Re-lançar para o ClearButton lidar
    }
  };

  // Mostrar loading na primeira carga
  if (syncing && items.length === 0) {
    return <LoadingSpinner message="Sincronizando..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header com gradiente */}
      <LinearGradient
        colors={gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Lista de Compras</Text>
          <Text style={styles.subtitle}>Organize suas compras</Text>
        </View>

        <View style={styles.counterContainer}>
          {syncing && (
            <ActivityIndicator
              size="small"
              color={colors.glowGreen}
              style={styles.syncIndicator}
            />
          )}
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>{items.length}</Text>
          </View>
          <Text style={styles.counterLabel}>
            {items.length === 1 ? "item" : "itens"}
          </Text>
        </View>
      </LinearGradient>

      {/* Input para adicionar item */}
      <ItemInput onAddItem={handleAddItem} loading={loading} />

      {/* Lista de itens */}
      <ItemList
        items={items}
        onTogglePurchased={handleTogglePurchased}
        onDeleteItem={handleDeleteItem}
      />

      {/* Botão para limpar lista */}
      <ClearButton onClear={handleClearAll} itemCount={items.length} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    ...shadows.large,
  },
  headerContent: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    opacity: 0.9,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: spacing.sm,
  },
  syncIndicator: {
    marginRight: spacing.sm,
  },
  counterBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    marginRight: spacing.sm,
    minWidth: 44,
    alignItems: "center",
  },
  counterText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  counterLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    opacity: 0.9,
  },
});
