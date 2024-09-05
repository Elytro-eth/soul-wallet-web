import { createBrowserRouter, Link, Navigate, Outlet } from 'react-router-dom';
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
// import RecoverSign from '@/pages/public/RecoverSign';
import Sign from '@/pages/public/Sign';
import Lisence from '@/pages/public/Lisence';
import GuardianSetting from '@/pages/settings/Guardian';
import ManageGuardian from '@/pages/settings/Guardian/Manage';
import IntroGuardian from '@/pages/settings/Guardian/Intro';
import PassKeyMobile from './pages/passkeys/passkeyMobile';
import { AssetPage } from './pages/asset';
import Setting from './pages/settings';
import Activity from './pages/activity';

// const Wrapper = () => {
//   return <div><Outlet /></div>
// }

// const Home = () => {
//   return <div>
//     <div>Home</div>
//     <div>
//       <Link to='/home/first'>first</Link>
//       &nbsp;&nbsp;
//       <Link to='/home/second'>second</Link>
//       &nbsp;&nbsp;
//       <Link to='/home/third'>third</Link>
//     </div>
//     <Outlet />
//   </div>
// }

// const FirstPage1 = () => {
//   return <div>first 1</div>
// }

// const SecondPage1 = () => {
//   return <div>second 1</div>
// }

// const ThirdPage1 = () => {
//   return <div>third 1</div>
// }

// export const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Wrapper />,
//     children: [
//       {
//         path: '/home',
//         element: <Home />,
//         children: [
//           {
//             path: '/home/first',
//             element: <FirstPage1 />,
//           },
//           {
//             path: '/home/second',
//             element: <SecondPage1 />,
//           },
//           {
//             path: '/home/third',
//             element: <ThirdPage1 />,
//           }
//         ]
//       }
//     ]
//   }
// ])

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WalletWrapper />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
        children: [{
          path: '/dashboard/assets',
          element: <AssetPage />
        }, {
          path: '/dashboard/settings',
          element: <Setting />
        }, {
          path: '/dashboard/activity',
          element: <Activity />
        }, {
          path: '/dashboard',
          element: <Navigate to="/dashboard/assets" replace />,
        }]
      },
      {
        path: '/',
        element: <Navigate to="/dashboard/assets" replace />,
      },
      { path: '/intro', element: <Intro /> },
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
      {
        path: '/passkeys',
        element: <PassKeyMobile />
      }
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
