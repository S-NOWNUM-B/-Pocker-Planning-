/**
 * Дашборд пользователя — список всех комнат.
 *
 * Отображает:
 *  - Активные комнаты — где пользователь является участником.
 *  - Кнопки создания и присоединения к комнате.
 *
 * Данные загружаются через TanStack Query (GET /rooms).
 */
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, PageShell, Spinner, EmptyState } from '@/shared/ui';
import { RoomCard, roomApi } from '@/entities/room';

export function DashboardPage() {

  const {
    data: rooms,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['rooms'],
    queryFn: roomApi.listRooms,
  });

  return (
    <PageShell className="min-h-[calc(100vh-8.5rem)]">
      <section className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Мои комнаты</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Управляйте вашими сессиями планирования и оценки
            </p>
          </div>
          <div className="flex gap-3">
            <Button as={Link} to="/create-room">
              Создать комнату
            </Button>

            <Button as={Link} to="/join-room" variant="outline">
              Присоединиться
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-100 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : isError ? (
          <EmptyState
            title="Ошибка загрузки"
            description="Не удалось загрузить список комнат. Попробуйте обновить страницу."
          />
        ) : rooms && rooms.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="У вас пока нет комнат"
            description="Создайте свою первую комнату для оценки задач или присоединитесь к существующей по ссылке."
          />
        )}
      </section>
    </PageShell>
  );
}
