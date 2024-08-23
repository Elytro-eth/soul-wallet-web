import { Outlet } from 'react-router-dom';
import CommonWrapper from './CommonWrapper';
import WagmiContext from '../components/WagmiContext';
import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';

export default function PublicWrapper() {
  return (
    <CommonWrapper>
      <WagmiContext>
        <Box>
          <Outlet />
        </Box>
      </WagmiContext>
    </CommonWrapper>
  );
}
