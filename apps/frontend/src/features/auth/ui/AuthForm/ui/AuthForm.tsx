import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import type { z } from 'zod';
import { useSession } from '@/app/providers';
import { Button, Input } from '@/shared/ui';
import { LoginSchema, RegisterSchema } from '../../../model/schemas';
import { PasswordInput } from '../../PasswordInput';

interface AuthFormProps {
  mode: 'login' | 'register';
}

type AuthFormValues = {
  email: string;
  password: string;
  username?: string;
  confirmPassword?: string;
};

const loginDefaults = {
  email: '',
  password: '',
};

const registerDefaults = {
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
};

export function AuthForm({ mode }: AuthFormProps) {
  const navigate = useNavigate();
  const { login, register } = useSession();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const schema = useMemo(() => (mode === 'login' ? LoginSchema : RegisterSchema), [mode]);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(schema),
    defaultValues: mode === 'login' ? loginDefaults : registerDefaults,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      if (mode === 'login') {
        const loginValues = values as z.infer<typeof LoginSchema>;
        await login(loginValues);
      } else {
        const registerValues = values as z.infer<typeof RegisterSchema>;
        await register({
          email: registerValues.email,
          username: registerValues.username,
          password: registerValues.password,
        });
      }

      navigate('/dashboard', { replace: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Произошла ошибка. Попробуйте ещё раз';
      setSubmitError(message);
    }
  });

  const isRegister = mode === 'register';
  const isSubmitting = form.formState.isSubmitting;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={form.formState.errors.email?.message}
        disabled={isSubmitting}
        {...form.register('email')}
      />

      {isRegister && (
        <Input
          label="Имя пользователя"
          type="text"
          autoComplete="username"
          placeholder="ivan.petrov"
          error={form.formState.errors.username?.message}
          disabled={isSubmitting}
          {...form.register('username')}
        />
      )}

      <PasswordInput
        label="Пароль"
        autoComplete={isRegister ? 'new-password' : 'current-password'}
        placeholder="••••••••"
        error={form.formState.errors.password?.message}
        disabled={isSubmitting}
        showRequirements={isRegister}
        {...form.register('password')}
      />

      {isRegister && (
        <PasswordInput
          label="Подтверждение пароля"
          autoComplete="new-password"
          placeholder="••••••••"
          error={form.formState.errors.confirmPassword?.message}
          disabled={isSubmitting}
          showRequirements={false}
          {...form.register('confirmPassword')}
        />
      )}

      {submitError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {submitError}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Отправка...' : isRegister ? 'Зарегистрироваться' : 'Войти'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {isRegister ? 'Уже есть аккаунт? ' : 'Нет аккаунта? '}
        <Link
          to={isRegister ? '/login' : '/register'}
          className="font-medium text-primary hover:text-primary/80"
        >
          {isRegister ? 'Войти' : 'Зарегистрироваться'}
        </Link>
      </p>
    </form>
  );
}
