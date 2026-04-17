/**
 * Страница профиля пользователя.
 *
 * Должна содержать:
 *  - Отображение текущего имени и email
 *  - Форму редактирования имени
 *  - Форму смены пароля (текущий + новый + подтверждение)
 *  - Кнопку выхода из аккаунта
 *
 * Действия:
 *  - Изменение имени → PATCH /auth/profile
 *  - Смена пароля → POST /auth/change-password
 *  - Выход → очистка токенов через SessionManager + редирект на /
 */
import { Button, Card, PageShell } from '@/shared/ui';

export function ProfilePage() {
  return (
    <PageShell maxWidth="lg" className="min-h-[calc(100vh-8.5rem)]">
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Профиль</h1>
          <p className="mt-1 text-sm text-muted-foreground">Управление настройками аккаунта</p>
        </div>

        <Card className="border border-border/70 bg-card/90 p-6 shadow-lg backdrop-blur">
          <h2 className="text-lg font-semibold text-foreground">Основные данные</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Форма редактирования имени и email появится здесь.
          </p>
        </Card>

        <Card className="border border-border/70 bg-card/90 p-6 shadow-lg backdrop-blur">
          <h2 className="text-lg font-semibold text-foreground">Безопасность</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Блок смены пароля и настройки сессий.
          </p>
          <Button className="mt-4" variant="outline">
            Выйти из аккаунта
          </Button>
        </Card>
      </section>
    </PageShell>
  );
}
