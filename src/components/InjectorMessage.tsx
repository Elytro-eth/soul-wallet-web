/**
 * Listen to the message from injector and send message back
 */

import { useEffect } from 'react';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';
export default function InjectorMessage() {
  const { selectedAddress } = useAddressStore();
  const { selectedChainId } = useChainStore();

  const listener = (msg: any) => {
    (window as any).postMessage({
      type: 'wallet/getAccount',
      accountInfo: {
        address: selectedAddress,
        chainId: selectedChainId,
      },
    });
    (window as any).top.postMessage({
      type: 'wallet/getAccount',
      accountInfo: {
        address: selectedAddress,
        chainId: selectedChainId,
      },
    });
    (window as any).parent.postMessage({
      type: 'wallet/getAccount',
      accountInfo: {
        address: selectedAddress,
        chainId: selectedChainId,
      },
    });
    // if(msg.data.type === 'wallet/getAccount') {
    // (window as any).postMessage({
    //   type: 'wallet/getAccount',
    //   accountInfo: {
    //     address: selectedAddress,
    //     chainId: selectedChainId,
    //   },
    // });
    // }
  };

  useEffect(() => {
    // window.postMessage({ type: 'wallet/getAccount', accountInfo: {
    //   address: selectedAddress,
    //   chainId: selectedChainId,
    // } });
    (window as any).top.postMessage({ type: 'FROM_PAGE', text: 'Hello from the webpage!' }, '*');
    // send message to parent window
    window.parent.postMessage({ type: 'FROM_PAGE', text: 'Hello from the webpage!' }, '*');

    window.addEventListener('message', listener, false);
  }, []);

  // useEffect(() => {
  //   fetchApy();
  //   const interval = setInterval(() => {
  //    fetchApy();
  //   }, 60 * 60 * 1000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  return <></>;
}
