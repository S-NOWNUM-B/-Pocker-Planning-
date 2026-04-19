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
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/shared/lib/hooks';
import { Button, Card, Switch } from '@/shared/ui';
import { LinkIcon, LogOutIcon, MoonIcon, SunIcon, TrophyIcon, UsersIcon } from '@/shared/ui/icons';

interface RoomHeaderProps {
  roomName: string;
  roomId: string;
  deckName: string;
  inviteLink?: string | null;
}

export function RoomHeader({ roomName, roomId, deckName, inviteLink }: RoomHeaderProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink || window.location.href);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1800);
    } catch {
      return;
    }
  };

  const handleExitRoom = () => {
    navigate('/dashboard');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-card/88 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <TrophyIcon className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-foreground">
              Poker<span className="text-primary">.</span>Planning
            </span>
          </Link>

          <div className="hidden min-w-0 items-center gap-2 text-xs text-muted-foreground md:flex">
            <span className="max-w-56 truncate font-semibold text-foreground/90">{roomName}</span>
            <span className="text-muted-foreground/60">•</span>
            <span className="truncate">/{roomId}</span>
            <span className="rounded-full border border-border bg-secondary/45 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-foreground/90">
              {deckName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyLink}
            className="h-10 px-4"
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
            className="h-10 px-4 border-primary/60 text-foreground hover:border-destructive/75 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOutIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Выйти</span>
          </Button>
          <div className="flex h-10 items-center gap-1.5 rounded-xl border border-border bg-card/70 px-2">
            {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            <Switch
              checked={theme === 'dark'}
              onChange={(isDark) => setTheme(isDark ? 'dark' : 'light')}
              label="Переключить тему"
            />
            <span className="hidden text-left text-xs sm:inline sm:whitespace-nowrap">
              {theme === 'dark' ? 'Светлая' : 'Тёмная'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
