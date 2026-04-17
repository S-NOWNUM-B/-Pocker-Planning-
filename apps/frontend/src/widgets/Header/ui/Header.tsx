import { Link, useMatch } from 'react-router-dom';
import { useTheme } from '@/shared/lib/hooks';
import { Button, Card } from '@/shared/ui';
import { MoonIcon, SunIcon } from '@/shared/ui/icons';
import { sizeClasses, variantClasses } from '@/shared/ui/Button/Button';

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
      <Card className="mx-auto flex max-w-7xl items-center justify-end gap-2 rounded-none border-0 bg-transparent px-4 py-3 shadow-none sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {showAuthButtons && (
            <>
              <Link
                to="/login"
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 font-inherit font-medium ${variantClasses.outline} ${sizeClasses.md}`}
              >
                Войти
              </Link>
              <Link
                to="/register"
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 font-inherit font-medium ${variantClasses.primary} ${sizeClasses.md}`}
              >
                Регистрация
              </Link>
            </>
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
      </Card>
    </header>
  );
}
