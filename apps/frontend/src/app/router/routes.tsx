import { Routes, Route } from 'react-router-dom';
import { AuthLayout } from '@/app/layouts';
import { AuthGuard, PublicOnlyGuard } from '@/app/router/guards';
import {
  OnboardingPage,
  CreateRoomPage,
  JoinRoomPage,
  InvitePage,
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
      {/* Публичные маршруты */}
      <Route path="/" element={<OnboardingPage />} />
      <Route path="/create-room" element={<CreateRoomPage />} />
      <Route path="/join-room" element={<JoinRoomPage />} />
      <Route path="/invite/:token" element={<InvitePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/room/:roomId" element={<RoomPage />} />

      {/* Маршруты авторизации — доступны только неавторизованным */}
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

      {/* Защищённые маршруты — доступны только авторизованным */}
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

      {/* Запасной маршрут — 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
