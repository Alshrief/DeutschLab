import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { I18nProvider } from './i18n/I18nContext.js';
import './index.css';

// Manage Service Worker: active only in production, clean & unregister in development
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('✅ DeutschLab PWA Service Worker Registered', reg))
        .catch((err) => console.warn('PWA Registration failed:', err));
    });
  } else {
    // In dev mode (Vite), unregister any active service worker so it never intercepts /src/ or throws 500 errors
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const reg of registrations) {
        reg.unregister().then(() => {
          console.log('🧹 Unregistered dev service worker successfully');
        });
      }
    });

    // Clear stale caches in dev
    if ('caches' in window) {
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name);
        }
      });
    }
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
