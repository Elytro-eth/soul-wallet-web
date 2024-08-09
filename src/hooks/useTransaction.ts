/**
 * In-wallet Transactions
 */

import { ethers } from 'ethers';
import BN from 'bignumber.js';
import { erc20Abi } from 'viem';
import { useAddressStore } from '@/store/address';
import { Transaction } from '@soulwallet/sdk';
import { ABI_ReceivePayment } from '@soulwallet/abi';
import { noGuardian } from './useWallet';
import { toHex } from '@/lib/tools';
import { useSlotStore } from '@/store/slot';
import { useSignerStore } from '@/store/signer';
import { useChainStore } from '@/store/chain';
import api from '@/lib/api';
import { useToast } from '@chakra-ui/react';
import useSdk from './useSdk';

export default function useTransaction() {
  const { selectedAddress, setSelectedAddress, setWalletName } = useAddressStore();
  const { selectedChainId } = useChainStore();
  const { setSlotInfo } = useSlotStore();
  const { setCredentials } = useSignerStore();
  const { soulWallet } = useSdk();

  const toast = useToast();

  const initWallet = async (credential: any, walletName: string, invitationCode: string) => {
    const createIndex = 0;

    const initialKeys = [credential.onchainPublicKey as string];

    const createSlotInfo = {
      initialKeys,
      initialGuardianHash: noGuardian.initialGuardianHash,
      initialGuardianSafePeriod: toHex(noGuardian.initialGuardianSafePeriod),
    };

    // do time consuming jobs
    const calcRes = await soulWallet.calcWalletAddress(
      createIndex,
      initialKeys,
      noGuardian.initialGuardianHash,
      Number(noGuardian.initialGuardianSafePeriod),
      selectedChainId,
    )

    const address = calcRes.OK;

    setSelectedAddress(address);
    setWalletName(walletName);
    try{
      const res: any = await api.account.create({
        address,
        chainID: selectedChainId,
        name: walletName,
        initInfo: {
          index: createIndex,
          ...createSlotInfo,
        },
        invitationCode,
      });
      // console.log('Create wallet failed msg:!!!!!', res);
      // if (res.code !== 200) {
      //   toast({
      //     title: 'Create wallet failed',
      //     description: res.msg,
      //     status: 'error',
      //   });
      //   throw new Error('Create wallet failed');
      // }
      // private backup key
      setSlotInfo(createSlotInfo);
  
      setCredentials([credential as any]);
  
      return {
        initialKeys,
        address,
        selectedChainId,
      };
    }catch(err:any){
      throw new Error(err.response.data.msg);
    }
  };

  // const payTask = async (contractAddress: string, amount: string, paymentId: string) => {
  //   const soulAbi = new ethers.Interface(ABI_ReceivePayment);
  //   const callData = soulAbi.encodeFunctionData('pay(bytes32)', [paymentId]);
  //   const tx: Transaction = {
  //     to: contractAddress,
  //     data: callData,
  //     value: BN(amount).toString(),
  //   };

  //   // return showSignTransaction([tx], '', '');
  // };

  const sendEth = async (to: string, amount: string) => {
    const amountInWei = new BN(amount).shiftedBy(18).toString();
    const tx = {
      from: selectedAddress,
      to,
      value: amountInWei,
      data: '0x',
    };
    // return await showSignTransaction([tx], '', to);
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
    // return showSignTransaction([tx], '', to);
  };

  return {
    sendErc20,
    sendEth,
    // payTask,
    initWallet,
  };
}
