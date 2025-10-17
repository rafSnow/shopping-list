// Types para o aplicativo

export interface Item {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  synced?: boolean; // Para controle offline
}

export interface ItemCreateRequest {
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ErrorDetails;
  timestamp: string;
}

export interface ErrorDetails {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ListResponse {
  data: Item[];
  count: number;
}

export interface ClearResponse {
  message: string;
  deletedCount: number;
}

export type WebSocketMessageType = 
  | 'ITEM_ADDED' 
  | 'ITEM_REMOVED' 
  | 'LIST_CLEARED' 
  | 'PING' 
  | 'PONG' 
  | 'ERROR';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  data?: any;
  timestamp: string;
  deviceId?: string;
}

export interface AppState {
  items: Item[];
  loading: boolean;
  error: string | null;
  syncing: boolean;
  isOnline: boolean;
  lastSync: string | null;
}
