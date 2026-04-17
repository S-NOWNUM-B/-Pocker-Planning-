/**
 * Лендинг — альтернативная приветственная страница.
 *
 * В настоящее время не используется в роутере.
 * Роль приветственной страницы выполняет OnboardingPage на маршруте /.
 *
 * Может быть использована в будущем для A/B-тестирования
 * или как отдельная маркетинговая страница.
 */
import { Button, Card, PageShell } from '@/shared/ui';
import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <PageShell maxWidth="xl" className="min-h-[calc(100vh-8.5rem)]">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border border-border/70 bg-card/90 p-8 shadow-xl backdrop-blur">
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Оценка задач без хаоса
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Единый рабочий ритм для команды: обсуждение, голосование, вскрытие, фиксация.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button as={Link} to="/create-room">Создать комнату</Button>
            <Button as={Link} to="/about" variant="outline">
              О проекте
            </Button>
          </div>
        </Card>

        <Card className="border border-border/70 bg-card/85 p-6 shadow-lg backdrop-blur">
          <h2 className="text-lg font-bold text-foreground">Что уже доступно</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Голосование по задачам в одном интерфейсе.</li>
            <li>Гибкий выбор колоды карт.</li>
            <li>Переключение светлой и тёмной темы.</li>
            <li>Стабильная визуальная система для всех страниц.</li>
          </ul>
        </Card>
      </section>
    </PageShell>
  );
}
