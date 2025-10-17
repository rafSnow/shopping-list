// Cliente WebSocket usando Socket.io
import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '../constants/config';
import type { WebSocketMessage } from '../types';

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  connect(): void {
    if (this.socket?.connected) {
      console.log('[WebSocket] Já conectado');
      return;
    }

    console.log('[WebSocket] Conectando...');
    
    this.socket = io(API_CONFIG.WS_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });

    this.socket.on('connect', () => {
      console.log('[WebSocket] Conectado');
      this.emit('connected', true);
    });

    this.socket.on('disconnect', () => {
      console.log('[WebSocket] Desconectado');
      this.emit('connected', false);
    });

    this.socket.on('error', (error) => {
      console.error('[WebSocket] Erro:', error);
      this.emit('error', error);
    });

    // Escutar mensagens do tópico /topic/items
    this.socket.on('message', (message: WebSocketMessage) => {
      console.log('[WebSocket] Mensagem recebida:', message.type);
      this.handleMessage(message);
    });
  }

  disconnect(): void {
    if (this.socket) {
      console.log('[WebSocket] Desconectando...');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  off(event: string, callback: (data: any) => void): void {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: any): void {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'ITEM_ADDED':
        this.emit('itemAdded', message.data);
        break;
      case 'ITEM_REMOVED':
        this.emit('itemRemoved', message.data);
        break;
      case 'LIST_CLEARED':
        this.emit('listCleared', message.data);
        break;
      case 'PING':
        this.sendPong();
        break;
      default:
        console.log('[WebSocket] Tipo de mensagem desconhecido:', message.type);
    }
  }

  private sendPong(): void {
    if (this.socket?.connected) {
      this.socket.emit('message', { type: 'PONG', timestamp: new Date().toISOString() });
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default new WebSocketService();
