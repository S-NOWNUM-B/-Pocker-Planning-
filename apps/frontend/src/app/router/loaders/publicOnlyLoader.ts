import { redirect } from 'react-router-dom';
import { SessionManager } from '@/shared/lib/session';
import { getUser } from '@/entities/user';

export async function publicOnlyLoader() {
  const token = SessionManager.getToken();

  if (!token) {
    return null;
  }

  try {
    await getUser();
    return redirect('/dashboard');
  } catch {
    SessionManager.removeToken({ notify: false });
    return null;
  }
}
