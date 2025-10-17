// Cliente HTTP usando Axios
import axios from 'axios';
import { API_CONFIG } from '../constants/config';
import type { 
  ApiResponse, 
  ListResponse, 
  ItemCreateRequest, 
  Item, 
  ClearResponse 
} from '../types';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logs (desenvolvimento)
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status}`);
    return response;
  },
  (error) => {
    console.error('[API] Response error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// API Endpoints
export const itemsApi = {
  // GET /api/items
  getAll: async (): Promise<ListResponse> => {
    const response = await api.get<ApiResponse<ListResponse>>('/items');
    if (!response.data.success || !response.data.data) {
      throw new Error('Erro ao buscar itens');
    }
    return response.data.data;
  },

  // POST /api/items
  create: async (request: ItemCreateRequest): Promise<Item> => {
    const response = await api.post<ApiResponse<Item>>('/items', request);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Erro ao criar item');
    }
    return response.data.data;
  },

  // DELETE /api/items/{id}
  delete: async (id: string): Promise<void> => {
    await api.delete(`/items/${id}`);
  },

  // DELETE /api/items/clear
  clearAll: async (): Promise<ClearResponse> => {
    const response = await api.delete<ApiResponse<ClearResponse>>('/items/clear');
    if (!response.data.success || !response.data.data) {
      throw new Error('Erro ao limpar lista');
    }
    return response.data.data;
  },
};

export default api;
