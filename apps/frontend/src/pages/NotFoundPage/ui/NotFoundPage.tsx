/**
 * Страница «404 — не найдено».
 *
 * Отображается при переходе по несуществующему маршруту.
 * Содержит сообщение об ошибке и кнопку возврата на главную страницу.
 *
 * Уже реализована — изменений не требует.
 */
import { Link } from 'react-router-dom';
import { Button, Card, EmptyState, PageShell } from '@/shared/ui';

export function NotFoundPage() {
  return (
    <PageShell
      maxWidth="md"
      className="min-h-[calc(100vh-8.5rem)]"
      contentClassName="flex min-h-[calc(100vh-8.5rem)] items-center justify-center"
    >
      <Card className="w-full border border-border/70 bg-card/92 p-8 shadow-2xl backdrop-blur">
        <EmptyState
          title="404 — страница не найдена"
          description="Похоже, ссылка устарела или маршрут был удалён"
        />
        <div className="flex justify-center">
          <Button as={Link} to="/" variant="primary">
            Вернуться на главную
          </Button>
        </div>
      </Card>
    </PageShell>
  );
}
