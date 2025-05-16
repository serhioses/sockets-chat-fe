import type { Socket } from 'socket.io-client';

import { TClientToServerEvents, TServerToClientEvents } from '@/types/socket';
import { createSlice } from '@/lib/utils/store';
import { TStoreState } from '@/types/store';

type TSocketState = {
    onlineUserIds: Set<string>;
    socket: Socket<TServerToClientEvents, TClientToServerEvents> | null;
};
type TSocketActions = {
    connectSocket: () => Promise<void>;
    disconnectSocket: VoidFunction;
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
            async connectSocket() {
                const { user, socket } = get();

                if (!user || socket) {
                    return;
                }

                const { io } = await import('socket.io-client');

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
            disconnectSocket() {
                get().socket?.disconnect();
                set({ socket: null });
            },
        };
    },
    (set) => {
        set(initialState);
    },
);
