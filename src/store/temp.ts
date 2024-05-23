/**
 * Stores in this file should temporarily persist
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

const createTempSlice = immer<any>((set, get) => ({
  recoverInfo: {},
  getRecoverInfo: () => {
    return get().recoverInfo
  },
  updateRecoverInfo: (value: any) => set({
    recoverInfo: {
      ...get().recoverInfo,
      ...value
    }
  }),
  setRecoverInfo: (value: any) => set({
    recoverInfo: value
  }),

  clearTempStore: () =>{
    console.log('ready to clear')
    set({
      recoverInfo: {},
      guardianInfo: {},
    })
  },

  guardianInfo: {},
  getGuardiansInfo: () => {
    return get().guardianInfo
  },
  getEditingGuardiansInfo: () => {
    return get().guardianInfo && get().guardianInfo.editingGuardiansInfo
  },
  setEditingGuardiansInfo: (value: any) => set({
    guardianInfo: {
      ...get().guardianInfo,
      editingGuardiansInfo: value
    }
  }),
  updateEditingGuardiansInfo: (value: any) => set({
    guardianInfo: {
      ...get().guardianInfo,
      editingGuardiansInfo: {
        ...(get().getEditingGuardiansInfo() || {}),
        ...value
      }
    }
  }),

  getEditingSingleGuardiansInfo: () => {
    return get().guardianInfo && get().guardianInfo.editingSingleGuardiansInfo
  },
  setEditingSingleGuardiansInfo: (value: any) => set({
    guardianInfo: {
      ...get().guardianInfo,
      editingSingleGuardiansInfo: value
    }
  }),
  updateEditingSingleGuardiansInfo: (value: any) => set({
    guardianInfo: {
      ...get().guardianInfo,
      editingSingleGuardiansInfo: {
        ...(get().getEditingSingleGuardiansInfo() || {}),
        ...value
      }
    }
  }),

  clearGuardianInfo: () => set({
    guardianInfo: {},
  }),
}));

export const useTempStore = create<any>()(
  persist((...set) => ({ ...createTempSlice(...set) }), {
    name: 'temp-storage',
    version: 3,
  }),
);
