/**
 * Stores in this file should always persist
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

export interface ITempStore {
  recoverInfo: any;
  clearRecoverInfo: () => void;
  updateRecoverInfo: (val: any) => void;
  emailTemplate: any;
  setEmailTemplate: (val: any) => void;
  clearTempInfo: () => void;
}

const createTempSlice = immer<ITempStore>((set, get) => ({
  recoverInfo: {},
  clearRecoverInfo: () => {
    set({
      recoverInfo: {},
    });
  },
  // setRecoverInfo: (val: any) => {
  //   set({
  //     recoverInfo: val,
  //   });
  // },
  updateRecoverInfo: (val: any) => {
    set((state) => {
      state.recoverInfo = {
        ...state.recoverInfo,
        ...val,
      };
    });
  },
  emailTemplate: {},
  setEmailTemplate: (val: any) => {
    set({
      emailTemplate: val,
    });
  },
  clearTempInfo: () => {
    set({
      emailTemplate: {},
      recoverInfo: {},
    });
  },
}));

export const useTempStore = create<ITempStore>()(
  persist((...set) => ({ ...createTempSlice(...set) }), {
    name: 'temp-storage',
    version: 5,
  }),
);
