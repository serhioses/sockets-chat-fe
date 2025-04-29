import { useBoundStore } from '@/store/useBoundStore';
import { TMessage } from '@/types/chat';
import clsx from 'clsx';

type TChatMessageProps = {
    message: TMessage;
};

export function ChatMessage({ message }: TChatMessageProps) {
    const { user, chatSelectedUser } = useBoundStore();

    return (
        <div
            className={clsx('chat', {
                'chat-end': message.senderId === user?.id,
                'chat-start': message.senderId !== user?.id,
            })}
            // ref={messageEndRef}
        >
            <div className=" chat-image avatar">
                <div className="size-10 rounded-full border">
                    <img
                        src={
                            message.senderId === user?.id
                                ? user?.avatar || '/avatar.png'
                                : chatSelectedUser?.avatar || '/avatar.png'
                        }
                        alt=""
                    />
                </div>
            </div>
            <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                    {/* {formatMessageTime(message.createdAt)} */}
                    {message.createdAt}
                </time>
            </div>
            <div className="chat-bubble flex flex-col">
                {message.image && (
                    <img src={message.image} alt="" className="sm:max-w-[200px] rounded-md mb-2" />
                )}
                {message.text && <p>{message.text}</p>}
            </div>
        </div>
    );
}
