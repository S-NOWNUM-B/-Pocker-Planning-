/**
 * Хук для отправки голоса в текущем раунде.
 *
 * Возвращает useMutation для POST /rooms/:roomId/vote.
 * После успешной отправки инвалидирует кэш ['room', roomId]
 * для обновления состояния участников.
 *
 * @param roomId — ID комнаты, в которой идёт голосование
 * @returns { mutate, isPending } — функция отправки и статус загрузки
 *
 * Используется в VoteButton и VotingCards.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';
import type { VoteValue } from '@poker/shared';

export function useVote(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vote: VoteValue) => {
      const { data } = await api.post(`/rooms/${roomId}/vote`, { vote });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room', roomId] });
    },
  });
}
