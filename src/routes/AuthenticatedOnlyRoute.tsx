import { Navigate, Outlet } from 'react-router-dom';

import { EAsyncStatus } from '@/constants/status';
import { useBoundStore } from '@/store/useBoundStore';
import { AuthenticatedOnlyLayout } from '@/components/layouts/AuthenticatedOnlyLayout';
import { PageLoader } from '@/components/loading/PageLoader';

export function AuthenticatedOnlyRoute() {
    const {
        user,
        meState: { status },
    } = useBoundStore();

    if (status === EAsyncStatus.FULFILLED || user) {
        return (
            <AuthenticatedOnlyLayout>
                <Outlet />
            </AuthenticatedOnlyLayout>
        );
    }

    if (status === EAsyncStatus.IDLE) {
        return null;
    }

    if (status === EAsyncStatus.PENDING) {
        return <PageLoader />;
    }

    return <Navigate to="/auth/login" />;
}
