/**
 * For GuardianForm use ONLY
 * temporary store user's input
 * Please refer to GLOBAL store for permanent use
 */
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { create } from 'zustand';

export interface GuardianStore {
  guardiansInfo: any;
  setGuardiansInfo: (value: any) => void;
  clearGuardianInfo: () => void;
  updateGuardiansInfo: (value: any) => void;
  getGuardiansInfo: () => any;
}

const createGuardianSlice = immer<GuardianStore>((set, get) => ({
  guardiansInfo: {},
  setGuardiansInfo: (value: any) => set({ guardiansInfo: value || {} }),
  updateGuardiansInfo: (value: any) => set({
    guardiansInfo: {
      ...get().guardiansInfo,
      ...value
    }
  }),
  clearGuardianInfo: () => set({
    guardiansInfo: {},
  }),
  getGuardiansInfo: () => get().guardiansInfo,
}));

export type GuardianState = ReturnType<typeof createGuardianStore>;

// type GuardianStoreInitialProps = {
//   guardians: GuardianItem[];
// };

export const createGuardianStore = (initProps?: any) =>
  create<GuardianStore>()((...a) => ({ ...createGuardianSlice(...a), ...initProps }));

export const useGuardianStore = create<GuardianStore>()(
  persist((...set) => ({ ...createGuardianSlice(...set) }), {
    name: 'guardian-storage',
    version: 5,
  }),
);
