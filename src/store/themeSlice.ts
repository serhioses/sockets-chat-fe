import { StateCreator } from 'zustand';

import { TTheme } from '@/types/theme';

export type TThemeSlice = {
    theme: TTheme;
    setTheme: (theme: TTheme) => void;
};

export const createThemeSlice: StateCreator<TThemeSlice> = (set) => {
    return {
        theme: JSON.parse(localStorage.getItem('themeName') ?? 'null') as TTheme,
        setTheme(theme) {
            localStorage.setItem('themeName', JSON.stringify(theme));
            set({ theme });
        },
    };
};
