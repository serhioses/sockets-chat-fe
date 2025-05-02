import { StateCreator } from 'zustand';

const storeResetFns = new Set<() => void>();

export function resetAllStores() {
    storeResetFns.forEach((resetFn) => {
        resetFn();
    });
}

export function createSlice<
    I extends Record<string, unknown>,
    A extends Record<string, unknown>,
    S extends Record<string, unknown>,
>(
    create: (
        s: Parameters<StateCreator<S, [], [], I & A>>[0],
        g: Parameters<StateCreator<S, [], [], I & A>>[1],
    ) => I & A,
    reset?: (s: Parameters<StateCreator<S, [], [], I & A>>[0]) => void,
): StateCreator<S, [], [], I & A> {
    return (set, get) => {
        if (typeof reset === 'function') {
            storeResetFns.add(() => reset(set));
        }

        return create(set, get);
    };
}
