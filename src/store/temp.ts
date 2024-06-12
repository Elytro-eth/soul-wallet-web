/**
 * Stores in this file should always persist
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

export interface ITempStore {
  recoverInfo: any;
  setRecoverInfo: (val: any) => void;
}

const createTempSlice = immer<ITempStore>((set, get) => ({
  recoverInfo: {},
  setRecoverInfo: (val: any) => {
    set({
      recoverInfo: val,
    });
  },
}));

export const useTempStore = create<ITempStore>()(
  persist((...set) => ({ ...createTempSlice(...set) }), {
    name: 'temp-storage',
    version: 5,
  }),
);
