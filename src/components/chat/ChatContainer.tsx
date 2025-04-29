import { EAsyncStatus } from '@/constants/status';
import { useBoundStore } from '@/store/useBoundStore';
import { ChatHeader } from './ChatHeader';
import { ChatMessagesSkeleton } from '@/components/skeletons/ChatMessagesSkeleton';
import { ChatInput } from '@/components/chat/ChatInput';
import { useEffect } from 'react';
import { ChatMessage } from './ChatMessage';

export function ChatContainer() {
    const { messages, messagesStatus, fetchMessages, chatSelectedUser } = useBoundStore();

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetchMessages();
    }, [fetchMessages]);

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

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => {
                    return <ChatMessage key={message._id} message={message} />;
                })}
            </div>

            <ChatInput />
        </div>
    );
}
