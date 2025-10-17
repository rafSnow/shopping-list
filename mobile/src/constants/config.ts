// Configurações e constantes da aplicação

export const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || 'http://10.0.2.2:8080/api',
  WS_URL: process.env.WS_URL || 'ws://10.0.2.2:8080/ws',
  TIMEOUT: 10000,
};

export const SYNC_CONFIG = {
  INTERVAL: parseInt(process.env.SYNC_INTERVAL || '30000', 10),
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000,
};

export const STORAGE_KEYS = {
  ITEMS: '@shopping_list:items',
  PENDING_OPERATIONS: '@shopping_list:pending_ops',
  LAST_SYNC: '@shopping_list:last_sync',
};

export const COLORS = {
  primary: '#6200EE',
  secondary: '#03DAC6',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  error: '#B00020',
  text: '#000000',
  textSecondary: '#666666',
  success: '#4CAF50',
  warning: '#FF9800',
  border: '#E0E0E0',
};

export const NOTIFICATIONS = {
  CHANNEL_ID: 'shopping_list_channel',
  CHANNEL_NAME: 'Lista de Compras',
};
