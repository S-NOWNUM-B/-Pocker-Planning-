import { Outlet, useNavigate } from 'react-router-dom';
import { useSession } from '@/app/providers';
import { Footer, Header } from '@/widgets';

export function RootLayout() {
  const { isAuthenticated, isLoading, user, logout } = useSession();
  const navigate = useNavigate();

  const showLoginButton = !isLoading && !isAuthenticated;
  const showRegisterButton = !isLoading && !isAuthenticated;
  const showProfileMenu = !isLoading && isAuthenticated;
  const profileLabel = user?.name || user?.email || 'Профиль';

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <>
      <Header
        showLoginButton={showLoginButton}
        showRegisterButton={showRegisterButton}
        showProfileMenu={showProfileMenu}
        profileLabel={profileLabel}
        onLogout={handleLogout}
      />
      <Outlet />
      <Footer />
    </>
  );
}
