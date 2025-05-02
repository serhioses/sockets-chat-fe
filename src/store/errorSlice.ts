import { createSlice } from '@/lib/utils/store';
import { TStoreState } from '@/types/store';
import { TMaybe } from '@/types/utilities';

type TErrorState = {
    error?: TMaybe<string>;
};

type TErrorActions = {
    setError: (error?: TMaybe<string | { message: string }[]>) => void;
};

export type TErrorSlice = TErrorState & TErrorActions;

export const errorSlice = createSlice<TErrorState, TErrorActions, TStoreState>((set) => {
    return {
        setError(error) {
            if (Array.isArray(error)) {
                set({ error: error[0].message ?? 'Unknown error.' });
            } else {
                set({ error });
            }
        },
    };
});
