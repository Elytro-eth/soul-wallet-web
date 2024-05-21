// import React from 'react';
import ReactDOM from 'react-dom/client';
import { router } from './router.tsx';
import { RouterProvider } from 'react-router-dom';
import { enableMapSet } from 'immer';
import './global.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

enableMapSet();

ReactDOM.createRoot(document.getElementById('root')!).render(
  // StrictMode will cause double render
  // <React.StrictMode>
  <RouterProvider router={router} />,
  // </React.StrictMode>,
);
