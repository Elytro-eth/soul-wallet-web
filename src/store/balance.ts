import { create } from 'zustand';
import api from '@/lib/api';
import { persist } from 'zustand/middleware';
import { ethers, formatUnits } from 'ethers';
import IconDefaultToken from '@/assets/tokens/default.svg';
import IconEth from '@/assets/tokens/eth.svg';
import BN from 'bignumber.js';

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
  oneDayInterest: string;
  totalInterest: string;
  totalUsdValue: string;
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
    reservedTokenAddresses: []
  });

  const resPrice = await api.token.price({
    chainID: chainId,
    contractAddresses: res.data.map((item: any) => item.contractAddress),
  });

  res.data.forEach((item: any) => {
    console.log('Found', resPrice.data.find((i:any) => i.address === item.contractAddress));
    item.tokenPrice = resPrice.data.find((i:any) => i.address === item.contractAddress).price || '0';
    item.tokenBalanceFormatted = formatUnits(item.tokenBalance, item.decimals);
    item.usdValue = BN(item.tokenBalanceFormatted).times(item.tokenPrice).toString();
  });

  console.log('res price',res, resPrice)

  return res.data;
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
  // if (item.tokenBalance) {
  //   item.tokenBalanceFormatted = ethers.formatUnits(item.tokenBalance, item.decimals);
  // }
  return item;
};

export const useBalanceStore = create<IBalanceStore>()(
  persist(
    (set, get) => ({
      maxFeePerGas: '0x',
      maxPriorityFeePerGas: '0x',
      totalUsdValue: '0',
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
        const tokenList = balanceList.map((item: ITokenBalanceItem) => {
          let formattedItem = formatTokenBalance(item);
          totalUsdValue = totalUsdValue.plus(item.usdValue || '0');
          return formattedItem;
        }).sort((a: ITokenBalanceItem, b: ITokenBalanceItem) => {
          return BN(b.usdValue || '0').comparedTo(a.usdValue || '0');
        });

        // format balance list here
        set({ tokenBalance: tokenList, totalUsdValue: totalUsdValue.toString() });
      },
    }),
    {
      name: 'balance-storage',
    },
  ),
);
