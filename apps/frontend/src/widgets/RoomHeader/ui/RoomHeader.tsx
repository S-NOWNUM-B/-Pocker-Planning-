/**
 * Шапка игровой комнаты.
 *
 * Верхняя панель RoomPage. Содержит:
 *  - Название комнаты и ID
 *  - Бейдж выбранной колоды
 *  - Кнопку переключения темы (тёмная/светлая)
 *  - Кнопку копирования ссылки для приглашения
 *  - Кнопку выхода из комнаты
 *
 * Прикрепляется к верху экрана (sticky).
 *
 * @param roomName — название комнаты
 * @param roomId — ID комнаты
 * @param deckName — название колоды
 * @param theme — текущая тема
 * @param copyLabel — текст кнопки копирования
 * @param onToggleTheme — переключатель темы
 * @param onCopyLink — копирование ссылки
 * @param onExit — выход из комнаты
 */
import { Button, Card } from '@/shared/ui';
import { LinkIcon, LogOutIcon, MoonIcon, SparklesIcon, SunIcon } from '@/shared/ui/icons';
import type { Theme } from '@/shared/lib/poker';

interface RoomHeaderProps {
  roomName: string;
  roomId: string;
  deckName: string;
  theme: Theme;
  copyLabel: string;
  onToggleTheme: () => void;
  onCopyLink: () => void;
  onExit: () => void;
}

export function RoomHeader({
  roomName,
  roomId,
  deckName,
  theme,
  copyLabel,
  onToggleTheme,
  onCopyLink,
  onExit,
}: RoomHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-card/88 backdrop-blur-xl">
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
          <Button type="button" variant="outline" onClick={onToggleTheme} className="h-10 rounded-xl px-3">
            {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            <span className="hidden sm:inline">Тема</span>
          </Button>
          <Button type="button" variant="outline" onClick={onCopyLink} className="h-10 rounded-xl px-3">
            <LinkIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{copyLabel}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onExit}
            className="h-10 rounded-xl border-primary/60 px-3 text-foreground hover:border-destructive/75 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOutIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Выйти</span>
          </Button>
        </div>
      </Card>
    </header>
  );
}
