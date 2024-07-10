/**
 * Stores in this file should always persist
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { get } from 'http';

export interface ISettingStore {
  ignoreWebauthnOverride: boolean;
  setIgnoreWebauthnOverride: (val: boolean) => void;
  isDepositAllChecked: boolean;
  lastAddedToHomeScreenTime: number;
  setLastAddedToHomeScreenTime: (val: number) => void;
  getShouldShowAddedToHomeScreen: () => boolean;
  // for lasting data
  guardianAddressEmail: { [address: string]: string };
  saveGuardianAddressEmail: (address: string, email: string) => void;
  removeGuardianAddressEmail: (address: string) => void;
  guardianAddressName: { [address: string] : string};
  saveGuardianAddressName: (address: string, name: string) => void;
  removeGuardianAddressName: (address: string) => void;
  // getGuardianAddressEmail: (address: string) => string;
}

const createSettingSlice = immer<ISettingStore>((set, get) => ({
  isDepositAllChecked: false,
  lastAddedToHomeScreenTime: 0,
  guardianAddressEmail: {},
  guardianAddressName: {},
  saveGuardianAddressEmail: (address, email) => {
    set((state) => ({
      guardianAddressEmail: {
        ...state.guardianAddressEmail,
        [address]: email,
      },
    }));
  },
  saveGuardianAddressName: (address, name) => {
    set((state) => ({
      guardianAddressName: {
        ...state.guardianAddressName,
        [address]: name,
      },
    }));
  },
  removeGuardianAddressEmail: (address) => {
    set((state) => {
      const newState = {
        ...state.guardianAddressEmail,
      };
      delete newState[address];
      return {
        guardianAddressEmail: newState,
      };
    });
  },
  removeGuardianAddressName: (address) => {
    set((state) => {
      const newState = {
        ...state.guardianAddressName,
      };
      delete newState[address];
      return {
        guardianAddressName: newState,
      };
    });
  },
  getShouldShowAddedToHomeScreen: () => {
    const now = new Date().getTime();
    return now - get().lastAddedToHomeScreenTime > 24 * 60 * 60 * 1000;
  },
  setLastAddedToHomeScreenTime: (val) => {
    set({
      lastAddedToHomeScreenTime: val,
    });
  },
  ignoreWebauthnOverride: false,
  setIgnoreWebauthnOverride: (val: boolean) => {
    set({
      ignoreWebauthnOverride: val,
    });
  },
}));

export const useSettingStore = create<ISettingStore>()(
  persist((...set) => ({ ...createSettingSlice(...set) }), {
    name: 'setting-storage',
    version: 4,
  }),
);
