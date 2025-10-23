import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import {
  requestNotificationPermissions,
  notifyItemAdded,
  notifyItemRemoved,
  notifyListCleared,
  notifyError,
  scheduleDailyReminder,
  cancelDailyReminder,
} from '../services/localNotifications';

export interface UseNotificationsReturn {
  hasPermission: boolean;
  isLoading: boolean;
  requestPermissions: () => Promise<boolean>;
  notifyItemAdded: (itemName: string) => Promise<void>;
  notifyItemRemoved: (itemName: string) => Promise<void>;
  notifyListCleared: (count: number) => Promise<void>;
  notifyError: (message: string) => Promise<void>;
  enableDailyReminder: () => Promise<void>;
  disableDailyReminder: () => Promise<void>;
}

/**
 * Hook customizado para gerenciar notificações
 *
 * @example
 * const {
 *   hasPermission,
 *   notifyItemAdded,
 *   enableDailyReminder
 * } = useNotifications();
 *
 * // Adicionar item
 * await addItem({ name: 'Leite' });
 * await notifyItemAdded('Leite');
 */
export function useNotifications(): UseNotificationsReturn {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar permissão ao montar componente
  useEffect(() => {
    checkPermission();
  }, []);

  // Listener para notificações recebidas (quando app está aberto)
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('📩 Notificação recebida:', notification);
    });

    return () => subscription.remove();
  }, []);

  // Listener para quando usuário toca na notificação
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Usuário tocou na notificação:', response);
      // Aqui você pode navegar para tela específica, etc.
    });

    return () => subscription.remove();
  }, []);

  /**
   * Verificar permissão atual
   */
  const checkPermission = async () => {
    try {
      setIsLoading(true);
      const { status } = await Notifications.getPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Solicitar permissões
   */
  const requestPermissions = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const granted = await requestNotificationPermissions();
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      setHasPermission(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Ativar lembrete diário
   */
  const enableDailyReminder = async (): Promise<void> => {
    try {
      if (!hasPermission) {
        const granted = await requestPermissions();
        if (!granted) return;
      }

      await scheduleDailyReminder();
    } catch (error) {
      console.error('Erro ao ativar lembrete diário:', error);
    }
  };

  /**
   * Desativar lembrete diário
   */
  const disableDailyReminder = async (): Promise<void> => {
    try {
      await cancelDailyReminder();
    } catch (error) {
      console.error('Erro ao desativar lembrete diário:', error);
    }
  };

  return {
    hasPermission,
    isLoading,
    requestPermissions,
    notifyItemAdded,
    notifyItemRemoved,
    notifyListCleared,
    notifyError,
    enableDailyReminder,
    disableDailyReminder,
  };
}
