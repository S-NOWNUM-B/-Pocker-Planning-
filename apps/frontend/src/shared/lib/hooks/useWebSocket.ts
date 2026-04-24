/**
 * Хук для работы с WebSocket-соединением.
 *
 * Поддерживает:
 *  - Автоматическое подключение при монтировании
 *  - Переподключение при обрыве связи (настраиваемый интервал)
 *  - Парсинг JSON-сообщений
 *  - Отправку сообщений через sendMessage()
 *  - Ручное отключение через disconnect()
 *
 * @param url — адрес WebSocket-сервера
 * @param onMessage — обработчик входящих сообщений
 * @param reconnectInterval — интервал переподключения (мс), по умолчанию 3000
 * @param autoConnect — подключаться автоматически, по умолчанию true
 * @returns { sendMessage, disconnect, isConnected }
 */
import { useEffect, useRef, useCallback, useState } from 'react';

interface UseWebSocketOptions<T> {
  url: string;
  onMessage: (data: T) => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  autoConnect?: boolean;
}

export function useWebSocket<T>({
  url,
  onMessage,
  onError,
  reconnectInterval = 3000,
  maxReconnectAttempts = 10,
  autoConnect = true,
}: UseWebSocketOptions<T>) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reconnectAttemptsRef = useRef(0);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.error('Max WebSocket reconnect attempts reached');
      return;
    }

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      onError?.(error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);

      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current += 1;
        const delay = Math.min(reconnectInterval * Math.pow(2, reconnectAttemptsRef.current - 1), 30000);
        console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      }
    };
  }, [url, onMessage, onError, reconnectInterval, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [connect, disconnect, autoConnect]);

  const sendMessage = useCallback((message: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  return { sendMessage, disconnect, isConnected };
}
