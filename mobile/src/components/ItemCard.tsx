import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Item } from "../types/Item";

interface ItemCardProps {
  item: Item;
  onDelete: (id: string) => Promise<void>;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onDelete }) => {
  const [deleting, setDeleting] = React.useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleDelete = async () => {
    setDeleting(true);

    // Animação de saída
    Animated.spring(scaleAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();

    try {
      await onDelete(item.id);
    } catch (error) {
      // Se falhar, volta animação
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
      setDeleting(false);
    }
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
    >
      <View style={styles.content}>
        <View style={styles.icon}>
          <Ionicons name="cart-outline" size={24} color="#4CAF50" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
        </View>

        <TouchableOpacity
          onPress={handleDelete}
          disabled={deleting}
          style={styles.deleteButton}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color={deleting ? "#ccc" : "#f44336"}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const formatDate = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Agora";
  if (minutes < 60) return `${minutes}m atrás`;
  if (hours < 24) return `${hours}h atrás`;
  if (days < 7) return `${days}d atrás`;

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  deleteButton: {
    padding: 8,
  },
});
