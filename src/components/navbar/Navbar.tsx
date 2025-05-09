import { Link } from 'react-router-dom';
import { LogOut, MessageSquare, Settings, User } from 'lucide-react';

import { useBoundStore } from '@/store/useBoundStore';
import { EAsyncStatus } from '@/constants/status';

export function Navbar() {
    const {
        logOut,
        user,
        meState: { status },
    } = useBoundStore();

    function renderLinks() {
        if (status === EAsyncStatus.IDLE || status === EAsyncStatus.PENDING) {
            return <div className="skeleton h-8 w-20" data-testid="navbar-skeleton" />;
        }

        if (user) {
            return (
                <>
                    <Link to="/profile" className="btn btn-sm gap-2" data-testid="profile-link">
                        <User className="size-5" />
                        <span className="hidden sm:inline">Profile ({user.fullName})</span>
                    </Link>

                    <button className="flex gap-2 items-center cursor-pointer" onClick={logOut}>
                        <LogOut className="size-5" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </>
            );
        }

        return (
            <Link to="/auth/login" className="btn btn-sm gap-2" data-testid="login-link">
                <User className="size-5" />
                <span className="hidden sm:inline">Login</span>
            </Link>
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

                        {renderLinks()}
                    </div>
                </div>
            </div>
        </header>
    );
}
