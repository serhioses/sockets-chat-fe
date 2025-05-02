import { create } from 'zustand';

import { createAuthSlice } from '@/store/authSlice';
import { TStoreState } from '@/types/store';
import { createThemeSlice } from '@/store/themeSlice';
import { createChatSlice } from '@/store/chatSlice';
import { createSocketSlice } from '@/store/socketSlice';
import { errorSlice } from '@/store/errorSlice';

export const useBoundStore = create<TStoreState>((...a) => ({
    ...createAuthSlice(...a),
    ...createThemeSlice(...a),
    ...createSocketSlice(...a),
    ...createChatSlice(...a),
    ...errorSlice(...a),
}));
