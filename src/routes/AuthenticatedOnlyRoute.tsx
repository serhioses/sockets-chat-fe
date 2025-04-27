import { Navigate, Outlet } from 'react-router-dom';

import { EAsyncStatus } from '@/constants/status';
import { useAuth } from '@/store/useAuth';
import { AuthenticatedOnlyLayout } from '@/components/layouts/AuthenticatedOnlyLayout';

export function AuthenticatedOnlyRoute() {
    const { status } = useAuth();

    if (status === EAsyncStatus.IDLE) {
        return null;
    }

    if (status === EAsyncStatus.PENDING) {
        return <div>Loading auth...</div>;
    }

    if (status === EAsyncStatus.FULFILLED) {
        return (
            <AuthenticatedOnlyLayout>
                <Outlet />
            </AuthenticatedOnlyLayout>
        );
    }

    return <Navigate to="/auth/login" />;
}
