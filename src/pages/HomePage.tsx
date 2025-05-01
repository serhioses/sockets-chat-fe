import { ChatContainer } from '@/components/chat/ChatContainer';
import { ChatPlaceholder } from '@/components/chat/ChatPlaceholder';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { useBoundStore } from '@/store/useBoundStore';

export function HomePage() {
    const { chatSelectedUser } = useBoundStore();

    return (
        <div className="flex justify-center pt-20 px-4 min-h-0 flex-1 bg-base-200">
            <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-full">
                <div className="flex h-full rounded-lg overflow-hidden mb-8">
                    <ChatSidebar />

                    {chatSelectedUser ? <ChatContainer /> : <ChatPlaceholder />}
                </div>
            </div>
        </div>
    );
}
