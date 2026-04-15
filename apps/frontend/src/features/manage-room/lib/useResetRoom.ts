/**
 * Хук для сброса голосования в текущем раунде.
 *
 * Возвращает useMutation для POST /rooms/:roomId/reset.
 * После сброса инвалидирует кэш ['room', roomId] для обновления
 * состояния комнаты (сброс голосов, статус → voting).
 *
 * @param roomId — ID комнаты
 * @returns { mutate, isPending } — функция сброса и статус загрузки
 *
 * Используется в RoomControls. Вызывается только модератором.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';

export function useResetRoom(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/rooms/${roomId}/reset`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room', roomId] });
    },
  });
}
