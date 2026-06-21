import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WeddingDataProvider } from './context/WeddingDataContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WeddingDataProvider>
      <App />
    </WeddingDataProvider>
  </StrictMode>,
);
