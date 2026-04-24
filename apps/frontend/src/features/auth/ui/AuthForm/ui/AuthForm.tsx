import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useActionData, useNavigation, useSubmit } from 'react-router-dom';
import type { z } from 'zod';
import { Button, Input } from '@/shared/ui';
import { LoginSchema, RegisterSchema } from '../../../model/schemas';
import { PasswordInput } from '../../PasswordInput';

interface AuthFormProps {
  mode: 'login' | 'register';
}

type AuthFormValues = {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
};

const loginDefaults = {
  email: '',
  password: '',
};

const registerDefaults = {
  email: '',
  name: '',
  password: '',
  confirmPassword: '',
};

export function AuthForm({ mode }: AuthFormProps) {
  const navigation = useNavigation();
  const actionData = useActionData() as { error?: string } | undefined;
  const submit = useSubmit();

  const schema = useMemo(() => (mode === 'login' ? LoginSchema : RegisterSchema), [mode]);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: mode === 'login' ? loginDefaults : registerDefaults,
  });

  const isRegister = mode === 'register';
  const submitAction = isRegister ? '/register' : '/login';
  const isSubmitting = navigation.state === 'submitting';

  const handleValidSubmit = (values: AuthFormValues) => {
    const formData = new FormData();

    formData.append('email', values.email);
    formData.append('password', values.password);

    if (isRegister) {
      formData.append('name', values.name || '');
      formData.append('confirmPassword', values.confirmPassword || '');
    }

    submit(formData, { method: 'post', action: submitAction });
  };

  return (
    <form noValidate onSubmit={form.handleSubmit(handleValidSubmit)} className="space-y-4">
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
          autoComplete="name"
          placeholder="Иван Петров"
          error={form.formState.errors.name?.message}
          disabled={isSubmitting}
          {...form.register('name')}
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

      {actionData?.error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {actionData.error}
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
