/**
 * Query current configs
 */
import { useChainStore } from '@/store/chain';
import { useAddressStore } from '@/store/address';
import { useSignerStore } from '@/store/signer';

export default function useConfig() {
  const { getSelectedChainItem } = useChainStore();
  const { getSelectedAddressItem, getSelectedAddressItemActivated } = useAddressStore();
  const { getSelectedCredential } = useSignerStore();

  const selectedChainItem = getSelectedChainItem();
  const selectedAddressItem = getSelectedAddressItem();
  const selectedCredential = getSelectedCredential();

  return {
    selectedCredential,
    selectedChainItem,
    // alias
    chainConfig: selectedChainItem,
    selectedAddressItem,
    getSelectedAddressItemActivated,
  };
}
