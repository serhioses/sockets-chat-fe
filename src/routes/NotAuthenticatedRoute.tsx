import { Navigate, Outlet } from 'react-router-dom';

import { EAsyncStatus } from '@/constants/status';
import { useBoundStore } from '@/store/useBoundStore';
import { NotAuthenticatedLayout } from '@/components/layouts/NotAuthenticatedLayout';
import { PageLoader } from '@/components/loading/PageLoader';

export function NotAuthenticatedRoute() {
    const {
        meState: { status },
    } = useBoundStore();

    if (status === EAsyncStatus.IDLE) {
        return null;
    }

    if (status === EAsyncStatus.PENDING) {
        return <PageLoader />;
    }

    if (status === EAsyncStatus.REJECTED) {
        return (
            <NotAuthenticatedLayout>
                <Outlet />
            </NotAuthenticatedLayout>
        );
    }

    return <Navigate to="/" />;
}
