import { Link } from 'react-router-dom';
import { JoinRoomForm } from '@/features';
import { Card, PageShell, Button } from '@/shared/ui';

export function JoinRoomPage() {
  return (
    <PageShell
      maxWidth="lg"
      className="min-h-[calc(100vh-8.5rem)]"
      contentClassName="flex min-h-[calc(100vh-8.5rem)] flex-col justify-center"
    >
      <Card className="mx-auto w-full max-w-xl border border-border/70 bg-card/92 p-6 shadow-2xl backdrop-blur sm:p-8">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Присоединиться к комнате</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Введите 4-буквенный код комнаты, который вам отправил создатель.
        </p>

        <div className="mt-6">
          <JoinRoomForm />
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
          <span className="text-xs text-muted-foreground">Нет кода комнаты?</span>
          <Button as={Link} to="/create-room" variant="outline" size="sm">
            Создать свою
          </Button>
        </div>
      </Card>
    </PageShell>
  );
}
