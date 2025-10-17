// Configuração do Redux Store
import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './itemsSlice';

export const store = configureStore({
  reducer: {
    items: itemsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar ações específicas se necessário
        ignoredActions: [],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
