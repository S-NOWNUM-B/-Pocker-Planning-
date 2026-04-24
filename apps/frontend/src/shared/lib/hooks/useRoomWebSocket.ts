import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from './useWebSocket';

interface WebSocketEvent {
  type: string;
  payload?: unknown;
}

interface UseRoomWebSocketOptions {
  roomId: string;
  roomRef: string;
  token: string;
  userId?: string;
  enabled?: boolean;
}

export function useRoomWebSocket({
  roomId,
  roomRef,
  token,
  userId = 'guest',
  enabled = true,
}: UseRoomWebSocketOptions) {
  const queryClient = useQueryClient();
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const wsUrl = (() => {
    const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const baseUrl = apiUrl.startsWith('http')
      ? apiUrl.replace(/^https?:/, wsProtocol)
      : `${wsProtocol}//${window.location.host}${apiUrl}`;

    return `${baseUrl}/ws/rooms/${roomId}?token=${encodeURIComponent(token)}`;
  })();

  const invalidateRoomQueries = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: ['room', roomRef, userId],
    });
    void queryClient.invalidateQueries({ queryKey: ['rooms'] });
    void queryClient.invalidateQueries({ queryKey: ['room-history', roomId] });
  }, [queryClient, roomRef, userId, roomId]);

  const handleMessage = useCallback(
    (event: WebSocketEvent) => {
      console.log('WebSocket event received:', event.type);

      switch (event.type) {
        case 'presence.changed':
        case 'round.started':
        case 'vote.submitted':
        case 'round.revealed':
        case 'round.finalized':
        case 'round.reset':
        case 'room.snapshot':
          invalidateRoomQueries();
          break;
        case 'error':
          console.error('WebSocket error event:', event.payload);
          break;
        default:
          console.warn('Unknown WebSocket event type:', event.type);
      }
    },
    [invalidateRoomQueries],
  );

  const handleError = useCallback((error: Event) => {
    console.error('WebSocket connection error:', error);
  }, []);

  const { sendMessage, isConnected, disconnect } = useWebSocket<WebSocketEvent>({
    url: wsUrl,
    onMessage: handleMessage,
    onError: handleError,
    autoConnect: enabled,
    reconnectInterval: 3000,
    maxReconnectAttempts: 10,
  });

  useEffect(() => {
    if (!isConnected || !enabled) {
      return;
    }

    sendMessage({ type: 'presence.ping' });

    pingIntervalRef.current = setInterval(() => {
      sendMessage({ type: 'presence.ping' });
    }, 30000);

    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, [isConnected, enabled, sendMessage]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    sendMessage,
  };
}
