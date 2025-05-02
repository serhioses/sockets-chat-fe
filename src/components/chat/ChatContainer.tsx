import { useEffect, useLayoutEffect, useRef } from 'react';

import { EAsyncStatus } from '@/constants/status';
import { useBoundStore } from '@/store/useBoundStore';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessagesSkeleton } from '@/components/skeletons/ChatMessagesSkeleton';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/components/chat/ChatMessage';

export function ChatContainer() {
    const { messages, messagesStatus, fetchMessages, chatSelectedUser } = useBoundStore();
    const messageListRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (chatSelectedUser?.id) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            fetchMessages();
        }
    }, [fetchMessages, chatSelectedUser?.id]);

    useLayoutEffect(() => {
        messageListRef.current?.scrollTo({ top: messageListRef.current.scrollHeight });
    }, [messages]);

    if (messagesStatus === EAsyncStatus.PENDING || !chatSelectedUser) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <ChatMessagesSkeleton />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <div ref={messageListRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => {
                    return <ChatMessage key={message._id} message={message} />;
                })}
            </div>

            <ChatInput />
        </div>
    );
}
