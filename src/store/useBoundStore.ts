import { create } from 'zustand';

import { createAuthSlice } from '@/store/authSlice';
import { TStoreState } from '@/types/store';

export const useBoundStore = create<TStoreState>((...a) => ({
    ...createAuthSlice(...a),
}));
