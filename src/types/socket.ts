import { TMessage, TSendMessageFormValues } from '@/types/chat';

export type TServerToClientEvents = {
    getOnlineUsers: (onlineUserIds: string[]) => void;
    message: (data: { data: TMessage }) => void;
};

export type TClientToServerEvents = {
    joinRoom: (id?: string) => void;
    // message: (data: TSendMessageFormValues, receiverId: string) => void;
    message: (
        data: TSendMessageFormValues,
        receiverId: string,
        cb: (data: {
            errors?: { message: string }[];
            formErrors?: string[];
            data?: TMessage;
        }) => void,
    ) => void;
};
