import clsx from 'clsx';

export function ChatMessagesSkeleton() {
    const skeletonMessages = Array(6).fill(null);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="chat-messages-loader">
            {skeletonMessages.map((_, idx) => (
                <div
                    key={idx}
                    className={clsx('chat', {
                        'chat-start': idx % 2 === 0,
                        'chat-end': idx % 2 !== 0,
                    })}
                >
                    <div className="chat-image avatar">
                        <div className="size-10 rounded-full">
                            <div className="skeleton w-full h-full rounded-full" />
                        </div>
                    </div>

                    <div className="chat-header mb-1">
                        <div className="skeleton h-4 w-16" />
                    </div>

                    <div className="chat-bubble bg-transparent p-0">
                        <div className="skeleton h-16 w-[200px]" />
                    </div>
                </div>
            ))}
        </div>
    );
}
