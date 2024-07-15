import { createBrowserRouter, Navigate } from 'react-router-dom';
import WalletWrapper from './wrapper/WalletWrapper';
import PublicWrapper from './wrapper/PublicWrapper';
import Dashboard from '@/pages/dashboard';
import Create from '@/pages/create';
import Deposit from '@/pages/deposit';
import VerifySecret from '@/pages/public/VerifySecret';
import Landing from '@/pages/landing';
import VerifyEmail from '@/pages/verifyEmail';
import Intro from '@/pages/intro';
import DashboardDetails from '@/pages/dashboard/Details';
import Recover from '@/pages/recover';
import Public from '@/pages/public';
// import RecoverSign from '@/pages/public/RecoverSign';
import Sign from '@/pages/public/Sign';
import Lisence from '@/pages/public/Lisence';
import GuardianSetting from '@/pages/settings/Guardian';
import ManageGuardian from '@/pages/settings/Guardian/Manage';
import IntroGuardian from '@/pages/settings/Guardian/Intro';
import AppContainer from './components/mobile/AppContainer';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WalletWrapper />,
    children: [
      {
        path: '/',
        element: <AppContainer />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'intro', element: <Intro /> },
          {
            path: '/',
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: '/details',
            element: <DashboardDetails />,
          },
          {
            path: '/create',
            element: <Create />,
          },
          {
            path: '/deposit',
            element: <Deposit />,
          },
          {
            path: '/landing',
            element: <Landing />,
          },
          {
            path: '/verify-email',
            element: <VerifyEmail />,
          },
          {
            path: '/recover',
            element: <Recover />,
          },
          {
            path: '/guardian',
            element: <GuardianSetting />,
            children: [
              {
                path: 'intro',
                element: <IntroGuardian />,
              },
              {
                path: 'manage',
                element: <ManageGuardian />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/public',
    element: <PublicWrapper />,
    children: [
      { path: 'verify-secret/:secret', element: <VerifySecret /> },
      {
        path: 'sign/:recoverId',
        element: <Sign />
      },
      {
        path: 'lisence',
        element: <Lisence />
      }
    ],
  },
]);
