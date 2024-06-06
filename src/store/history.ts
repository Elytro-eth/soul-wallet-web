import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

export interface IHistoryStore {
  historyList: any[];
  fetchHistory: (address: string, chainId: string) => void;
  clearHistory: () => void;
}

export const fetchHistoryApi = async (address: string, chainId: string) => {
  const res = await api.op.list(address, [chainId]);

  const finalList = res.data.ops

  return finalList;
};

export const useHistoryStore = create<IHistoryStore>()(
  persist(
    (set, get) => ({
      historyList: [],
      fetchHistory: async (address: string, chainId: string) => {
        const res: any = await fetchHistoryApi(address, chainId);
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
