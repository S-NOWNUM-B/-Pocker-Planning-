import { redirect } from 'react-router-dom';
import { login as loginRequest } from '@/entities/user';
import { SessionManager } from '@/shared/lib/session';

export async function loginAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const authData = await loginRequest({ email, password });
    SessionManager.saveToken(authData.access_token, authData.user);
    return redirect('/dashboard');
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Произошла ошибка при входе',
    };
  }
}
