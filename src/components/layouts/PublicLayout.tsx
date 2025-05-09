import { Outlet } from 'react-router';

import { Navbar } from '@/components/navbar/Navbar';

export function PublicLayout() {
    return (
        <div className="h-dvh">
            <Navbar />

            <Outlet />
        </div>
    );
}
