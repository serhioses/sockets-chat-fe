import { ChatContainer } from '@/components/chat/ChatContainer';
import { ChatPlaceholder } from '@/components/chat/ChatPlaceholder';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { useBoundStore } from '@/store/useBoundStore';

export function HomePage() {
    const { chatSelectedUser } = useBoundStore();

    return (
        <div className="h-screen bg-base-200">
            <div className="flex items-center justify-center pt-20 px-4">
                <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        <ChatSidebar />

                        {chatSelectedUser ? <ChatContainer /> : <ChatPlaceholder />}
                    </div>
                </div>
            </div>
        </div>
    );
}
