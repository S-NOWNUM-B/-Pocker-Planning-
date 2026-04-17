/**
 * Страница «О проекте» — информация о Poker Planning.
 *
 * Должна содержать:
 *  - Описание проекта и его предназначения
 *  - Секцию «Как играть» — правила Planning Poker
 *  - FAQ — ответы на частые вопросы
 *  - Ссылки на документацию и исходный код
 *
 * Эта страница носит информационный характер и доступна без авторизации.
 */
import { Card, PageShell } from '@/shared/ui';

export function AboutPage() {
  return (
    <PageShell maxWidth="xl" className="min-h-[calc(100vh-8.5rem)]">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border border-border/70 bg-card/90 p-8 shadow-xl backdrop-blur">
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">О проекте</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Poker Planning помогает команде оценивать задачи без предвзятости: каждый голосует
            независимо, а результат обсуждается только после вскрытия карт.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Интерфейс адаптирован под командную работу, быстрые раунды и прозрачный процесс
            принятия оценки.
          </p>
        </Card>

        <Card className="border border-border/70 bg-card/85 p-6 shadow-lg backdrop-blur">
          <h2 className="text-lg font-bold text-foreground">Как проходит раунд</h2>
          <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>1. Модератор добавляет задачу в комнате.</li>
            <li>2. Участники выбирают карты независимо друг от друга.</li>
            <li>3. Результаты вскрываются и обсуждаются расхождения.</li>
            <li>4. Итог фиксируется и команда переходит к следующей задаче.</li>
          </ol>
        </Card>
      </section>
    </PageShell>
  );
}
