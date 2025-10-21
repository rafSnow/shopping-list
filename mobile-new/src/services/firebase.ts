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
  enableIndexedDbPersistence,
} from 'firebase/firestore';

// Tipos
export interface Item {
  id: string;
  name: string;
  purchased: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ItemFirestore {
  name: string;
  purchased: boolean;
  createdAt: any;
  updatedAt: any;
}

// Configuração Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Habilitar persistência offline (apenas em ambiente web)
// No React Native, o cache já é automático
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Persistência offline: múltiplas abas abertas');
    } else if (err.code === 'unimplemented') {
      console.warn('Persistência offline: navegador não suporta');
    }
  });
}

const ITEMS_COLLECTION = 'items';

// Converter Firestore para Item
const convertToItem = (id: string, data: ItemFirestore): Item => ({
  id,
  name: data.name,
  purchased: data.purchased,
  createdAt: data.createdAt?.toDate() || new Date(),
  updatedAt: data.updatedAt?.toDate() || new Date(),
});

// Adicionar item
export const addItem = async (name: string): Promise<string> => {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, ITEMS_COLLECTION), {
    name: name.trim(),
    purchased: false,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
};

// Alternar status de comprado
export const togglePurchased = async (itemId: string, purchased: boolean): Promise<void> => {
  const itemRef = doc(db, ITEMS_COLLECTION, itemId);
  await updateDoc(itemRef, {
    purchased,
    updatedAt: Timestamp.now(),
  });
};

// Excluir item
export const deleteItem = async (itemId: string): Promise<void> => {
  const itemRef = doc(db, ITEMS_COLLECTION, itemId);
  await updateDoc(itemRef, {
    deleted: true,
    updatedAt: Timestamp.now(),
  });
};

// Limpar todos os itens
export const clearAllItems = async (): Promise<void> => {
  // Buscar todos os documentos sem filtro where para evitar erro de índice
  const q = query(collection(db, ITEMS_COLLECTION));
  const snapshot = await getDocs(q);
  
  const batch = writeBatch(db);
  let count = 0;
  
  snapshot.docs.forEach((docSnapshot) => {
    const data = docSnapshot.data();
    // Marcar como deletado apenas se ainda não foi deletado
    if (!data.deleted) {
      batch.update(docSnapshot.ref, {
        deleted: true,
        updatedAt: Timestamp.now(),
      });
      count++;
    }
  });
  
  if (count > 0) {
    await batch.commit();
  }
};

// Ouvir mudanças em tempo real
export const listenToItems = (
  callback: (items: Item[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  // Query simplificada sem where + orderBy para evitar necessidade de índice
  const q = query(
    collection(db, ITEMS_COLLECTION),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      // Filtrar itens não deletados localmente
      const items = snapshot.docs
        .filter(docSnap => !(docSnap.data() as any).deleted)
        .map((docSnap) => convertToItem(docSnap.id, docSnap.data() as ItemFirestore));
      callback(items);
    },
    onError
  );
};
