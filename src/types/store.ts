import { TAuthSlice } from '@/store/authSlice';
import { TChatSlice } from '@/store/chatSlice';
import { TThemeSlice } from '@/store/themeSlice';

export type TStoreState = TAuthSlice & TThemeSlice & TChatSlice;
