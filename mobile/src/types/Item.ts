/**
 * Interface para Item da lista de compras
 */
export interface Item {
  id: string;
  name: string;
  purchased: boolean;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
}

/**
 * DTO para criar novo item
 */
export interface ItemCreate {
  name: string;
}

/**
 * DTO para atualizar item
 */
export interface ItemUpdate {
  name?: string;
  purchased?: boolean;
  deleted?: boolean;
}
