import { EAsyncStatus } from '@/constants/status';
import { http } from '@/lib/axios';
import { TLoginFormValues, TSignUpFormValues } from '@/types/auth';
import { TUser } from '@/types/user';
import { TMaybe } from '@/types/utilities';
import { THttpResponse, THttpState } from '@/types/http';
import { TStoreState } from '@/types/store';
import { createSlice, resetAllStores } from '@/lib/utils/store';

// TODO: think of moving to hooks with useAsync
type TAuthState = {
    user: TMaybe<TUser>;
    meState: Pick<THttpState, 'status'>;
    signUpState: THttpState;
    loginState: THttpState;
    logOutState: Omit<THttpState, 'formErrors'>;
};

type TAuthActions = {
    getMe: () => Promise<void>;
    signUp: (data: TSignUpFormValues, onSuccess?: VoidFunction) => Promise<void>;
    login: (data: TLoginFormValues, onSuccess?: VoidFunction) => Promise<void>;
    logOut: (onSuccess?: VoidFunction) => Promise<void>;
    resetAuth: VoidFunction;
};

export type TAuthSlice = TAuthState & TAuthActions;

const initialState: TAuthState = {
    user: null,
    meState: {
        status: EAsyncStatus.IDLE,
    },
    signUpState: {
        status: EAsyncStatus.IDLE,
    },
    loginState: {
        status: EAsyncStatus.IDLE,
    },
    logOutState: {
        status: EAsyncStatus.IDLE,
    },
};

export const createAuthSlice = createSlice<TAuthState, TAuthActions, TStoreState>(
    (set, get) => {
        return {
            ...initialState,
            async getMe() {
                set({ meState: { status: EAsyncStatus.PENDING }, error: null });

                try {
                    const res = await http.get<THttpResponse<TUser>>('/auth/me');

                    if (res.data.data) {
                        set({ user: res.data.data, meState: { status: EAsyncStatus.FULFILLED } });
                        await get().connectSocket();
                    } else {
                        get().setError(get().user ? 'Error during authentication.' : null);
                        set({
                            user: null,
                            meState: {
                                status: EAsyncStatus.REJECTED,
                            },
                        });
                        // get().setError('Error during authentication.');
                    }
                } catch {
                    set({
                        user: null,
                        meState: {
                            status: EAsyncStatus.REJECTED,
                        },
                    });
                    get().setError(get().user ? 'Error during authentication.' : null);
                }
            },
            async signUp(data, onSuccess) {
                set({
                    signUpState: {
                        status: EAsyncStatus.PENDING,
                        formErrors: null,
                    },
                    error: null,
                });

                try {
                    const res = await http.post<THttpResponse<TUser>>('/auth/signup', data);

                    if (res.data.data) {
                        set({
                            signUpState: { status: EAsyncStatus.FULFILLED },
                        });

                        await get().getMe();
                        onSuccess?.();
                    } else {
                        set({
                            signUpState: {
                                formErrors: res.data.formErrors,
                                status: EAsyncStatus.REJECTED,
                            },
                        });
                        get().setError(res.data.errors);
                    }
                } catch {
                    set({ signUpState: { status: EAsyncStatus.REJECTED } });
                    get().setError('Error during signing up.');
                }
            },
            async login(data, onSuccess) {
                set({
                    loginState: {
                        status: EAsyncStatus.PENDING,
                        formErrors: null,
                    },
                    error: null,
                });

                try {
                    const res = await http.post<THttpResponse<TUser>>('/auth/login', data);

                    if (res.data.data) {
                        set({
                            loginState: { status: EAsyncStatus.FULFILLED },
                        });

                        await get().getMe();

                        onSuccess?.();
                    } else {
                        set({
                            loginState: {
                                formErrors: res.data.formErrors,
                                status: EAsyncStatus.REJECTED,
                            },
                        });
                        get().setError(res.data.errors);
                    }
                } catch {
                    set({ loginState: { status: EAsyncStatus.REJECTED } });
                    get().setError('Error during loggin in.');
                }
            },
            async logOut(onSuccess) {
                set({
                    logOutState: { status: EAsyncStatus.PENDING },
                    error: null,
                });

                try {
                    const res =
                        await http.post<THttpResponse<{ success: boolean }>>('/auth/logout');

                    if (res.data.data?.success) {
                        get().socket?.disconnect();

                        resetAllStores();

                        await get().getMe();
                        onSuccess?.();
                    } else {
                        set({
                            logOutState: {
                                status: EAsyncStatus.REJECTED,
                            },
                        });
                        get().setError(res.data.errors);
                    }
                } catch {
                    set({ logOutState: { status: EAsyncStatus.REJECTED } });
                    get().setError('Error during signing out.');
                }
            },
            resetAuth() {
                set((state) => {
                    return {
                        signUpState: {
                            ...state.signUpState,
                            error: null,
                            formErrors: null,
                        },
                        loginState: {
                            ...state.loginState,
                            error: null,
                            formErrors: null,
                        },
                        logOutState: {
                            ...state.logOutState,
                            error: null,
                        },
                        error: null,
                    };
                });
            },
        };
    },
    (set) => {
        set(initialState);
    },
);
