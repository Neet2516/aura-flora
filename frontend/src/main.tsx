import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker with offline caching
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.info('[PWA] New version ready.');
  },
  onOfflineReady() {
    console.info('[PWA] App is ready for offline operation.');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
