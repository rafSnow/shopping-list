import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// ============================================
// Configuração do comportamento das notificações
// ============================================

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ============================================
// Funções de Permissão
// ============================================

/**
 * Solicitar permissão para notificações
 * @returns true se permissão foi concedida
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('⚠️ Permissão para notificações negada');
      return false;
    }

    console.log('✅ Permissão para notificações concedida');
    return true;
  } catch (error) {
    console.error('Erro ao solicitar permissão para notificações:', error);
    return false;
  }
}

// ============================================
// Funções de Notificação
// ============================================

/**
 * Agendar notificação local
 * @param title Título da notificação
 * @param body Corpo da notificação
 * @param seconds Segundos até mostrar (0 = imediato)
 * @returns ID da notificação agendada
 */
export async function scheduleLocalNotification(
  title: string,
  body: string,
  seconds: number = 0
): Promise<string | null> {
  try {
    const hasPermission = await requestNotificationPermissions();

    if (!hasPermission) {
      console.log('❌ Não foi possível enviar notificação - permissão negada');
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        badge: 1,
      },
      trigger: seconds > 0 ? { seconds } : null, // null = imediato
    });

    console.log('✅ Notificação agendada:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('Erro ao agendar notificação:', error);
    return null;
  }
}

// ============================================
// Notificações Específicas do App
// ============================================

/**
 * Notificar quando item for adicionado
 */
export async function notifyItemAdded(itemName: string): Promise<void> {
  try {
    await scheduleLocalNotification(
      '✅ Item Adicionado',
      `"${itemName}" foi adicionado à lista!`,
      0 // Imediato
    );
  } catch (error) {
    console.error('Erro ao enviar notificação de item adicionado:', error);
  }
}

/**
 * Notificar quando item for removido
 */
export async function notifyItemRemoved(itemName: string): Promise<void> {
  try {
    await scheduleLocalNotification(
      '🗑️ Item Removido',
      `"${itemName}" foi removido da lista!`,
      0
    );
  } catch (error) {
    console.error('Erro ao enviar notificação de item removido:', error);
  }
}

/**
 * Notificar quando lista for limpa
 */
export async function notifyListCleared(count: number): Promise<void> {
  try {
    await scheduleLocalNotification(
      '🧹 Lista Limpa',
      `${count} ${count === 1 ? 'item foi removido' : 'itens foram removidos'}!`,
      0
    );
  } catch (error) {
    console.error('Erro ao enviar notificação de lista limpa:', error);
  }
}

/**
 * Notificar quando houver erro
 */
export async function notifyError(message: string): Promise<void> {
  try {
    await scheduleLocalNotification(
      '❌ Erro',
      message,
      0
    );
  } catch (error) {
    console.error('Erro ao enviar notificação de erro:', error);
  }
}

/**
 * Lembrete diário para checar lista
 * Agenda notificação para todo dia às 10h
 */
export async function scheduleDailyReminder(): Promise<void> {
  try {
    const hasPermission = await requestNotificationPermissions();

    if (!hasPermission) {
      console.log('❌ Não foi possível agendar lembrete - permissão negada');
      return;
    }

    // Cancelar lembretes anteriores
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Agendar para todo dia às 10h
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🛒 Lembrete da Lista de Compras',
        body: 'Não esqueça de verificar sua lista de compras!',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.DEFAULT,
      },
      trigger: {
        hour: 10,
        minute: 0,
        repeats: true,
      },
    });

    console.log('✅ Lembrete diário agendado para 10h');
  } catch (error) {
    console.error('Erro ao agendar lembrete diário:', error);
  }
}

/**
 * Cancelar lembrete diário
 */
export async function cancelDailyReminder(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('✅ Lembrete diário cancelado');
  } catch (error) {
    console.error('Erro ao cancelar lembrete diário:', error);
  }
}

/**
 * Cancelar todas as notificações agendadas
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('✅ Todas as notificações canceladas');
  } catch (error) {
    console.error('Erro ao cancelar notificações:', error);
  }
}

/**
 * Obter todas as notificações agendadas
 */
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log(`📋 ${notifications.length} notificações agendadas`);
    return notifications;
  } catch (error) {
    console.error('Erro ao obter notificações agendadas:', error);
    return [];
  }
}
