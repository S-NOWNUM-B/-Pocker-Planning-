import { type ReactNode } from 'react';
import { Card, PageShell } from '@/shared/ui';

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Лейаут для страниц авторизации (login, register).
 * Использует Tailwind CSS для центрирования и стилизации фона.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <PageShell
      maxWidth="md"
      className="min-h-[calc(100vh-8.5rem)]"
      contentClassName="flex min-h-[calc(100vh-8.5rem)] items-center justify-center"
    >
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center">
          <h2 className="text-center text-3xl font-black tracking-tight text-foreground">
            Poker Planning
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Оценивайте задачи вместе с командой
          </p>
        </div>
        <Card className="rounded-2xl border border-border/70 bg-card/92 p-8 shadow-xl backdrop-blur">
          {children}
        </Card>
      </div>
    </PageShell>
  );
}
