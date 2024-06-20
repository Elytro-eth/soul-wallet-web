import { Outlet } from 'react-router-dom';
import CommonWrapper from './CommonWrapper';
import WagmiContext from '../components/WagmiContext';
import { useEffect } from 'react';

export default function PublicWrapper() {
  return (
    <CommonWrapper>
      <WagmiContext>
        <Outlet />
      </WagmiContext>
    </CommonWrapper>
  );
}
