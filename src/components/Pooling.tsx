/**
 * Pooling for user state
 */

import { useEffect } from 'react';
import { useAddressStore } from '@/store/address';
import { useHistoryStore } from '@/store/history';
import { useBalanceStore } from '@/store/balance';
import useConfig from '@/hooks/useConfig';
import BN from 'bignumber.js';
import { toFixed, toShortAddress } from '@/lib/tools';
import { useChainStore } from '@/store/chain';
import useWalletContext from '@/context/hooks/useWalletContext';
import useWallet from '@/hooks/useWallet';
export default function Pooling() {
  const { ethersProvider, checkActivated } = useWalletContext();
  const { selectedAddress, setActivateFee } = useAddressStore();
  const { fetchHistory } = useHistoryStore();
  const { selectedChainItem } = useConfig();
  const { getActivateFee } = useWallet();
  const { selectedChainId } = useChainStore();
  const { fetchTokenBalance } = useBalanceStore();

  const checkActivateFee = async () => {
    if (!(await checkActivated())) {
      const fee = await getActivateFee();
      // add 0.001 more
      setActivateFee(toFixed(BN(fee).plus(0.001).toString(), 6));
    }
  };

  useEffect(() => {
    const { chainIdHex, paymasterTokens } = selectedChainItem;

    if (!selectedAddress || !selectedChainId) {
      return;
    }

    fetchTokenBalance(selectedAddress, chainIdHex, paymasterTokens);
    fetchHistory(selectedAddress, [selectedChainId], ethersProvider);
    checkActivateFee();

    const interval = setInterval(() => {
      fetchTokenBalance(selectedAddress, chainIdHex, paymasterTokens);
      fetchHistory(selectedAddress, [selectedChainId], ethersProvider);
      checkActivateFee();
    }, 8000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedAddress, selectedChainId]);

  return <></>;
}
