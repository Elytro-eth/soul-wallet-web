/**
 * In-wallet Transactions
 */

import { ZeroAddress, ethers } from 'ethers';
import BN from 'bignumber.js';
import { erc20Abi } from 'viem'
import { useAddressStore } from '@/store/address';
import { Transaction } from '@soulwallet/sdk';
import useWalletContext from '@/context/hooks/useWalletContext';
import { ABI_ReceivePayment, ABI_SocialRecoveryModule } from '@soulwallet/abi';
import useConfig from './useConfig';

export default function useTransaction() {
  const { showSignTransaction } = useWalletContext();
  const { selectedAddress } = useAddressStore();
  const { chainConfig } =  useConfig();

  const changeGuardian = async (newGuardianHash: string) => {
    const soulAbi = new ethers.Interface(ABI_SocialRecoveryModule);
    const callData = soulAbi.encodeFunctionData('setGuardian(bytes32)', [newGuardianHash]);
    const tx: Transaction = {
      to: chainConfig.contracts.socialRecoveryModule,
      data: callData,
    };
    return showSignTransaction([tx], '', '');
  };

  const sendEth = async (to: string, amount: string) => {

    const amountInWei = new BN(amount).shiftedBy(18).toString();
    const tx = {
      from: selectedAddress,
      to,
      value: amountInWei,
      data: '0x',
    };
    return await showSignTransaction([tx], '', to);
  };

  const sendErc20 = async (tokenAddress: string, to: string, amount: string, decimals: number) => {
    const amountInWei = new BN(amount).shiftedBy(decimals).toString();
    const erc20Interface = new ethers.Interface(erc20Abi);
    const callData = erc20Interface.encodeFunctionData('transfer', [to, amountInWei]);
    const tx = {
      from: selectedAddress,
      to: tokenAddress,
      data: callData,
    };
    return showSignTransaction([tx], '', to);
  };

  return {
    sendErc20,
    sendEth,
    changeGuardian,
  };
}
