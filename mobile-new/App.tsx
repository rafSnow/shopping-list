import { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  Alert,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { listenToItems, addItem, togglePurchased, deleteItem, clearAllItems, Item } from './src/services/firebase';
import { registerForPushNotificationsAsync } from './src/services/notifications';

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(true);
  const [pushToken, setPushToken] = useState<string>();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  // Registrar para notificações
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setPushToken(token));

    // Listener para quando notificação é recebida
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificação recebida:', notification);
    });

    // Listener para quando usuário toca na notificação
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notificação tocada:', response);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  // Listener para itens com detecção de novos itens
  useEffect(() => {
    let previousItemsCount = items.length;
    
    const unsubscribe = listenToItems(
      (updatedItems) => {
        // Se recebeu mais itens do que tinha antes, pode ser de outro usuário
        if (updatedItems.length > previousItemsCount && previousItemsCount > 0) {
          const newItem = updatedItems[0]; // Novo item está no topo (orderBy createdAt desc)
          
          // Enviar notificação local
          Notifications.scheduleNotificationAsync({
            content: {
              title: '🛒 Novo item adicionado!',
              body: `${newItem.name} foi adicionado à lista`,
              sound: true,
              data: { itemId: newItem.id },
            },
            trigger: null, // Imediatamente
          });
        }
        
        previousItemsCount = updatedItems.length;
        setItems(updatedItems);
        setSyncing(false); // Primeira carga completa
      },
      (error) => {
        console.error('Erro ao carregar itens:', error);
        Alert.alert('Erro', 'Não foi possível carregar os itens');
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAddItem = async () => {
    if (!newItemName.trim()) {
      Alert.alert('Atenção', 'Digite o nome do item');
      return;
    }

    setLoading(true);
    try {
      await addItem(newItemName);
      setNewItemName('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o item');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePurchased = async (item: Item) => {
    try {
      await togglePurchased(item.id, !item.purchased);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteItem(itemId);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o item');
    }
  };

  const handleClearAll = () => {
    if (items.length === 0) {
      Alert.alert('Info', 'A lista já está vazia');
      return;
    }

    Alert.alert(
      'Confirmar',
      'Deseja limpar toda a lista?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllItems();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível limpar a lista');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity 
        style={styles.itemContent}
        onPress={() => handleTogglePurchased(item)}
      >
        <Text style={[styles.itemText, item.purchased && styles.itemTextPurchased]}>
          {item.name}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteItem(item.id)}
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Indicador de sincronização */}
      {syncing && (
        <View style={styles.syncIndicator}>
          <ActivityIndicator size="small" color="#4CAF50" />
          <Text style={styles.syncText}>Sincronizando...</Text>
        </View>
      )}
      
      <Text style={styles.title}>🛒 Lista de Compras</Text>
      <Text style={styles.subtitle}>
        {items.length} {items.length === 1 ? 'item' : 'itens'}
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite um item..."
          value={newItemName}
          onChangeText={setNewItemName}
          onSubmitEditing={handleAddItem}
        />
        <TouchableOpacity 
          style={[styles.addButton, loading && styles.addButtonDisabled]}
          onPress={handleAddItem}
          disabled={loading}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum item na lista</Text>
        }
      />

      {items.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
          <Text style={styles.clearButtonText}>Limpar Lista</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  syncIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    marginBottom: 10,
  },
  syncText: {
    marginLeft: 8,
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
  },
  itemTextPurchased: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  clearButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  clearButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  },
});
