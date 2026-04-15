/**
 * Страница «404 — не найдено».
 *
 * Отображается при переходе по несуществующему маршруту.
 * Содержит сообщение об ошибке и кнопку возврата на главную страницу.
 *
 * Уже реализована — изменений не требует.
 */
import { Link } from 'react-router-dom';
import { Button, EmptyState } from '@/shared/ui';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-5">
      <EmptyState
        title="404 - Страница не найдена"
        description="Страница, которую вы ищете, не существует"
      />
      <Link to="/">
        <Button variant="primary">Вернуться на главную</Button>
      </Link>
    </div>
  );
}
