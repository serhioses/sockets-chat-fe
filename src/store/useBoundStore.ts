import { create } from 'zustand';

import { createAuthSlice } from '@/store/authSlice';
import { TStoreState } from '@/types/store';
import { createThemeSlice } from '@/store/themeSlice';
import { createChatSlice } from '@/store/chatSlice';

export const useBoundStore = create<TStoreState>((...a) => ({
    ...createAuthSlice(...a),
    ...createThemeSlice(...a),
    ...createChatSlice(...a),
}));
