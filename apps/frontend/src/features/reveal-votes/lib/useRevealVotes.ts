/**
 * Хук для раскрытия результатов голосования.
 *
 * Возвращает useMutation для POST /rooms/:roomId/reveal.
 * После успешного раскрытия инвалидирует кэш ['room', roomId]
 * для обновления состояния комнаты (статус → revealed).
 *
 * @param roomId — ID комнаты
 * @returns { mutate, isPending } — функция раскрытия и статус загрузки
 *
 * Используется в RevealButton. Вызывается только модератором.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';

export function useRevealVotes(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/rooms/${roomId}/reveal`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room', roomId] });
    },
  });
}
