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
import { useEffect, useRef, useCallback } from 'react';

interface UseWebSocketOptions<T> {
  url: string;
  onMessage: (data: T) => void;
  reconnectInterval?: number;
  autoConnect?: boolean;
}

export function useWebSocket<T>({
  url,
  onMessage,
  reconnectInterval = 3000,
  autoConnect = true,
}: UseWebSocketOptions<T>) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const connect = useCallback(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
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
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected, reconnecting...');
      reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval);
    };
  }, [url, onMessage, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
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

  return { sendMessage, disconnect, isConnected: wsRef.current?.readyState === WebSocket.OPEN };
}
