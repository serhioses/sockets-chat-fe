import { StateCreator } from 'zustand';

import { TTheme } from '@/types/theme';
import { THEMES } from '@/constants/themes';

export type TThemeSlice = {
    theme: TTheme;
    setTheme: (theme: TTheme) => void;
};

export const createThemeSlice: StateCreator<TThemeSlice> = (set) => {
    return {
        theme: JSON.parse(localStorage.getItem('themeName') ?? JSON.stringify(THEMES[0])) as TTheme,
        setTheme(theme) {
            localStorage.setItem('themeName', JSON.stringify(theme));
            set({ theme });
        },
    };
};
