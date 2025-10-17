// Gerenciador de armazenamento local
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';
import type { Item } from '../types';

export const storage = {
  // Salvar itens
  async saveItems(items: Item[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    } catch (error) {
      console.error('[Storage] Erro ao salvar itens:', error);
      throw error;
    }
  },

  // Carregar itens
  async loadItems(): Promise<Item[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ITEMS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[Storage] Erro ao carregar itens:', error);
      return [];
    }
  },

  // Salvar operações pendentes
  async savePendingOperations(operations: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.PENDING_OPERATIONS,
        JSON.stringify(operations)
      );
    } catch (error) {
      console.error('[Storage] Erro ao salvar operações pendentes:', error);
      throw error;
    }
  },

  // Carregar operações pendentes
  async loadPendingOperations(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_OPERATIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[Storage] Erro ao carregar operações pendentes:', error);
      return [];
    }
  },

  // Salvar timestamp da última sincronização
  async saveLastSync(timestamp: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, timestamp);
    } catch (error) {
      console.error('[Storage] Erro ao salvar última sincronização:', error);
      throw error;
    }
  },

  // Carregar timestamp da última sincronização
  async loadLastSync(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    } catch (error) {
      console.error('[Storage] Erro ao carregar última sincronização:', error);
      return null;
    }
  },

  // Limpar todos os dados
  async clear(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ITEMS,
        STORAGE_KEYS.PENDING_OPERATIONS,
        STORAGE_KEYS.LAST_SYNC,
      ]);
    } catch (error) {
      console.error('[Storage] Erro ao limpar dados:', error);
      throw error;
    }
  },
};
