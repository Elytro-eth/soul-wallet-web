import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import { decodeCalldata } from '@/lib/tools';
import { ActivityStatusEn } from '@/lib/type';
import BN from 'bignumber.js'
import { Provider } from 'ethers';

export interface IHistoryStore {
  historyList: any[];
  fetchHistory: (address: string, chainId: string, ethersProvider: Provider) => void;
  clearHistory: () => void;
}

export const fetchHistoryApi = async (address: string, chainId: string, ethersProvider: Provider) => {
  const res = await api.op.list(address, [chainId]);

  // IMPORTANT TODO, cache decode result
  for (let i = 0; i < res.data.ops.length; i++) {
    const item = res.data.ops[i];
    // decode calldata
    const callDataDecodes = await decodeCalldata(item.chainId, item.entrypointAddress, item.userOp, ethersProvider);

    const functionName = callDataDecodes
      .map((item: any) => item.functionName || (item.method && item.method.name))
      .join(', ');

    const status = item.success ? ActivityStatusEn.Success : ActivityStatusEn.Error;

    // if it's transfer, transfer ETH or swap, show the amount
    console.log('History ddecdoe', callDataDecodes)
    callDataDecodes[0].value = BN(callDataDecodes[0].value || 0).toNumber();

    res.data.ops[i] = {
      ...res.data.ops[i],
      functionName,
      ...JSON.parse(JSON.stringify(callDataDecodes[0])),
      // to: callDataDecodes[0].to,
      // totalCost: BN(res.data.ops[i].totalGasCost || 0).plus(callDataDecodes[0].value || 0).toNumber(),
      status,
    };
  }

  return res.data.ops;
};

export const useHistoryStore = create<IHistoryStore>()(
  persist(
    (set, get) => ({
      historyList: [],
      fetchHistory: async (address: string, chainId: string, ethersProvider: Provider) => {
        const res: any = await fetchHistoryApi(address, chainId, ethersProvider);
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
