import { TAuthSlice } from '@/store/authSlice';
import { TThemeSlice } from '@/store/themeSlice';

export type TStoreState = TAuthSlice & TThemeSlice;
