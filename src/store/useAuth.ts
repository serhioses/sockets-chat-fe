import { create } from 'zustand';

import { EAsyncStatus } from '@/constants/status';
import { http } from '@/lib/axios';
import { TSignUpFormValues } from '@/types/auth';
import { TAuthUser, TUser } from '@/types/user';
import { TMaybe } from '@/types/utilities';

type TAuthResponse<T> = {
    data?: TMaybe<T>;
    errors?: Array<{ message: string }>;
    formErrors?: string[];
};

type TAuthStore = {
    user: TMaybe<TAuthUser>;
    meStatus: EAsyncStatus;
    signUpStatus: EAsyncStatus;
    logOutStatus: EAsyncStatus;
    error?: string;
    formErrors?: string[];
    getMe: () => Promise<void>;
    signUp: (data: TSignUpFormValues) => Promise<void>;
    logOut: () => Promise<void>;
};

export const useAuth = create<TAuthStore>((set) => {
    return {
        user: null,
        meStatus: EAsyncStatus.PENDING,
        signUpStatus: EAsyncStatus.IDLE,
        logOutStatus: EAsyncStatus.IDLE,
        async getMe() {
            try {
                const res = await http.get<TAuthResponse<TAuthUser>>('/auth/me');

                if (!res.data.data) {
                    set({ user: null, meStatus: EAsyncStatus.REJECTED });
                } else {
                    set({ user: res.data.data, meStatus: EAsyncStatus.FULFILLED });
                }
            } catch {
                set({ user: null, meStatus: EAsyncStatus.REJECTED });
            }
        },
        async signUp(data) {
            set({ signUpStatus: EAsyncStatus.PENDING, error: undefined, formErrors: undefined });

            try {
                const res = await http.post<TAuthResponse<TUser>>('/auth/signup', data);
                console.log(res);

                if (res.data.data) {
                    set({
                        signUpStatus: EAsyncStatus.FULFILLED,
                        meStatus: EAsyncStatus.FULFILLED,
                    });
                } else {
                    set({
                        signUpStatus: EAsyncStatus.REJECTED,
                        error: res.data.errors?.at(0)?.message,
                        formErrors: res.data.formErrors,
                        meStatus: EAsyncStatus.REJECTED,
                    });
                }
            } catch {
                set({ signUpStatus: EAsyncStatus.REJECTED, meStatus: EAsyncStatus.REJECTED });
            }
        },
        async logOut() {
            set({ logOutStatus: EAsyncStatus.PENDING, error: undefined, formErrors: undefined });

            try {
                const res = await http.post<TAuthResponse<{ success: boolean }>>('/auth/logout');

                console.log(res.data);

                if (res.data.data?.success) {
                    set({ logOutStatus: EAsyncStatus.FULFILLED, meStatus: EAsyncStatus.REJECTED });
                } else {
                    set({
                        logOutStatus: EAsyncStatus.REJECTED,
                        error: res.data.errors?.at(0)?.message,
                        meStatus: EAsyncStatus.FULFILLED,
                    });
                }
            } catch {
                set({ logOutStatus: EAsyncStatus.REJECTED, meStatus: EAsyncStatus.FULFILLED });
            }
        },
    };
});
