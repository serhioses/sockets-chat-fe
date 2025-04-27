import { create } from 'zustand';

import { EAsyncStatus } from '@/constants/status';
import { http } from '@/lib/axios';
import { TLoginFormValues, TSignUpFormValues } from '@/types/auth';
import { TUser } from '@/types/user';
import { TMaybe } from '@/types/utilities';

type TAuthResponse<T> = {
    data?: TMaybe<T>;
    errors?: Array<{ message: string }>;
    formErrors?: string[];
};

type TAuthStore = {
    user: TMaybe<TUser>;
    status: EAsyncStatus;
    error?: string;
    formErrors?: string[];
    getMe: () => Promise<void>;
    signUp: (data: TSignUpFormValues) => Promise<void>;
    login: (data: TLoginFormValues) => Promise<void>;
    logOut: () => Promise<void>;
};

export const useAuth = create<TAuthStore>((set) => {
    return {
        user: null,
        status: EAsyncStatus.IDLE,
        async getMe() {
            set({ status: EAsyncStatus.PENDING });

            try {
                const res = await http.get<TAuthResponse<TUser>>('/auth/me');

                if (!res.data.data) {
                    set({ user: null, status: EAsyncStatus.REJECTED });
                } else {
                    set({ user: res.data.data, status: EAsyncStatus.FULFILLED });
                }
            } catch {
                set({ user: null, status: EAsyncStatus.REJECTED });
            }
        },
        async signUp(data) {
            set({ status: EAsyncStatus.PENDING, error: undefined, formErrors: undefined });

            try {
                const res = await http.post<TAuthResponse<TUser>>('/auth/signup', data);

                if (res.data.data) {
                    set({
                        status: EAsyncStatus.FULFILLED,
                        user: res.data.data,
                    });
                } else {
                    set({
                        status: EAsyncStatus.REJECTED,
                        error: res.data.errors?.at(0)?.message,
                        formErrors: res.data.formErrors,
                    });
                }
            } catch {
                set({ status: EAsyncStatus.REJECTED });
            }
        },
        async login(data) {
            set({
                status: EAsyncStatus.PENDING,
                error: undefined,
                formErrors: undefined,
            });

            try {
                const res = await http.post<TAuthResponse<TUser>>('/auth/login', data);

                if (res.data.data) {
                    set({
                        status: EAsyncStatus.FULFILLED,
                        user: res.data.data,
                    });
                } else {
                    set({
                        status: EAsyncStatus.REJECTED,
                        error: res.data.errors?.at(0)?.message,
                        formErrors: res.data.formErrors,
                    });
                }
            } catch {
                set({ status: EAsyncStatus.REJECTED });
            }
        },
        async logOut() {
            set({
                status: EAsyncStatus.PENDING,
                error: undefined,
                formErrors: undefined,
            });

            try {
                const res = await http.post<TAuthResponse<{ success: boolean }>>('/auth/logout');

                if (res.data.data?.success) {
                    set({ status: EAsyncStatus.REJECTED, user: null });
                } else {
                    set({
                        status: EAsyncStatus.FULFILLED,
                        error: res.data.errors?.at(0)?.message,
                    });
                }
            } catch {
                set({ status: EAsyncStatus.FULFILLED });
            }
        },
    };
});
