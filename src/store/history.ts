import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import { decodeCalldata } from '@/lib/tools';
import { ethers, Contract, formatEther, ZeroAddress } from 'ethers';
import { ActivityStatusEn } from '@/lib/type';
import BN from 'bignumber.js';
import { Provider } from 'ethers';
import { erc20Abi } from 'viem';

export interface IHistoryStore {
  historyList: any[];
  fetchHistory: (address: string, chainId: string, entryPointAddress: string, ethersProvider: Provider) => void;
  clearHistory: () => void;
}

export const fetchHistoryApi = async (
  address: string,
  chainId: string,
  entryPointAddress: string,
  ethersProvider: Provider,
) => {
  // const res = await api.op.list(address, [chainId]);
  const res:any = await api.transaction.query({address, chainId});
  const txs = res.data.txs;
  let finalHistoryList = [];

  // IMPORTANT TODO, cache decode result
  for (let i = 0; i < txs.length; i++) {
    const item = txs[i];
    console.log('I', item)
    // decode calldata
    if (item.type === 'op' && item.opList) {
      const callDataDecodes = await decodeCalldata(chainId, entryPointAddress, item.opList[0], ethersProvider);

      const functionName = callDataDecodes
        .map((item: any) => item.functionName || (item.method && item.method.name))
        .join(', ');

      // if it's transfer, transfer ETH or swap, show the amount
      console.log('History ddecdoe::', i, callDataDecodes);
      let decodedData = callDataDecodes[0];
      decodedData.value = BN(callDataDecodes[0].value || 0).toNumber();

      finalHistoryList.push({
        interactAddress: decodedData.to,
        functionName,
        timestamp: item.timestamp,
        erc20Address: decodedData.erc20Address,
        tokenChanged: decodedData.tokenChanged,
        txHash: item.txhash,
      });
    } else {
      if (item.list) {
        // get token info
        let tokenChanged = '0';
        
        const tokenAddress = item?.list[0].token_address;
        if(tokenAddress === ZeroAddress){
          tokenChanged = `${BN(item.list[0].asset_value).shiftedBy(-18).toFixed()} ETH`;

        }else{
          const tokenContract = new Contract(tokenAddress, erc20Abi, ethersProvider);
          const decimals = await tokenContract.decimals();
          const symbol = await tokenContract.symbol();
          const amount = BN(item.list[0]. asset_value).shiftedBy(-BN(decimals)).toFixed();
          tokenChanged = `${amount} ${symbol}`;
        }

        finalHistoryList.push({
          interactAddress: item.list[0].asset_from,
          functionName: 'Receive',
          timestamp: item.timestamp,
          erc20Address: tokenAddress,
          tokenChanged,
          txHash: item.txhash,
      });
      }
    }
  }

  return finalHistoryList;
};

export const useHistoryStore = create<IHistoryStore>()(
  persist(
    (set, get) => ({
      historyList: [],
      fetchHistory: async (address: string, chainId: string, entryPointAddress: string, ethersProvider: Provider) => {
        const res: any = await fetchHistoryApi(address, chainId, entryPointAddress, ethersProvider);
        set({ historyList: res });
      },
      clearHistory: () => {
        set({
          historyList: [],
        });
      },
    }),
    {
      name: 'history-storage',
    },
  ),
);
