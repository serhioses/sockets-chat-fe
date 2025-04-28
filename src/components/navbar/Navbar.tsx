import { useBoundStore } from '@/store/useBoundStore';

import { Link } from 'react-router-dom';
import { LogOut, MessageSquare, Settings, User } from 'lucide-react';
import { EAsyncStatus } from '@/constants/status';

export function Navbar() {
    const {
        logOut,
        user,
        meState: { status },
    } = useBoundStore();

    if (status === EAsyncStatus.PENDING || status === EAsyncStatus.IDLE) {
        return (
            <header className="border-b border-base-300 sticky w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
                <div className="container mx-auto px-4 h-16 max-w-5xl">
                    <div className="h-16"></div>
                </div>
            </header>
        );
    }

    return (
        <header className="border-b border-base-300 sticky w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
            <div className="container mx-auto px-4 h-16 max-w-5xl">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-8">
                        <Link
                            to="/"
                            className="flex items-center gap-2.5 hover:opacity-80 transition-all"
                        >
                            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-primary" />
                            </div>
                            <h1 className="text-lg font-bold">Chat</h1>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link to="/settings" className="btn btn-sm gap-2 transition-colors">
                            <Settings className="w-4 h-4" />
                            <span className="hidden sm:inline">Settings</span>
                        </Link>

                        {user ? (
                            <>
                                <Link to="/profile" className={'btn btn-sm gap-2'}>
                                    <User className="size-5" />
                                    <span className="hidden sm:inline">Profile</span>
                                </Link>

                                <button
                                    className="flex gap-2 items-center cursor-pointer"
                                    onClick={logOut}
                                >
                                    <LogOut className="size-5" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <Link to="/auth/login" className={'btn btn-sm gap-2'}>
                                <User className="size-5" />
                                <span className="hidden sm:inline">Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
