/**
 * Страница создания комнаты.
 *
 * Содержит форму для быстрого старта сессии:
 *  - Название комнаты
 *  - Имя пользователя (модератора)
 *  - Выбор колоды (Фибоначчи или Чётная)
 *
 * После заполнения формы сохраняет GameSession в localStorage
 * и перенаправляет на /room/:roomId.
 *
 * Доступна без авторизации. Основной вход для неавторизованных пользователей.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input, PageShell, RadioGroup } from '@/shared/ui';
import { LinkIcon, PlayIcon, TrophyIcon, UsersIcon } from '@/shared/ui/icons';
import { createRoomId, type DeckType, type GameSession } from '@/shared/lib/poker';

const DECK_INFO: Record<DeckType, { title: string; description: string }> = {
  fibonacci: {
    title: 'Фибоначчи',
    description: '0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?, ☕',
  },
  even: {
    title: 'Чётная',
    description: '0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, ?, ☕',
  },
};

export function CreateRoomPage() {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const [deckType, setDeckType] = useState<DeckType>('fibonacci');

  const canStart = Boolean(roomName.trim() && userName.trim());

  const handleStart = () => {
    if (!canStart) {
      return;
    }

    const session: GameSession = {
      roomId: createRoomId(roomName),
      roomName: roomName.trim(),
      userName: userName.trim(),
      deckType,
    };

    window.localStorage.setItem('poker-planning:session', JSON.stringify(session));
    navigate(`/room/${session.roomId}`);
  };

  return (
    <PageShell
      maxWidth="xl"
      className="min-h-[calc(100vh-8.5rem)]"
      contentClassName="flex min-h-[calc(100vh-8.5rem)] flex-col justify-center"
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tight text-foreground sm:text-6xl">
              Planning Poker
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Создайте комнату, выберите колоду, войдите в раунд и оценивайте задачи в одном потоке
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border border-border/70 bg-card/90 p-4 shadow-sm backdrop-blur">
              <TrophyIcon className="mb-3 h-5 w-5 text-primary" />
              <div className="text-sm font-semibold text-foreground">Быстрый старт</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Одна форма и переход в комнату
              </div>
            </Card>
            <Card className="border border-border/70 bg-card/90 p-4 shadow-sm backdrop-blur">
              <UsersIcon className="mb-3 h-5 w-5 text-primary" />
              <div className="text-sm font-semibold text-foreground">Комнатный сценарий</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Подходит для модератора и команды
              </div>
            </Card>
            <Card className="border border-border/70 bg-card/90 p-4 shadow-sm backdrop-blur">
              <LinkIcon className="mb-3 h-5 w-5 text-primary" />
              <div className="text-sm font-semibold text-foreground">Ссылка на комнату</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Сохраняется в браузере и повторно открывается
              </div>
            </Card>
          </div>
        </section>

        <Card className="border border-border/70 bg-card/92 p-6 shadow-2xl backdrop-blur sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <PlayIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Создать комнату</h2>
              <p className="text-sm text-muted-foreground">Заполните данные и начните сессию</p>
            </div>
          </div>

          <div className="space-y-5">
            <Input
              label="Название комнаты"
              placeholder="Sprint planning"
              value={roomName}
              onChange={(event) => setRoomName(event.target.value)}
            />

            <Input
              label="Ваше имя"
              placeholder="Алексей"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
            />

            <RadioGroup
              label="Колода карт"
              value={deckType}
              onChange={setDeckType}
              options={(
                Object.entries(DECK_INFO) as Array<[DeckType, (typeof DECK_INFO)[DeckType]]>
              ).map(([value, deck]) => ({
                value,
                title: deck.title,
                description: deck.description,
              }))}
            />

            <Button
              type="button"
              onClick={handleStart}
              disabled={!canStart}
              className="h-12 w-full text-base font-semibold"
            >
              <PlayIcon className="h-4 w-4" />
              Начать игру
            </Button>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
