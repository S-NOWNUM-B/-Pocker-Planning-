/**
 * Шапка игровой комнаты.
 *
 * Верхняя панель RoomPage. Содержит:
 *  - Название комнаты и ID
 *  - Бейдж выбранной колоды
 *  - Кнопку копирования ссылки для приглашения
 *  - Кнопку выхода из комнаты
 *  - Переключатель темы
 *
 * Прикрепляется к верху экрана (sticky).
 *
 * @param roomName — название комнаты
 * @param roomId — ID комнаты
 * @param deckName — название колоды
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/shared/lib/hooks';
import { Button, Card, Switch } from '@/shared/ui';
import { LinkIcon, LogOutIcon, MoonIcon, SparklesIcon, SunIcon } from '@/shared/ui/icons';

interface RoomHeaderProps {
  roomName: string;
  roomId: string;
  deckName: string;
}

export function RoomHeader({ roomName, roomId, deckName }: RoomHeaderProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1800);
    } catch {
      return;
    }
  };

  const handleExitRoom = () => {
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-card/88 backdrop-blur-xl">
      <Card className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-none border-0 bg-transparent px-4 py-3 shadow-none sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <SparklesIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-lg font-bold text-foreground">{roomName}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="truncate">/{roomId}</span>
              <span className="rounded-full border border-border bg-secondary/45 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-foreground/90">
                {deckName}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyLink}
            className="h-10 rounded-xl px-3"
          >
            <LinkIcon className="h-4 w-4" />
            <span className="hidden sm:inline">
              {copyState === 'copied' ? 'Скопировано' : 'Пригласить'}
            </span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleExitRoom}
            className="h-10 rounded-xl border-primary/60 px-3 text-foreground hover:border-destructive/75 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOutIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Выйти</span>
          </Button>
          <div className="flex h-10 items-center gap-2 rounded-xl border border-border bg-card/70 px-3">
            {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            <Switch
              checked={theme === 'dark'}
              onChange={(isDark) => setTheme(isDark ? 'dark' : 'light')}
              label="Переключить тему"
            />
            <span className="hidden text-left text-sm sm:inline sm:min-w-30">
              {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
            </span>
          </div>
        </div>
      </Card>
    </header>
  );
}
