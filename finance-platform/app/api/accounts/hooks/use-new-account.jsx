'use client';

import { create } from 'zustand';

export const useNewAccount = create((set) => ({
  isOpen: false,
  type: 'account', // Default type
  onOpen: (type = 'account') => set({ isOpen: true, type }),
  onClose: () => set({ isOpen: false, type: 'account' }),
}));