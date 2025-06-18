import { BrowserRouter } from 'react-router-dom';
import { SaveProvider } from './contexts/SaveContext';
import AppContent from './components/app/AppContent';

export default function App() {
  return (
    <SaveProvider>
      <BrowserRouter basename="/TBRPG">
        <AppContent />
      </BrowserRouter>
    </SaveProvider>
  );
}
