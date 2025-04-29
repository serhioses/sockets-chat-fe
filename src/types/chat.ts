import { sendMessageSchema } from '@/constants/chat';
import { z } from 'zod';

export type TMessage = {
    _id: string;
    senderId: string;
    receiverId: string;
    text?: string;
    image?: string;
    createdAt: string;
};

export type TSendMessageFormValues = z.infer<typeof sendMessageSchema>;
