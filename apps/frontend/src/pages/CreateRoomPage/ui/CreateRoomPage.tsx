/**
 * Страница создания комнаты.
 *
 * Содержит форму для быстрого старта сессии:
 *  - Название комнаты
 *  - Автоматическое имя создателя из текущего профиля
 *  - Выбор колоды (Фибоначчи или Чётная)
 *
 * После заполнения формы сохраняет GameSession в localStorage
 * и перенаправляет на /room/:roomId.
 *
 * Доступна без авторизации. Основной вход для неавторизованных пользователей.
 */
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/app/providers';
import { Button, Card, Input, PageShell, RadioGroup } from '@/shared/ui';
import { LinkIcon, PlayIcon, TrophyIcon, UsersIcon } from '@/shared/ui/icons';
import { roomApi } from '@/entities/room';
import { type DeckType, type GameSession, SESSION_STORAGE_KEY } from '@/shared/lib/poker';

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
  const queryClient = useQueryClient();
  const { user } = useSession();
  const [roomName, setRoomName] = useState('');
  const [deckType, setDeckType] = useState<DeckType>('fibonacci');
  const creatorName = user?.name?.trim() || 'Гость';

  const canStart = Boolean(roomName.trim());

  const createRoomMutation = useMutation({
    mutationFn: () => roomApi.createRoom(roomName.trim(), deckType),
    onSuccess: (snapshot) => {
      const session: GameSession = {
        roomId: snapshot.room.slug,
        roomName: snapshot.room.name,
        userName: creatorName,
        deckType,
        ownerId: snapshot.room.owner_id,
        ownerName: creatorName,
      };

      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      navigate(`/room/${snapshot.room.slug}`);
    },
  });

  const handleStart = () => {
    if (!canStart || createRoomMutation.isPending) {
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    createRoomMutation.mutate();
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
            <Card className="border border-border/70 bg-secondary/35 p-3 shadow-none">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Создатель комнаты
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground">{creatorName}</div>
            </Card>

            <Input
              label="Название комнаты"
              placeholder="Sprint planning"
              value={roomName}
              onChange={(event) => setRoomName(event.target.value)}
              disabled={createRoomMutation.isPending}
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
              disabled={!canStart || createRoomMutation.isPending}
              className="h-12 w-full text-base font-semibold"
            >
              <PlayIcon className="h-4 w-4" />
              {createRoomMutation.isPending ? 'Создаём комнату...' : 'Начать игру'}
            </Button>
            {createRoomMutation.isError && (
              <p className="text-sm text-destructive">
                Не удалось создать комнату. Проверьте авторизацию и попробуйте снова.
              </p>
            )}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
