import { TMessage, TSendMessageFormValues } from '@/types/chat';

export type TServerToClientEvents = {
    getOnlineUsers: (onlineUserIds: string[]) => void;
    message: (data: { error?: string; data?: TMessage }) => void;
};

export type TClientToServerEvents = {
    joinRoom: (id?: string) => void;
    message: (data: TSendMessageFormValues, receiverId: string) => void;
    // message: (
    //     data: TSendMessageFormValues,
    //     receiverId: string,
    //     cb: (data: { error?: string; data?: TMessage }) => void,
    // ) => void;
};
