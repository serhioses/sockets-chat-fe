import { X } from 'lucide-react';

import { useBoundStore } from '@/store/useBoundStore';

export function ChatHeader() {
    const { chatSelectedUser, selectChatUser, onlineUserIds } = useBoundStore();

    if (!chatSelectedUser) {
        return null;
    }

    return (
        <div className="p-2.5 border-b border-base-300" data-testid="chat-selected-user">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img
                                src={chatSelectedUser.avatar || '/avatar.png'}
                                alt={chatSelectedUser.fullName}
                            />
                        </div>
                    </div>

                    <div>
                        <p className="font-medium" data-testid="chat-selected-user-name">
                            {chatSelectedUser.fullName}
                        </p>
                        <p className="text-sm text-base-content/70">
                            {onlineUserIds.has(chatSelectedUser.id) ? 'Online' : 'Offline'}
                        </p>
                    </div>
                </div>

                <button className="cursor-pointer" onClick={() => selectChatUser(null)}>
                    <X />
                </button>
            </div>
        </div>
    );
}
