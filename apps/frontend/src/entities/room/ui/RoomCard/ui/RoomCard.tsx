/**
 * Карточка комнаты для дашборда.
 *
 * Отображает:
 *  - Название комнаты
 *  - Статус (через RoomStatusBadge) — опционально, если бэкенд возвращает статус
 *  - Дату создания
 *  - Количество участников
 *  - Кнопку «Открыть»
 *
 * Используется в DashboardPage для списка комнат пользователя.
 */
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/app/providers';
import { Card, Button, Modal, Spinner } from '@/shared/ui';
import { UsersIcon } from '@/shared/ui/icons';
import { roomApi } from '../../../api/roomApi';
import type { RoomListItem } from '../../../model/types';

interface RoomCardProps {
  room: RoomListItem;
}

export function RoomCard({ room }: RoomCardProps) {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  const deleteRoomMutation = useMutation({
    mutationFn: () => roomApi.deleteRoom(room.id),
    onSuccess: () => {
      setIsResultsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  const {
    data: roomSnapshot,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = useQuery({
    queryKey: ['room-history', room.id],
    queryFn: () => roomApi.getRoomSnapshot(room.id),
    enabled: isResultsOpen,
    staleTime: 30_000,
  });

  const formattedDate = new Date(room.created_at).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const roomIdentifier = room.slug;
  const historyItems = roomSnapshot?.history ?? [];
  const isOwner = user?.id === room.owner_id;

  return (
    <Card className="flex flex-col border border-border/70 bg-card/90 p-5 shadow-lg transition-all hover:border-primary/50 hover:shadow-xl">
      <div className="flex flex-1 flex-col space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-lg font-bold text-foreground" title={roomIdentifier}>
            {roomIdentifier}
          </h3>
          <div className="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
            <UsersIcon className="h-4 w-4" />
            <span>{room.participants_count}</span>
          </div>
        </div>

        <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
          {room.name}
        </p>

        {room.active_task_title && (
          <div className="rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
            <span className="font-semibold">Текущая задача:</span> {room.active_task_title}
          </div>
        )}
      </div>

      <div className="mt-5 border-t border-border/50 pt-4">
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
        <div className="mt-3 flex items-center gap-2">
          <Button as={Link} to={`/room/${room.slug}`} size="sm" className="flex-1">
            Войти
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => setIsResultsOpen(true)}
          >
            Результаты
          </Button>
        </div>
        {isOwner && (
          <Button
            type="button"
            size="sm"
            variant="danger"
            className="mt-2 w-full"
            onClick={() => deleteRoomMutation.mutate()}
            disabled={deleteRoomMutation.isPending}
          >
            {deleteRoomMutation.isPending ? 'Удаляем...' : 'Удалить комнату'}
          </Button>
        )}
      </div>

      <Modal
        isOpen={isResultsOpen}
        onClose={() => setIsResultsOpen(false)}
        title={`Результаты комнаты ${roomIdentifier}`}
        className="max-w-3xl"
      >
        {isHistoryLoading ? (
          <div className="flex min-h-40 items-center justify-center">
            <Spinner />
          </div>
        ) : isHistoryError ? (
          <p className="text-sm text-destructive">Не удалось загрузить результаты голосований.</p>
        ) : historyItems.length > 0 ? (
          <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
            {historyItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-border/60 bg-secondary/30 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-foreground">{item.task_title}</h4>
                  <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                    Итог: {item.result_value}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>Голосов: {item.votes_count}</span>
                  <span>
                    Среднее: {item.average_score !== null ? item.average_score : 'n/a'}
                  </span>
                  <span>{item.consensus ? 'Консенсус есть' : 'Без консенсуса'}</span>
                  <span>{new Date(item.created_at).toLocaleString('ru-RU')}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {Object.entries(item.distribution).map(([value, count]) => (
                    <span
                      key={`${item.id}-${value}`}
                      className="rounded-md border border-border/70 bg-card px-2 py-1 text-xs text-foreground"
                    >
                      {value}: {count}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">В этой комнате пока нет завершённых раундов голосования.</p>
        )}
      </Modal>
    </Card>
  );
}
