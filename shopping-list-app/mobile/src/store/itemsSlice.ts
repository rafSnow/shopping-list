// Redux Slice para gerenciamento de itens
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { itemsApi } from '../services/api';
import { storage } from '../services/storage';
import type { Item, ItemCreateRequest, AppState } from '../types';

const initialState: AppState = {
  items: [],
  loading: false,
  error: null,
  syncing: false,
  isOnline: true,
  lastSync: null,
};

// Thunks assíncronos
export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await itemsApi.getAll();
      await storage.saveItems(response.data);
      await storage.saveLastSync(new Date().toISOString());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao buscar itens');
    }
  }
);

export const addItem = createAsyncThunk(
  'items/addItem',
  async (request: ItemCreateRequest, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { items: AppState };
      
      // Se offline, adicionar localmente
      if (!state.items.isOnline) {
        const tempItem: Item = {
          id: `temp_${Date.now()}`,
          name: request.name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          synced: false,
        };
        return { item: tempItem, offline: true };
      }

      const item = await itemsApi.create(request);
      return { item: { ...item, synced: true }, offline: false };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao adicionar item');
    }
  }
);

export const removeItem = createAsyncThunk(
  'items/removeItem',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { items: AppState };
      
      if (!state.items.isOnline) {
        return { id, offline: true };
      }

      await itemsApi.delete(id);
      return { id, offline: false };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao remover item');
    }
  }
);

export const clearAllItems = createAsyncThunk(
  'items/clearAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { items: AppState };
      
      if (!state.items.isOnline) {
        return { offline: true };
      }

      await itemsApi.clearAll();
      return { offline: false };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao limpar lista');
    }
  }
);

export const loadOfflineItems = createAsyncThunk(
  'items/loadOffline',
  async () => {
    const items = await storage.loadItems();
    const lastSync = await storage.loadLastSync();
    return { items, lastSync };
  }
);

// Slice
const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setSyncing: (state, action: PayloadAction<boolean>) => {
      state.syncing = action.payload;
    },
    addItemFromWebSocket: (state, action: PayloadAction<Item>) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (!exists) {
        state.items.unshift({ ...action.payload, synced: true });
      }
    },
    removeItemFromWebSocket: (state, action: PayloadAction<{ id: string }>) => {
      state.items = state.items.filter(item => item.id !== action.payload.id);
    },
    clearItemsFromWebSocket: (state) => {
      state.items = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch items
    builder.addCase(fetchItems.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchItems.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.map(item => ({ ...item, synced: true }));
      state.lastSync = new Date().toISOString();
    });
    builder.addCase(fetchItems.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add item
    builder.addCase(addItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addItem.fulfilled, (state, action) => {
      state.loading = false;
      state.items.unshift(action.payload.item);
    });
    builder.addCase(addItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Remove item
    builder.addCase(removeItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeItem.fulfilled, (state, action) => {
      state.loading = false;
      state.items = state.items.filter(item => item.id !== action.payload.id);
    });
    builder.addCase(removeItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Clear all items
    builder.addCase(clearAllItems.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(clearAllItems.fulfilled, (state) => {
      state.loading = false;
      state.items = [];
    });
    builder.addCase(clearAllItems.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Load offline items
    builder.addCase(loadOfflineItems.fulfilled, (state, action) => {
      state.items = action.payload.items;
      state.lastSync = action.payload.lastSync;
    });
  },
});

export const {
  setOnlineStatus,
  setSyncing,
  addItemFromWebSocket,
  removeItemFromWebSocket,
  clearItemsFromWebSocket,
  clearError,
} = itemsSlice.actions;

export default itemsSlice.reducer;
