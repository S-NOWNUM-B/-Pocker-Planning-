/**
 * Страница «404 — не найдено».
 *
 * Используется и как экран для несуществующего маршрута, и как общий
 * route-level error screen для ошибок роутера.
 */
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Button, Card, EmptyState, PageShell } from '@/shared/ui';
import { useSession } from '@/app/providers';

function getErrorContent(error: unknown) {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return {
        title: '404 — страница не найдена',
        description: 'Похоже, ссылка устарела или маршрут был удалён.',
      };
    }

    if (error.status === 405) {
      return {
        title: '405 — метод не разрешён',
        description: 'Попробуйте открыть страницу через навигацию внутри приложения.',
      };
    }

    return {
      title: `${error.status} — ${error.statusText}`,
      description: error.data?.message || 'Попробуйте вернуться назад и открыть страницу заново.',
    };
  }

  return {
    title: '404 — страница не найдена',
    description: 'Похоже, ссылка устарела или маршрут был удалён.',
  };
}

export function NotFoundPage() {
  const error = useRouteError();
  const { isAuthenticated } = useSession();
  const homePath = isAuthenticated ? '/dashboard' : '/';
  const { title, description } = getErrorContent(error);

  return (
    <PageShell
      maxWidth="md"
      className="min-h-[calc(100vh-8.5rem)]"
      contentClassName="flex min-h-[calc(100vh-8.5rem)] items-center justify-center"
    >
      <Card className="w-full border border-border/70 bg-card/92 p-8 shadow-2xl backdrop-blur">
        <EmptyState title={title} description={description} />
        <div className="flex justify-center">
          <Button as={Link} to={homePath} variant="primary">
            Вернуться на главную
          </Button>
        </div>
      </Card>
    </PageShell>
  );
}
