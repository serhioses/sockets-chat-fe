import { TAuthSlice } from '@/store/authSlice';
import { TChatSlice } from '@/store/chatSlice';
import { TErrorSlice } from '@/store/errorSlice';
import { TSocketSlice } from '@/store/socketSlice';
import { TThemeSlice } from '@/store/themeSlice';

export type TStoreState = TAuthSlice & TThemeSlice & TSocketSlice & TChatSlice & TErrorSlice;
