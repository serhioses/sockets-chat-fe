import clsx from 'clsx';
import { Send } from 'lucide-react';

import { THEMES } from '@/constants/themes';
import { useBoundStore } from '@/store/useBoundStore';

const PREVIEW_MESSAGES = [
    { id: 1, content: "Hey! How's it going?", isSent: false },
    { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

export function SettingsPage() {
    const { theme, setTheme } = useBoundStore();

    return (
        <div className="container mx-auto px-4 pt-20 max-w-5xl">
            <div className="space-y-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold">Theme</h2>
                    <p className="text-sm text-base-content/70">
                        Choose a theme for your chat interface
                    </p>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2">
                    {THEMES.map((t) => (
                        <button
                            key={t}
                            className={clsx(
                                'group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors cursor-pointer',
                                {
                                    'bg-base-200': theme === t,
                                    'hover:bg-base-200/50': theme !== t,
                                },
                            )}
                            onClick={() => setTheme(t)}
                        >
                            <div className="h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                                <div className="grid grid-cols-4 gap-px p-1 h-full">
                                    <div className="rounded bg-primary"></div>
                                    <div className="rounded bg-secondary"></div>
                                    <div className="rounded bg-accent"></div>
                                    <div className="rounded bg-neutral"></div>
                                </div>
                            </div>
                            <span className="text-xs font-medium w-full text-center">
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </span>
                        </button>
                    ))}
                </div>

                <h3 className="text-lg font-semibold mb-3">Preview</h3>
                <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
                    <div className="p-4 bg-base-200">
                        <div className="max-w-lg mx-auto">
                            <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                                            J
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">John Doe</p>
                                            <p className="text-xs text-base-content/70">Online</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                                    {PREVIEW_MESSAGES.map((message) => (
                                        <div
                                            key={message.id}
                                            className={clsx('flex', {
                                                'justify-end': message.isSent,
                                                'justify-start': !message.isSent,
                                            })}
                                        >
                                            <div
                                                className={clsx(
                                                    'max-w-[80%] rounded-xl p-3 shadow-sm',
                                                    {
                                                        'bg-primary text-primary-content':
                                                            message.isSent,
                                                        'bg-base-200': !message.isSent,
                                                    },
                                                )}
                                            >
                                                <p className="text-sm">{message.content}</p>
                                                <p
                                                    className={clsx('text-[10px] mt-1.5', {
                                                        'text-primary-content/70': message.isSent,
                                                        'text-base-content/70': !message.isSent,
                                                    })}
                                                >
                                                    12:00 PM
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 border-t border-base-300 bg-base-100">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="input input-bordered flex-1 text-sm h-10"
                                            placeholder="Type a message..."
                                            value="This is a preview"
                                            readOnly={true}
                                        />
                                        <button className="btn btn-primary h-10 min-h-0">
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
