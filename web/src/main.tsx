import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { applyChainTheme } from './lib/chainTheme';
import './styles/global.css';

applyChainTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
