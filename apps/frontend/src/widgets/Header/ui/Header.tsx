import { Link, useMatch } from 'react-router-dom';
import { useTheme } from '@/shared/lib/hooks';
import { Button } from '@/shared/ui';
import { MoonIcon, SunIcon, TrophyIcon } from '@/shared/ui/icons';
import { baseButtonClasses, sizeClasses, variantClasses } from '@/shared/ui/Button/Button';

interface HeaderProps {
  showAuthButtons?: boolean;
}

export function Header({ showAuthButtons = false }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const isRoomPage = useMatch('/room/:roomId') !== null;

  if (isRoomPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-card/88 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Логотип */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <TrophyIcon className="h-5 w-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-foreground">
            Poker<span className="text-primary">.</span>Planning
          </span>
        </Link>

        {/* Кнопки управления и авторизации */}
        <div className="flex items-center gap-2">
          {showAuthButtons && (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to="/login"
                className={`${baseButtonClasses} h-10 px-4 ${variantClasses.outline} ${sizeClasses.md}`}
              >
                Войти
              </Link>
              <Link
                to="/register"
                className={`${baseButtonClasses} h-10 px-4 ${variantClasses.primary} ${sizeClasses.md}`}
              >
                Регистрация
              </Link>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={toggleTheme}
            className="h-10 rounded-xl px-3"
          >
            {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            <span className="hidden sm:inline">
              {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
