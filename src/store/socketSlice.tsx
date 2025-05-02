import { io, Socket } from 'socket.io-client';

import { TClientToServerEvents, TServerToClientEvents } from '@/types/socket';
import { createSlice } from '@/lib/utils/store';
import { TStoreState } from '@/types/store';

type TSocketState = {
    onlineUserIds: Set<string>;
    socket: Socket<TServerToClientEvents, TClientToServerEvents> | null;
};
type TSocketActions = {
    connectSocket: VoidFunction;
};

export type TSocketSlice = TSocketState & TSocketActions;

const initialState: TSocketState = {
    onlineUserIds: new Set(),
    socket: null,
};

export const createSocketSlice = createSlice<TSocketState, TSocketActions, TStoreState>(
    (set, get) => {
        return {
            ...initialState,
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
                    set({ onlineUserIds: new Set(ids) });
                });

                get().socket?.on('message', (data) => {
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
