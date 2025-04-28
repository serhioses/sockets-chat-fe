import { Outlet } from 'react-router-dom';

import { Navbar } from '@/components/navbar/Navbar';

export function PublicLayout() {
    return (
        <div className="min-h-dvh">
            <Navbar />
            <Outlet />
        </div>
    );
}
