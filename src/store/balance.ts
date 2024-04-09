import { create } from 'zustand';
import api from '@/lib/api';
import { persist } from 'zustand/middleware';
import { ethers } from 'ethers';
import IconDefaultToken from '@/assets/tokens/default.svg';
import IconEth from '@/assets/tokens/eth.svg';
import BN from 'bignumber.js';
import { trialFundAddress } from '@/config';

export interface ITokenBalanceItem {
  chainID: string;
  contractAddress: string;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
  tokenBalance: string;
  tokenBalanceFormatted: string;
  tokenPrice: string;
  usdValue?: string;
  type?: number;
}

const defaultEthBalance: ITokenBalanceItem = {
  chainID: '1',
  contractAddress: ethers.ZeroAddress,
  decimals: 18,
  logoURI: IconEth,
  name: 'Ethereum',
  symbol: 'ETH',
  tokenBalance: '0',
  tokenBalanceFormatted: '0',
  tokenPrice: '0',
  usdValue: '0',
};

export interface IBalanceStore {
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  fetchFeeData: (provider: any) => void;
  sevenDayApy: string;
  fetchApy: () => void;
  oneDayInterest: string;
  totalInterest: string;
  fetchInterest: (address: string, chainID: string) => void;
  totalUsdValue: string;
  totalTrialValue: string;
  tokenBalance: ITokenBalanceItem[];
  clearBalance: () => void;
  getTokenBalance: (tokenAddress: string) => any;
  setTokenBalance: (balanceList: any) => void;
}

export interface priceMapping {
  [address: string]: number;
}

export const fetchTokenBalanceApi = async (address: string, chainId: string) => {
  if (!address || !chainId) {
    return;
  }

  const res = await api.token.balance({
    address,
    chainID: chainId,
  });

  return res.data.balances;
};

export const formatTokenBalance = (item: ITokenBalanceItem) => {
  if (!item.logoURI) {
    item.logoURI = IconDefaultToken;
  }
  if (!item.symbol) {
    item.symbol = 'Unknown';
  }
  if (!item.name) {
    item.name = 'Unknown';
  }
  if (item.tokenBalance) {
    item.tokenBalanceFormatted = ethers.formatUnits(item.tokenBalance, item.decimals);
  }
  return item;
};

export const useBalanceStore = create<IBalanceStore>()(
  persist(
    (set, get) => ({
      maxFeePerGas: '0x',
      maxPriorityFeePerGas: '0x',
      totalUsdValue: '0',
      totalTrialValue: '0',
      apy: '0',
      sevenDayApy: '0',
      oneDayInterest: '0',
      totalInterest: '0',
      fetchFeeData: async () => {
        // const feeData = await provider.getFeeData();
        // const feeData2 = await provider.send('pimlico_getUserOperationGasPrice', []);

        // console.log('fee data', feeData2)

        // set({
        //   maxFeePerGas: `0x${feeData.maxFeePerGas?.toString(16)}`,
        //   maxPriorityFeePerGas: `0x${feeData.maxPriorityFeePerGas?.toString(16)}`,
        // });
      },
      fetchApy: async () => {
        const res: any = await api.aave.apy({
          interval: '7day',
          vaultAddress: import.meta.env.VITE_TOKEN_AUSDC,
          network: 'optimism',
        });

        set({ sevenDayApy: BN(res.data.apy).div(100).toFixed(2) });
      },
      fetchInterest: async (address, chainID) => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        const res = await api.token.interest({
          chainID,
          address,
          startTime: Math.floor(date.getTime() / 1000),
        });

        set({ oneDayInterest: res.data.interest });
      },
      tokenBalance: [defaultEthBalance],
      nftBalance: [],
      getTokenBalance: (tokenAddress: string) => {
        return get().tokenBalance.filter(
          (item: ITokenBalanceItem) => item.contractAddress.toLowerCase() === tokenAddress.toLowerCase(),
        )[0];
      },
      clearBalance: () => {
        set({ tokenBalance: [defaultEthBalance], totalUsdValue: '0' });
      },
      setTokenBalance: (balanceList: any) => {
        let totalUsdValue = BN('0');
        let totalTrialValue = BN('0');
        const tokenList = balanceList.map((item: ITokenBalanceItem) => {
          let formattedItem = formatTokenBalance(item);
          if(item.contractAddress === trialFundAddress){
            totalTrialValue = totalTrialValue.plus(item.tokenBalanceFormatted);
          }else{
            totalUsdValue = totalUsdValue.plus(item.tokenBalanceFormatted);
          }
          return formattedItem;
        });
        // format balance list here
        set({ tokenBalance: tokenList, totalUsdValue: totalUsdValue.toString(), totalTrialValue: totalTrialValue.toString() });
      },
    }),
    {
      name: 'balance-storage',
    },
  ),
);
