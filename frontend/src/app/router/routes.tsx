import { Routes, Route } from 'react-router-dom';
import { AuthLayout } from '@/app/layouts';
import { AuthGuard, PublicOnlyGuard } from '@/app/router/guards';
import {
  HomePage,
  CreateRoomPage,
  LoginPage,
  RegisterPage,
  DashboardPage,
  ProfilePage,
  AboutPage,
  RoomPage,
  NotFoundPage,
} from '@/pages';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/create-room" element={<CreateRoomPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/room/:roomId" element={<RoomPage />} />

      {/* Auth routes — only accessible when NOT logged in */}
      <Route
        path="/login"
        element={
          <PublicOnlyGuard>
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          </PublicOnlyGuard>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyGuard>
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          </PublicOnlyGuard>
        }
      />

      {/* Protected routes — only accessible when logged in */}
      <Route
        path="/dashboard"
        element={
          <AuthGuard>
            <DashboardPage />
          </AuthGuard>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthGuard>
            <ProfilePage />
          </AuthGuard>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
