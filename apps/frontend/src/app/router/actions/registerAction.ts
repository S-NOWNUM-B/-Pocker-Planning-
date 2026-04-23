import { redirect } from 'react-router-dom';
import { register as registerRequest } from '@/entities/user';
import { SessionManager } from '@/shared/lib/session';

export async function registerAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  try {
    const authData = await registerRequest({ email, password, name });
    SessionManager.saveToken(authData.access_token);
    return redirect('/dashboard');
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Произошла ошибка при регистрации',
    };
  }
}
