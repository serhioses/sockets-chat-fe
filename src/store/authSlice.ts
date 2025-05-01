import { StateCreator } from 'zustand';
import { io, Socket } from 'socket.io-client';

import { EAsyncStatus } from '@/constants/status';
import { http } from '@/lib/axios';
import { TLoginFormValues, TSignUpFormValues } from '@/types/auth';
import { TUser } from '@/types/user';
import { TMaybe } from '@/types/utilities';
import { THttpResponse } from '@/types/http';
import { TStoreState } from '@/types/store';
import { TClientToServerEvents, TServerToClientEvents } from '@/types/socket';

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
    onlineUserIds: Set<string>;
    socket: Socket<TServerToClientEvents, TClientToServerEvents> | null;

    getMe: () => Promise<void>;
    signUp: (data: TSignUpFormValues) => Promise<void>;
    login: (data: TLoginFormValues) => Promise<void>;
    logOut: () => Promise<void>;
    connectSocket: () => void;
};

export const createAuthSlice: StateCreator<TStoreState, [], [], TAuthSlice> = (set, get) => {
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
        onlineUserIds: new Set(),
        socket: null,
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
                        user: res.data.data,
                        signUpState: { status: EAsyncStatus.FULFILLED },
                        meState: {
                            status: EAsyncStatus.FULFILLED,
                        },
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
                        user: res.data.data,
                        loginState: { status: EAsyncStatus.FULFILLED },
                        meState: {
                            status: EAsyncStatus.FULFILLED,
                        },
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
                const res = await http.post<THttpResponse<{ success: boolean }>>('/auth/logout');

                if (res.data.data?.success) {
                    get().socket?.disconnect();

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
                        messages: [],
                        messagesStatus: EAsyncStatus.IDLE,
                        chatSelectedUser: null,
                        chatUsersStatus: EAsyncStatus.IDLE,
                        chatUsers: [],
                        socket: null,
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
};
