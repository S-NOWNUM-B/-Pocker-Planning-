import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppProviders } from './app/providers';
import { router } from './app/router';
import './app/styles/index.css';

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </AppProviders>
  );
}

export default App;
