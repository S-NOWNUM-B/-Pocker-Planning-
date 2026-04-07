import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import type { RoomState } from '@poker/shared';
import './styles.css';

const queryClient = new QueryClient();
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1',
});

const App = () => {
  const room: RoomState = {
    id: 'demo',
    name: 'Sprint Planning',
    status: 'waiting',
    participants: [],
  };

  return (
    <div className="container">
      <header>
        <h1>Poker Planning</h1>
        <p>Monorepo setup is ready.</p>
      </header>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/room">Room</Link>
      </nav>

      <Routes>
        <Route path="/" element={<p>API: {api.defaults.baseURL}</p>} />
        <Route path="/room" element={<pre>{JSON.stringify(room, null, 2)}</pre>} />
      </Routes>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
