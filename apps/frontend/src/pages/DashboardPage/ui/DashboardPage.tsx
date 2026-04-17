/**
 * Дашборд пользователя — список всех комнат.
 *
 * Должна отображать две секции:
 *  1. Активные комнаты — где пользователь является модератором или участником
 *     и сессия ещё не завершена.
 *  2. Завершённые сессии — история с датами, названиями комнат и результатами.
 *
 * Данные загружаются через TanStack Query (GET /rooms).
 * Каждая карточка комнаты содержит:
 *  - Название комнаты
 *  - Статус (ожидание / голосование / завершена)
 *  - Количество участников
 *  - Дату создания
 *  - Кнопку «Открыть» для перехода в комнату
 *
 * Также должна быть кнопка «Создать комнату» → переход на /create-room
 */
import { Link } from 'react-router-dom';
import { Button, Card, PageShell } from '@/shared/ui';

export function DashboardPage() {
  return (
    <PageShell className="min-h-[calc(100vh-8.5rem)]">
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ваши активные и завершённые комнаты
            </p>
          </div>
          <Button as={Link} to="/create-room">
            Создать комнату
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border border-border/70 bg-card/90 p-6 shadow-lg backdrop-blur">
            <h2 className="text-lg font-semibold text-foreground">Активные комнаты</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Здесь будут комнаты, где оценка ещё не завершена.
            </p>
          </Card>
          <Card className="border border-border/70 bg-card/90 p-6 shadow-lg backdrop-blur">
            <h2 className="text-lg font-semibold text-foreground">История сессий</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Здесь появятся завершённые сессии с результатами.
            </p>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}
