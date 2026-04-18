import { RegisterForm } from '@/features/auth';

export function RegisterPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Регистрация</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Создайте аккаунт, чтобы сохранять сессии оценки и возвращаться к ним позже.
      </p>
      <div className="mt-6">
        <RegisterForm />
      </div>
    </section>
  );
}
