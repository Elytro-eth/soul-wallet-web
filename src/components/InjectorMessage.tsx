/**
 * Listen to the message from injector and send message back
 */

import { useEffect } from 'react';
import { useAddressStore } from '@/store/address';
import { useHistoryStore } from '@/store/history';
import { useBalanceStore } from '@/store/balance';
import { useChainStore } from '@/store/chain';
import useWalletContext from '@/context/hooks/useWalletContext';
import { fetchTokenBalanceApi } from '@/store/balance';
import useQuery from '@/hooks/useQuery';
export default function InjectorMessage() {
  const { ethersProvider } = useWalletContext();
  const { selectedAddress } = useAddressStore();
  const { fetchHistory } = useHistoryStore();
  const { selectedChainId } = useChainStore();
  const { setTokenBalance, fetchFeeData } = useBalanceStore();
  const { fetchGuardianInfo } = useQuery();

  const getUserInfo = async () => {
    const balances = await fetchTokenBalanceApi(selectedAddress, selectedChainId);
    setTokenBalance(balances);
    fetchHistory(selectedAddress, selectedChainId, ethersProvider);
    fetchGuardianInfo(selectedAddress);
  };

  const getCommonInfo = () => {
    fetchFeeData(ethersProvider);
  };

  useEffect(() => {
    if (!selectedAddress || !selectedChainId) {
      return;
    }
    getUserInfo();
    const interval = setInterval(() => {
      getUserInfo();
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedAddress, selectedChainId]);

  useEffect(() => {
    getCommonInfo();
    const interval = setInterval(() => {
      getCommonInfo();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const listener = (msg: any) => {
    console.log('meg is ', msg);
  };

  useEffect(() => {
    console.log('ready to listen message');

    window.postMessage({ type: 'FROM_PAGE', text: 'Hello from the webpage!' }, '*');
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
