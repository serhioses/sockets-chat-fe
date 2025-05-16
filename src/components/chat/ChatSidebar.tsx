import { useEffect, useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import clsx from 'clsx';

import { useBoundStore } from '@/store/useBoundStore';
import { EAsyncStatus } from '@/constants/status';
import { ChatSidebarSkeleton } from '@/components/skeletons/ChatSidebarSkeleton';

export function ChatSidebar() {
    const {
        chatUsers,
        fetchChatUsers,
        chatUsersStatus,
        chatSelectedUser,
        selectChatUser,
        onlineUserIds,
    } = useBoundStore();

    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    useEffect(() => {
        void fetchChatUsers();
    }, [fetchChatUsers]);

    const filteredUsers = useMemo(() => {
        return showOnlineOnly ? chatUsers.filter((u) => onlineUserIds.has(u.id)) : chatUsers;
    }, [chatUsers, onlineUserIds, showOnlineOnly]);

    if (chatUsersStatus === EAsyncStatus.PENDING || chatUsersStatus === EAsyncStatus.IDLE) {
        return <ChatSidebarSkeleton />;
    }

    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <h2 className="font-medium hidden lg:block" data-testid="chat-sidebar-title">
                        Contacts
                    </h2>
                </div>

                <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="checkbox checkbox-sm"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500" data-testid="chat-online-count">
                        ({onlineUserIds.size - 1} online)
                    </span>
                </div>
            </div>

            <div className="overflow-y-auto w-full py-3">
                {filteredUsers.map((user) => {
                    return (
                        <button
                            key={user.id}
                            onClick={() => selectChatUser(user)}
                            className={clsx(
                                'w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors cursor-pointer',
                                {
                                    'bg-base-300 ring-1 ring-base-300':
                                        chatSelectedUser?.id === user.id,
                                },
                            )}
                            data-testid="chat-contact"
                        >
                            <div
                                className={clsx('avatar', {
                                    'avatar-online': onlineUserIds.has(user.id),
                                })}
                            >
                                <div className="w-12 rounded-full">
                                    <img
                                        src={user.avatar || '/avatar.png'}
                                        alt={`Avatar of ${user.fullName}`}
                                    />
                                </div>
                            </div>

                            <div className="hidden lg:block text-left min-w-0">
                                <div className="font-medium truncate">{user.fullName}</div>
                            </div>
                        </button>
                    );
                })}

                {filteredUsers.length === 0 && (
                    <div className="text-center text-zinc-500 py-4">No online users</div>
                )}
            </div>
        </aside>
    );
}
