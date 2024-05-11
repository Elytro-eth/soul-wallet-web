import { WalletContextProvider } from '@/context/WalletContext';
import { Outlet, useLocation } from 'react-router-dom';
import FindRoute from '@/components/FindRoute';
import Pooling from '../components/Pooling';
import CommonWrapper from './CommonWrapper';
import { AnimatePresence } from 'framer-motion';

export default function Wrapper() {
  return (
    <CommonWrapper>
      <FindRoute>
        <WalletContextProvider>
          <AnimatePresence>
            <Outlet />
          </AnimatePresence>
          <Pooling />
        </WalletContextProvider>
      </FindRoute>
    </CommonWrapper>
  );
}
