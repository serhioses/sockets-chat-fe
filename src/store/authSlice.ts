import { io, Socket } from 'socket.io-client';

import { EAsyncStatus } from '@/constants/status';
import { http } from '@/lib/axios';
import { TLoginFormValues, TSignUpFormValues } from '@/types/auth';
import { TUser } from '@/types/user';
import { TMaybe } from '@/types/utilities';
import { THttpResponse } from '@/types/http';
import { TStoreState } from '@/types/store';
import { TClientToServerEvents, TServerToClientEvents } from '@/types/socket';
import { createSlice, resetAllStores } from '@/lib/utils/store';

// TODO: think of moving to hooks with useAsync
type TAuthState = {
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
    onlineUserIds: Set<string>;
    socket: Socket<TServerToClientEvents, TClientToServerEvents> | null;
};

type TAuthActions = {
    getMe: () => Promise<void>;
    signUp: (data: TSignUpFormValues) => Promise<void>;
    login: (data: TLoginFormValues) => Promise<void>;
    logOut: () => Promise<void>;
    resetAuth: VoidFunction;
    connectSocket: VoidFunction;
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
    onlineUserIds: new Set(),
    socket: null,
};

export const createAuthSlice = createSlice<TAuthState, TAuthActions, TStoreState>(
    (set, get) => {
        return {
            ...initialState,
            async getMe() {
                set({ meState: { status: EAsyncStatus.PENDING } });

                try {
                    const res = await http.get<THttpResponse<TUser>>('/auth/me');

                    if (res.data.data) {
                        set({ user: res.data.data, meState: { status: EAsyncStatus.FULFILLED } });
                        get().connectSocket();
                    } else {
                        set({ user: null, meState: { status: EAsyncStatus.REJECTED } });
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
                    const res = await http.post<THttpResponse<TUser>>('/auth/signup', data);

                    if (res.data.data) {
                        set({
                            signUpState: { status: EAsyncStatus.FULFILLED },
                        });

                        await get().getMe();
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
                    const res = await http.post<THttpResponse<TUser>>('/auth/login', data);

                    if (res.data.data) {
                        set({
                            loginState: { status: EAsyncStatus.FULFILLED },
                        });

                        await get().getMe();
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
                    const res =
                        await http.post<THttpResponse<{ success: boolean }>>('/auth/logout');

                    if (res.data.data?.success) {
                        get().socket?.disconnect();

                        resetAllStores();

                        await get().getMe();
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
            resetAuth() {
                set((state) => {
                    return {
                        signUpState: {
                            ...state.signUpState,
                            error: undefined,
                            formErrors: undefined,
                        },
                        loginState: {
                            ...state.loginState,
                            error: undefined,
                            formErrors: undefined,
                        },
                        logOutState: {
                            ...state.logOutState,
                            error: undefined,
                        },
                    };
                });
            },
            connectSocket() {
                const { user, socket } = get();

                if (!user || socket) {
                    return;
                }

                set({
                    socket: io(import.meta.env.VITE_SOCKET_URL, {
                        query: { userId: user.id },
                        withCredentials: true,
                    }),
                });

                get().socket?.on('getOnlineUsers', (ids) => {
                    console.log('received on client:', ids);
                    set({ onlineUserIds: new Set(ids) });
                });

                get().socket?.on('message', (data) => {
                    console.log('received message:', data);
                    const newMessage = data.data;
                    if (newMessage) {
                        set((state) => ({ messages: [...state.messages, newMessage] }));
                    }
                });
            },
        };
    },
    (set) => {
        set(initialState);
    },
);
