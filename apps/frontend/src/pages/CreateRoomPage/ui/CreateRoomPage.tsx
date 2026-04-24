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
import { loginAsGuest } from '@/entities/user';
import type { ApiError } from '@/shared/api';
import { Button, Card, Input, PageShell } from '@/shared/ui';
import { LinkIcon, PlayIcon, TrophyIcon, UsersIcon } from '@/shared/ui/icons';
import { roomApi } from '@/entities/room';
import { DECK_LABELS, type DeckType, type GameSession, SESSION_STORAGE_KEY } from '@/shared/lib/poker';

const DECK_OPTIONS: Array<{ value: DeckType; title: string; description: string }> = [
  {
    value: 'fibonacci',
    title: DECK_LABELS.fibonacci,
    description: '0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?, ☕',
  },
  {
    value: 'even',
    title: DECK_LABELS.even,
    description: '0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, ?, ☕',
  },
  {
    value: 'tshirt',
    title: DECK_LABELS.tshirt,
    description: 'XS, S, M, L, XL, XXL, ?, ☕',
  },
];

const DECK_DETAILS: Record<DeckType, { title: string; description: string }> = {
  fibonacci: DECK_OPTIONS[0],
  even: DECK_OPTIONS[1],
  tshirt: DECK_OPTIONS[2],
};

const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    'error' in error &&
    'message' in error
  );
};

const hasCyrillic = (text: string): boolean => /[А-Яа-яЁё]/.test(text);

const getRussianCreateRoomErrorMessage = (error: unknown): string => {
  const fallbackMessage = 'Не удалось создать комнату. Попробуйте ещё раз через несколько секунд.';

  if (isApiError(error)) {
    const originalMessage = (error.message || '').trim();
    const normalized = originalMessage.toLowerCase();

    if (
      normalized.includes('network error') ||
      normalized.includes('failed to fetch') ||
      normalized.includes('cors')
    ) {
      return 'Сервер временно недоступен. Проверьте подключение и попробуйте снова.';
    }

    if (error.statusCode === 401 || error.statusCode === 403) {
      return 'Недостаточно прав для создания комнаты. Обновите страницу и попробуйте снова.';
    }

    if (error.statusCode >= 500) {
      return 'На сервере произошла ошибка. Попробуйте создать комнату чуть позже.';
    }

    if (originalMessage) {
      return hasCyrillic(originalMessage) ? originalMessage : fallbackMessage;
    }

    return fallbackMessage;
  }

  if (error instanceof Error) {
    const normalized = error.message.toLowerCase();
    if (
      normalized.includes('network error') ||
      normalized.includes('failed to fetch') ||
      normalized.includes('cors')
    ) {
      return 'Сервер временно недоступен. Проверьте подключение и попробуйте снова.';
    }
  }

  return fallbackMessage;
};

export function CreateRoomPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSession();
  const [roomName, setRoomName] = useState('');
  const [deckType, setDeckType] = useState<DeckType>('fibonacci');
  const creatorName = user?.name?.trim() || 'Гость';
  const trimmedRoomName = roomName.trim();
  const selectedDeck = DECK_DETAILS[deckType];

  const isRoomNameValid = trimmedRoomName.length >= 3 && trimmedRoomName.length <= 120;
  const canStart = isRoomNameValid;

  const getSession = (): GameSession | null => {
    const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as GameSession;
    } catch {
      return null;
    }
  };

  const ensureRoomAccessToken = async (): Promise<{ token?: string; guestName?: string }> => {
    if (user) {
      return {};
    }

    const existingSession = getSession();
    if (existingSession?.roomAccessToken) {
      return { token: existingSession.roomAccessToken, guestName: existingSession.userName };
    }

    try {
      const guestAuth = await loginAsGuest({ name: creatorName });
      return { token: guestAuth.access_token, guestName: guestAuth.user.name };
    } catch {
      // Fallback: backend guest-auth can fail independently (e.g. CORS/500),
      // while room creation may still be available for public onboarding flow.
      return {};
    }
  };

  const createRoomMutation = useMutation({
    mutationFn: async () => {
      const roomAccess = await ensureRoomAccessToken();
      const snapshot = await roomApi.createRoom(trimmedRoomName, deckType, roomAccess.token);
      return { snapshot, roomAccessToken: roomAccess.token, guestName: roomAccess.guestName };
    },
    onSuccess: ({ snapshot, roomAccessToken, guestName }) => {
      const session: GameSession = {
        roomId: snapshot.room.slug,
        roomName: snapshot.room.name,
        userName: user?.name?.trim() || guestName || creatorName,
        deckType,
        ownerId: snapshot.room.owner_id,
        ownerName: user?.name?.trim() || guestName || creatorName,
        roomAccessToken,
        selfParticipantId: snapshot.self_participant_id,
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

    createRoomMutation.mutate();
  };

  const mutationError = createRoomMutation.error;
  const createRoomErrorMessage = createRoomMutation.isError
    ? getRussianCreateRoomErrorMessage(mutationError)
    : null;

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
              error={
                trimmedRoomName.length > 0 && trimmedRoomName.length < 3
                  ? 'Минимум 3 символа'
                  : undefined
              }
            />

            <div className="space-y-2">
              <label htmlFor="deck-type" className="text-sm font-medium text-muted-foreground">
                Колода карт
              </label>
              <div className="rounded-2xl border border-border/70 bg-card/90 p-4 shadow-sm">
                <select
                  id="deck-type"
                  value={deckType}
                  onChange={(event) => setDeckType(event.target.value as DeckType)}
                  className="w-full rounded-xl border border-border/70 bg-card px-4 py-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-ring/35"
                >
                  {DECK_OPTIONS.map((deck) => (
                    <option key={deck.value} value={deck.value}>
                      {deck.title}
                    </option>
                  ))}
                </select>

                <div className="mt-3 rounded-xl border border-border/70 bg-secondary/35 p-3">
                  <div className="text-sm font-semibold text-foreground">{selectedDeck.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{selectedDeck.description}</div>
                </div>
              </div>
            </div>

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
                {createRoomErrorMessage}
              </p>
            )}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
