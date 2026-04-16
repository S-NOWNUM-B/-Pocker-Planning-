/**
 * LoginForm — форма входа.
 *
 * Поля:
 *  - email
 *  - пароль
 *
 * Возможности:
 *  - Валидация через Zod
 *  - Отображение ошибок валидации под полями
 *  - Обработка loading состояния
 *  - Отображение ошибок сервера
 *  - Ссылка на страницу регистрации
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Card } from '@/shared/ui/Card';
import { useSession } from '@/app/providers';
import { loginSchema, type LoginFormData } from '../validation';

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error;
  }

  return fallback;
}

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useSession();
  const [serverError, setServerError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError('');
      setIsLoading(true);
      await login(data as Required<LoginFormData>);
      navigate('/dashboard');
    } catch (error: unknown) {
      let message = getErrorMessage(error, 'Ошибка при входе. Проверьте email и пароль.');
      if (message === 'Network Error' || message.includes('ERR_CONNECTION')) {
        message = 'Ошибка соединения. Убедитесь, что сервер запущен и доступен.';
      }
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Вход</h1>
          <p className="mt-1 text-sm text-muted-foreground">Введите свои учётные данные</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            error={errors.email?.message}
            disabled={isLoading}
            {...register('email')}
          />

          <Input
            label="Пароль"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            disabled={isLoading}
            {...register('password')}
          />

          {serverError && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{serverError}</p>
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Загрузка...' : 'Войти'}
          </Button>
        </form>

        <div className="border-t border-border/50 pt-4 text-center text-sm text-muted-foreground">
          Нет аккаунта?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Зарегистрируйтесь
          </Link>
        </div>
      </div>
    </Card>
  );
}
