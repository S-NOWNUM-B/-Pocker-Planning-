import { AppProviders } from './app/providers';
import { AppRoutes } from './app/router';
import './app/styles/index.css';

function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}

export default App;
