/**
 * RegisterForm — форма регистрации.
 *
 * Поля:
 *  - имя (минимум 2 символа)
 *  - email
 *  - пароль (с требованиями)
 *  - подтверждение пароля
 *
 * Возможности:
 *  - Валидация через Zod с проверкой требований пароля
 *  - Ошибки валидации отмечены красным
 *  - Требования к паролю показаны в реальном времени
 *  - Обработка loading состояния
 *  - Отображение ошибок сервера (например, email уже зарегистрирован)
 *  - Ссылка на страницу входа
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Card } from '@/shared/ui/Card';
import { useSession } from '@/app/providers';
import { PasswordInput } from './PasswordInput';
import { registerSchema, type RegisterFormData } from '../validation';

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error;
  }

  return fallback;
}

export function RegisterForm() {
  const navigate = useNavigate();
  const { register: registerUser } = useSession();
  const [serverError, setServerError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const passwordValue = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError('');
      setIsLoading(true);
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate('/dashboard');
    } catch (error: unknown) {
      let message = getErrorMessage(
        error,
        'Ошибка при регистрации. Возможно, этот email уже зарегистрирован.',
      );
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
          <h1 className="text-2xl font-bold text-foreground">Регистрация</h1>
          <p className="mt-1 text-sm text-muted-foreground">Создайте новый аккаунт</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Имя"
            type="text"
            placeholder="Иван Петров"
            error={errors.name?.message}
            disabled={isLoading}
            {...register('name')}
          />

          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            error={errors.email?.message}
            disabled={isLoading}
            {...register('email')}
          />

          <PasswordInput
            label="Пароль"
            placeholder="••••••••"
            error={errors.password?.message}
            disabled={isLoading}
            value={passwordValue}
            showRequirements
            {...register('password')}
          />

          <Input
            label="Подтверждение пароля"
            type="password"
            placeholder="••••••••"
            error={errors.passwordConfirm?.message}
            disabled={isLoading}
            {...register('passwordConfirm')}
          />

          {serverError && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{serverError}</p>
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
          </Button>
        </form>

        <div className="border-t border-border/50 pt-4 text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Войдите в систему
          </Link>
        </div>
      </div>
    </Card>
  );
}
