/**
 * Find the correct route to go
 */

import { ReactNode, useEffect } from 'react';
import useBrowser from '../hooks/useBrowser';
import { Box } from '@chakra-ui/react';
import { useAddressStore } from '@/store/address';
import storage from '@/lib/storage';
import { useTempStore } from '@/store/temp';
import { useLocation } from 'react-router-dom';
import { storeVersion } from '@/config';
import useTools from '@/hooks/useTools';

export default function FindRoute({ children }: { children: ReactNode }) {
  const { navigate } = useBrowser();
  const location = useLocation();
  const { addressList, selectedAddress } = useAddressStore();
  const { recoverInfo } = useTempStore();
  const { clearLogData } = useTools();

  const findRoute = async () => {
    const storageVersion = storage.getItem('storeVersion');

    if(recoverInfo.recoveryID){
      navigate('/recover');
      // window.location.href =" /recover"
    }

    const allowBypass =
      location.pathname.includes('recover') ||
      location.pathname.includes('create') ||
      location.pathname.includes('auth') ||
      location.pathname.includes('dashboard')

    if (storeVersion !== storageVersion) {
      alert('version changed')
      storage.setItem('storeVersion', storeVersion);
      clearLogData();
      navigate('/auth', { replace: true });
    }

    if (
      !selectedAddress &&
      !allowBypass
    ) {
      alert('no selected address')
      navigate({
        pathname: '/auth',
        search: location.search,
      });
    } else {
      // navigate({
      //   pathname: '/dashboard',
      // });
    }
    // if (addressList.length && selectedAddress)
  };

  useEffect(() => {
    findRoute();
  }, [selectedAddress, addressList, location.pathname]);

  return (
    <Box bg="appBg" fontSize={'16px'} overflow={'auto'}>
      {children}
    </Box>
  );
}
