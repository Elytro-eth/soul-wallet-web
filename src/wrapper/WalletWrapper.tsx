import { WalletContextProvider } from '@/context/WalletContext';
import { Outlet, useLocation } from 'react-router-dom';
import FindRoute from '@/components/FindRoute';
import Pooling from '@/components/Pooling';
import InjectorMessage from '@/components/InjectorMessage';
import CommonWrapper from './CommonWrapper';
import { Box } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import FadeSwitch from '@/components/FadeSwitch';
import AppContainer from '@/components/mobile/AppContainer';

export default function Wrapper() {
  // const location = useLocation();
  return (
    <CommonWrapper>
      <FindRoute>
        <WalletContextProvider>
          <AnimatePresence>
            <Box pos={'relative'} color="#000" mx="auto">
              {/* <FadeSwitch key={location.pathname}> */}
              <AppContainer>
                <Outlet />
              </AppContainer>
              {/* </FadeSwitch> */}
            </Box>
          </AnimatePresence>
          <Pooling />
          <InjectorMessage />
        </WalletContextProvider>
      </FindRoute>
    </CommonWrapper>
  );
}
