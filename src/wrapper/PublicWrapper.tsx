import { Outlet } from 'react-router-dom';
import CommonWrapper from './CommonWrapper';
import WagmiContext from '../components/WagmiContext';
import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';

export default function PublicWrapper() {
  return (
    <CommonWrapper>
      <WagmiContext>
        <Box
        // todo, adapt pc later
        // maxWidth="430px" margin="0 auto"
        >
          <Outlet />
        </Box>
      </WagmiContext>
    </CommonWrapper>
  );
}
