import { AppProviders } from './app/providers';
import { useSession } from './app/providers';
import { AppRoutes } from './app/router';
import { Footer, Header } from './widgets';
import './app/styles/index.css';

function AppShell() {
  const { isAuthenticated, isLoading, user, logout } = useSession();

  const showLoginButton = !isLoading && !isAuthenticated;
  const showRegisterButton = !isLoading && !isAuthenticated;
  const showProfileMenu = !isLoading && isAuthenticated;
  const profileLabel = user?.name || user?.email || 'Профиль';

  return (
    <>
      <Header
        showLoginButton={showLoginButton}
        showRegisterButton={showRegisterButton}
        showProfileMenu={showProfileMenu}
        profileLabel={profileLabel}
        onLogout={logout}
      />
      <AppRoutes />
      <Footer />
    </>
  );
}

function App() {
  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );
}

export default App;
