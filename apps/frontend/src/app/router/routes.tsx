import { createBrowserRouter, Outlet } from 'react-router-dom';
import { AuthLayout, RootLayout } from '@/app/layouts';
import { authLoader, publicOnlyLoader } from './loaders';
import { loginAction, registerAction } from './actions';
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

function AuthLayoutWrapper() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <OnboardingPage />,
      },
      {
        path: '/create-room',
        element: <CreateRoomPage />,
      },
      {
        path: '/join-room',
        element: <JoinRoomPage />,
      },
      {
        path: '/invite/:token',
        element: <InvitePage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/room/:roomId',
        element: <RoomPage />,
      },
      {
        path: '/login',
        loader: publicOnlyLoader,
        action: loginAction,
        element: <AuthLayoutWrapper />,
        children: [
          {
            index: true,
            element: <LoginPage />,
          },
        ],
      },
      {
        path: '/register',
        loader: publicOnlyLoader,
        action: registerAction,
        element: <AuthLayoutWrapper />,
        children: [
          {
            index: true,
            element: <RegisterPage />,
          },
        ],
      },
      {
        path: '/dashboard',
        loader: authLoader,
        element: <DashboardPage />,
      },
      {
        path: '/profile',
        loader: authLoader,
        element: <ProfilePage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
