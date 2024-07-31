// import React from 'react';
import ReactDOM from 'react-dom/client';
import { router } from './router.tsx';
import { RouterProvider } from 'react-router-dom';
import { enableMapSet } from 'immer';
import 'ses';
// @ts-ignore
import { lockdown } from '@endo/lockdown';
import './global.css';

lockdown({
  errorTaming: 'unsafe',
  overrideTaming: 'severe',
  consoleTaming: 'unsafe',
  stackFiltering: 'verbose',
  domainTaming: 'unsafe',
});

enableMapSet();

ReactDOM.createRoot(document.getElementById('root')!).render(
  // StrictMode will cause double render
  // <React.StrictMode>
  <RouterProvider router={router} />,
  // </React.StrictMode>,
);
