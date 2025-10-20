/**
 * Item da Lista de Compras
 */
export interface Item {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
}

/**
 * Item para criação (sem ID)
 */
export interface ItemCreate {
  name: string;
}

/**
 * Item do Firestore (com Timestamp)
 */
export interface ItemFirestore {
  name: string;
  createdAt: any; // Timestamp do Firestore
  updatedAt: any; // Timestamp do Firestore
  deleted: boolean;
}
