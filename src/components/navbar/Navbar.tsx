import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useBoundStore } from '@/store/useBoundStore';
// export function Navbar() {
//     const { logOut, logOutStatus } = useBoundStore();
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (logOutStatus === EAsyncStatus.FULFILLED) {
//             navigate('/auth/login', { replace: true });
//         }
//     }, [logOutStatus]);

//     return (
//         <div>
//             <p>Navbar</p>
//             <button className="btn" onClick={logOut}>
//                 Logout
//             </button>
//         </div>
//     );
// }

import { Link } from 'react-router-dom';
import { LogOut, MessageSquare, Settings, User } from 'lucide-react';

export function Navbar() {
    const { logOut, user } = useBoundStore();

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/auth/login', { replace: true });
        }
    }, [user]);

    return (
        <header className="border-b border-base-300 sticky w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
            <div className="container mx-auto px-4 h-16">
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
                        <Link to={'/settings'} className="btn btn-sm gap-2 transition-colors">
                            <Settings className="w-4 h-4" />
                            <span className="hidden sm:inline">Settings</span>
                        </Link>

                        {!!user && (
                            <>
                                <Link to={'/profile'} className={`btn btn-sm gap-2`}>
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
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
