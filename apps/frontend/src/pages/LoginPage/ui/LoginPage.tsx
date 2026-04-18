import { LoginForm } from '@/features/auth';

export function LoginPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Вход</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Войдите, чтобы продолжить работу в Poker Planning.
      </p>
      <div className="mt-6">
        <LoginForm />
      </div>
    </section>
  );
}
