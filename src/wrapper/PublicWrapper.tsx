import { Outlet } from 'react-router-dom';
import CommonWrapper from './CommonWrapper';
import WagmiContext from '../components/WagmiContext';

export default function PublicWrapper() {
  return (
    <CommonWrapper>
       <WagmiContext>
      <Outlet />
      </WagmiContext>
    </CommonWrapper>
  );
}
