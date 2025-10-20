import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import type { Item, ItemCreate, ItemFirestore } from '../types/Item';

// ============================================
// Configuração Firebase
// ============================================

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Nome da collection
const ITEMS_COLLECTION = 'items';

// ============================================
// Funções auxiliares
// ============================================

/**
 * Converte ItemFirestore para Item
 */
const convertFirestoreToItem = (id: string, data: ItemFirestore): Item => ({
  id,
  name: data.name,
  createdAt: data.createdAt?.toDate() || new Date(),
  updatedAt: data.updatedAt?.toDate() || new Date(),
  deleted: data.deleted,
});

// ============================================
// CRUD Operations
// ============================================

/**
 * Adiciona um novo item
 */
export const addItem = async (itemData: ItemCreate): Promise<string> => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, ITEMS_COLLECTION), {
      name: itemData.name.trim(),
      createdAt: now,
      updatedAt: now,
      deleted: false,
    });

    console.log('Item adicionado com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar item:', error);
    throw error;
  }
};

/**
 * Atualiza um item existente
 */
export const updateItem = async (itemId: string, newName: string): Promise<void> => {
  try {
    const itemRef = doc(db, ITEMS_COLLECTION, itemId);
    await updateDoc(itemRef, {
      name: newName.trim(),
      updatedAt: Timestamp.now(),
    });

    console.log('Item atualizado:', itemId);
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    throw error;
  }
};

/**
 * Remove um item (soft delete)
 */
export const deleteItem = async (itemId: string): Promise<void> => {
  try {
    const itemRef = doc(db, ITEMS_COLLECTION, itemId);
    await updateDoc(itemRef, {
      deleted: true,
      updatedAt: Timestamp.now(),
    });

    console.log('Item removido:', itemId);
  } catch (error) {
    console.error('Erro ao remover item:', error);
    throw error;
  }
};

/**
 * Limpa toda a lista (soft delete em batch)
 */
export const clearAllItems = async (): Promise<number> => {
  try {
    const q = query(
      collection(db, ITEMS_COLLECTION),
      where('deleted', '==', false)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('Nenhum item para limpar');
      return 0;
    }

    const batch = writeBatch(db);
    const now = Timestamp.now();

    snapshot.docs.forEach((docSnapshot) => {
      batch.update(docSnapshot.ref, {
        deleted: true,
        updatedAt: now,
      });
    });

    await batch.commit();

    const count = snapshot.size;
    console.log(`${count} itens removidos`);
    return count;
  } catch (error) {
    console.error('Erro ao limpar lista:', error);
    throw error;
  }
};

/**
 * Ouve mudanças em tempo real nos itens ativos
 * Retorna função unsubscribe para cancelar listener
 */
export const listenToItems = (
  callback: (items: Item[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const q = query(
    collection(db, ITEMS_COLLECTION),
    where('deleted', '==', false),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((doc) =>
        convertFirestoreToItem(doc.id, doc.data() as ItemFirestore)
      );

      callback(items);
    },
    (error) => {
      console.error('Erro no listener de itens:', error);
      if (onError) {
        onError(error as Error);
      }
    }
  );

  return unsubscribe;
};

/**
 * Busca itens uma única vez (sem listener)
 */
export const getItems = async (): Promise<Item[]> => {
  try {
    const q = query(
      collection(db, ITEMS_COLLECTION),
      where('deleted', '==', false),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    const items = snapshot.docs.map((doc) =>
      convertFirestoreToItem(doc.id, doc.data() as ItemFirestore)
    );

    return items;
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    throw error;
  }
};
