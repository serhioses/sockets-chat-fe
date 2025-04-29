import { useBoundStore } from '@/store/useBoundStore';
import { X } from 'lucide-react';

// import { useAuthStore } from '../store/useAuthStore';

export function ChatHeader() {
    const { chatSelectedUser, selectChatUser } = useBoundStore();
    // const { onlineUsers } = useAuthStore();

    if (!chatSelectedUser) {
        return null;
    }

    return (
        <div className="p-2.5 border-b border-base-300">
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
                        <h3 className="font-medium">{chatSelectedUser.fullName}</h3>
                        <p className="text-sm text-base-content/70">
                            {/* {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'} */}
                            Offline
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
