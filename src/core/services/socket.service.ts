import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket;

  constructor() {
    const VITE_API = (import.meta as any).env?.VITE_API_URL;
    const API_BASE = VITE_API || 'https://premed-election-backend.onrender.com';
    
    this.socket = io(API_BASE, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.socket.off(event, callback);
  }

  emit(event: string, data?: any) {
    this.socket.emit(event, data);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export const socket = new SocketService();