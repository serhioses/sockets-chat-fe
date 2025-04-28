import { StateCreator } from 'zustand';

import { EAsyncStatus } from '@/constants/status';
import { http } from '@/lib/axios';
import { TLoginFormValues, TSignUpFormValues } from '@/types/auth';
import { TUser } from '@/types/user';
import { TMaybe } from '@/types/utilities';

type TAuthResponse<T> = {
    data?: TMaybe<T>;
    errors?: { message: string }[];
    formErrors?: string[];
};

export type TAuthSlice = {
    user: TMaybe<TUser>;

    meState: {
        status: EAsyncStatus;
    };
    signUpState: {
        status: EAsyncStatus;
        error?: string;
        formErrors?: string[];
    };
    loginState: {
        status: EAsyncStatus;
        error?: string;
        formErrors?: string[];
    };
    logOutState: {
        status: EAsyncStatus;
        error?: string;
    };
    getMe: () => Promise<void>;
    signUp: (data: TSignUpFormValues) => Promise<void>;
    login: (data: TLoginFormValues) => Promise<void>;
    logOut: () => Promise<void>;
};

export const createAuthSlice: StateCreator<TAuthSlice> = (set) => {
    return {
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
        async getMe() {
            set({ meState: { status: EAsyncStatus.PENDING } });

            try {
                const res = await http.get<TAuthResponse<TUser>>('/auth/me');

                if (!res.data.data) {
                    set({ user: null, meState: { status: EAsyncStatus.REJECTED } });
                } else {
                    set({ user: res.data.data, meState: { status: EAsyncStatus.FULFILLED } });
                }
            } catch {
                set({ user: null, meState: { status: EAsyncStatus.REJECTED } });
            }
        },
        async signUp(data) {
            set({
                signUpState: {
                    status: EAsyncStatus.PENDING,
                    error: undefined,
                    formErrors: undefined,
                },
            });

            try {
                const res = await http.post<TAuthResponse<TUser>>('/auth/signup', data);

                if (res.data.data) {
                    set({
                        user: res.data.data,
                        signUpState: { status: EAsyncStatus.FULFILLED },
                        meState: {
                            status: EAsyncStatus.FULFILLED,
                        },
                    });
                } else {
                    set({
                        signUpState: {
                            error: res.data.errors?.at(0)?.message,
                            formErrors: res.data.formErrors,
                            status: EAsyncStatus.REJECTED,
                        },
                    });
                }
            } catch {
                set({ signUpState: { status: EAsyncStatus.REJECTED } });
            }
        },
        async login(data) {
            set({
                loginState: {
                    status: EAsyncStatus.PENDING,
                    error: undefined,
                    formErrors: undefined,
                },
            });

            try {
                const res = await http.post<TAuthResponse<TUser>>('/auth/login', data);

                if (res.data.data) {
                    set({
                        user: res.data.data,
                        loginState: { status: EAsyncStatus.FULFILLED },
                        meState: {
                            status: EAsyncStatus.FULFILLED,
                        },
                    });
                } else {
                    set({
                        loginState: {
                            error: res.data.errors?.at(0)?.message,
                            formErrors: res.data.formErrors,
                            status: EAsyncStatus.REJECTED,
                        },
                    });
                }
            } catch {
                set({ loginState: { status: EAsyncStatus.REJECTED } });
            }
        },
        async logOut() {
            set({
                logOutState: { status: EAsyncStatus.PENDING, error: undefined },
            });

            try {
                const res = await http.post<TAuthResponse<{ success: boolean }>>('/auth/logout');

                if (res.data.data?.success) {
                    set({
                        user: null,
                        logOutState: { status: EAsyncStatus.FULFILLED },
                        meState: {
                            status: EAsyncStatus.REJECTED,
                        },
                        signUpState: {
                            status: EAsyncStatus.IDLE,
                        },
                        loginState: {
                            status: EAsyncStatus.IDLE,
                        },
                    });
                } else {
                    set({
                        logOutState: {
                            status: EAsyncStatus.REJECTED,
                            error: res.data.errors?.at(0)?.message,
                        },
                    });
                }
            } catch {
                set({ logOutState: { status: EAsyncStatus.REJECTED } });
            }
        },
    };
};
