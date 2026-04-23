import { redirect } from 'react-router-dom';
import { SessionManager } from '@/shared/lib/session';

export async function publicOnlyLoader() {
  const token = SessionManager.getToken();

  if (token) {
    return redirect('/dashboard');
  }

  return null;
}
