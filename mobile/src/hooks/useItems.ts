import { useState, useEffect } from 'react';
import {
  addItem,
  deleteItem,
  clearAllItems,
  listenToItems,
} from '../services/firebase';
import type { Item, ItemCreate } from '../types/Item';

interface UseItemsReturn {
  items: Item[];
  loading: boolean;
  error: string | null;
  addNewItem: (name: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearList: () => Promise<void>;
  refresh: () => void;
}

/**
 * Hook personalizado para gerenciar itens da lista
 * Usa real-time listeners do Firestore
 */
export const useItems = (): UseItemsReturn => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listener em tempo real
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = listenToItems(
      (updatedItems) => {
        setItems(updatedItems);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup: cancelar listener quando componente desmontar
    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Adiciona novo item
   */
  const addNewItem = async (name: string): Promise<void> => {
    try {
      setError(null);

      // Validação
      const trimmedName = name.trim();
      if (!trimmedName) {
        throw new Error('O nome do item não pode estar vazio');
      }
      if (trimmedName.length > 200) {
        throw new Error('O nome do item não pode ter mais de 200 caracteres');
      }

      const itemData: ItemCreate = { name: trimmedName };
      await addItem(itemData);

      // Não precisa atualizar estado manualmente
      // O listener real-time fará isso automaticamente
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar item';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Remove item
   */
  const removeItem = async (id: string): Promise<void> => {
    try {
      setError(null);
      await deleteItem(id);

      // O listener real-time atualizará automaticamente
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover item';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Limpa toda a lista
   */
  const clearList = async (): Promise<void> => {
    try {
      setError(null);
      await clearAllItems();

      // O listener real-time atualizará automaticamente
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao limpar lista';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Force refresh (normalmente não necessário com real-time)
   */
  const refresh = (): void => {
    // Com real-time listeners, refresh é automático
    // Esta função existe para compatibilidade
    console.log('Refresh não necessário com Firestore real-time');
  };

  return {
    items,
    loading,
    error,
    addNewItem,
    removeItem,
    clearList,
    refresh,
  };
};
