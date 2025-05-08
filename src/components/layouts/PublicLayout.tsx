import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { Navbar } from '@/components/navbar/Navbar';
import { PageLoader } from '@/components/loading/PageLoader';

export function PublicLayout() {
    return (
        <div className="h-dvh">
            <Navbar />
            <Suspense fallback={<PageLoader />}>
                <Outlet />
            </Suspense>
        </div>
    );
}
