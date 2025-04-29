import { StateCreator } from 'zustand';

import { TUser } from '@/types/user';
import { EAsyncStatus } from '@/constants/status';
import { http } from '@/lib/axios';
import { THttpResponse } from '@/types/http';

export type TChatSlice = {
    chatUsersStatus: EAsyncStatus;
    chatUsers: TUser[];
    chatSelectedUserId: string | null;
    fetchChatUsers: () => Promise<void>;
    selectChatUser: (id: string) => void;
};

export const createChatSlice: StateCreator<TChatSlice> = (set) => {
    return {
        chatUsersStatus: EAsyncStatus.IDLE,
        chatUsers: [],
        chatSelectedUserId: null,
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
        selectChatUser(id) {
            set({ chatSelectedUserId: id });
        },
    };
};
