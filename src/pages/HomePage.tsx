import { ChatContainer } from '@/components/chat/ChatContainer';
import { ChatPlaceholder } from '@/components/chat/ChatPlaceholder';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { useBoundStore } from '@/store/useBoundStore';

export default function HomePage() {
    const { chatSelectedUser } = useBoundStore();

    return (
        <main className="flex justify-center pt-20 px-4 pb-6 min-h-0 flex-1 bg-base-200">
            <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-7xl h-full">
                <div className="flex h-full rounded-lg overflow-hidden mb-8">
                    <ChatSidebar />

                    {chatSelectedUser ? <ChatContainer /> : <ChatPlaceholder />}
                </div>
            </div>
        </main>
    );
}
