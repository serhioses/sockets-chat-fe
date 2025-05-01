import { StateCreator } from 'zustand';

import { TUser } from '@/types/user';
import { EAsyncStatus } from '@/constants/status';
import { http } from '@/lib/axios';
import { THttpResponse } from '@/types/http';
import { TMessage, TSendMessageFormValues } from '@/types/chat';
import { TStoreState } from '@/types/store';

export type TChatSlice = {
    chatUsersStatus: EAsyncStatus;
    chatUsers: TUser[];
    chatSelectedUser: TUser | null;
    messages: TMessage[];
    messagesStatus: EAsyncStatus;
    fetchChatUsers: () => Promise<void>;
    selectChatUser: (user: TUser | null) => void;
    fetchMessages: () => Promise<void>;
    sendMessage: (data: TSendMessageFormValues) => Promise<void>;
};

export const createChatSlice: StateCreator<TStoreState, [], [], TChatSlice> = (set, get) => {
    return {
        chatUsersStatus: EAsyncStatus.IDLE,
        chatUsers: [],
        chatSelectedUser: null,
        messages: [],
        messagesStatus: EAsyncStatus.IDLE,
        async fetchChatUsers() {
            set({ chatUsersStatus: EAsyncStatus.PENDING });

            try {
                const res = await http.get<THttpResponse<TUser[]>>('/chat/users');

                if (res.data.data) {
                    set({ chatUsersStatus: EAsyncStatus.FULFILLED, chatUsers: res.data.data });
                } else {
                    set({ chatUsersStatus: EAsyncStatus.REJECTED });
                }
            } catch {
                set({ chatUsersStatus: EAsyncStatus.REJECTED });
            }
        },
        selectChatUser(user) {
            set({ chatSelectedUser: user });
            get().socket?.emit('joinRoom', user?.id);
        },
        async fetchMessages() {
            const receiverId = get().chatSelectedUser?.id;

            if (!receiverId) {
                return;
            }

            set({ messagesStatus: EAsyncStatus.PENDING });

            try {
                const res = await http.get<THttpResponse<TMessage[]>>(`/chat/${receiverId}`);

                if (res.data.data) {
                    set({ messagesStatus: EAsyncStatus.FULFILLED, messages: res.data.data });
                } else {
                    set({ messagesStatus: EAsyncStatus.REJECTED, messages: [] });
                }
            } catch {
                set({ messagesStatus: EAsyncStatus.REJECTED, messages: [] });
            }
        },
        async sendMessage(data) {
            const receiverId = get().chatSelectedUser?.id;
            const socket = get().socket;

            if (!receiverId || !socket) {
                return;
            }

            const res = await socket.emitWithAck('message', data, receiverId);
            const newMessage = res.data;

            if (newMessage) {
                set((state) => ({ messages: [...state.messages, newMessage] }));
            } else {
                console.log(res.errors);
            }

            // try {
            //     const res = await http.post<THttpResponse<TMessage>>(
            //         `/chat/send-message/${receiverId}`,
            //         data,
            //         {
            //             headers: { 'Content-Type': 'multipart/form-data' },
            //         },
            //     );

            //     const newMessage = res.data.data;
            //     if (newMessage) {
            //         set((state) => ({ messages: [...state.messages, newMessage] }));
            //     }
            // } catch (err) {
            //     console.log(err);
            // }
        },
    };
};
