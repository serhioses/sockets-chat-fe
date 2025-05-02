import { TUser } from '@/types/user';
import { EAsyncStatus } from '@/constants/status';
import { http } from '@/lib/axios';
import { THttpResponse } from '@/types/http';
import { TMessage, TSendMessageFormValues } from '@/types/chat';
import { TStoreState } from '@/types/store';
import { createSlice } from '@/lib/utils/store';

type TChatState = {
    chatUsersStatus: EAsyncStatus;
    chatUsers: TUser[];
    chatSelectedUser: TUser | null;
    messages: TMessage[];
    messagesStatus: EAsyncStatus;
};
type TChatActions = {
    fetchChatUsers: () => Promise<void>;
    selectChatUser: (user: TUser | null) => void;
    fetchMessages: () => Promise<void>;
    sendMessage: (data: TSendMessageFormValues) => Promise<void>;
};

export type TChatSlice = TChatState & TChatActions;

const initialState: TChatState = {
    chatUsersStatus: EAsyncStatus.IDLE,
    chatUsers: [],
    chatSelectedUser: null,
    messages: [],
    messagesStatus: EAsyncStatus.IDLE,
};

export const createChatSlice = createSlice<TChatState, TChatActions, TStoreState>(
    (set, get) => {
        return {
            ...initialState,
            async fetchChatUsers() {
                set({ chatUsersStatus: EAsyncStatus.PENDING, error: null });

                try {
                    const res = await http.get<THttpResponse<TUser[]>>('/chat/users');

                    if (res.data.data) {
                        set({ chatUsersStatus: EAsyncStatus.FULFILLED, chatUsers: res.data.data });
                    } else {
                        set({ chatUsersStatus: EAsyncStatus.REJECTED });
                        get().setError(res.data.errors);
                    }
                } catch {
                    set({ chatUsersStatus: EAsyncStatus.REJECTED });
                    get().setError('Error fetching users.');
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

                set({ messagesStatus: EAsyncStatus.PENDING, error: null });

                try {
                    const res = await http.get<THttpResponse<TMessage[]>>(`/chat/${receiverId}`);

                    if (res.data.data) {
                        set({ messagesStatus: EAsyncStatus.FULFILLED, messages: res.data.data });
                    } else {
                        set({ messagesStatus: EAsyncStatus.REJECTED, messages: [] });
                        get().setError(res.data.errors);
                    }
                } catch {
                    set({ messagesStatus: EAsyncStatus.REJECTED, messages: [] });
                    get().setError('Error during fetching messages.');
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
                    get().setError(res.errors);
                }
            },
        };
    },
    (set) => {
        set(initialState);
    },
);
