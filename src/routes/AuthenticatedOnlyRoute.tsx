import { Navigate, Outlet } from 'react-router-dom';

import { EAsyncStatus } from '@/constants/status';
import { useAuth } from '@/store/useAuth';
import { AuthenticatedOnlyLayout } from '@/components/layouts/AuthenticatedOnlyLayout';

export function AuthenticatedOnlyRoute() {
    const { meStatus } = useAuth();

    if (meStatus === EAsyncStatus.PENDING) {
        return <div>Loading auth...</div>;
    }

    if (meStatus === EAsyncStatus.FULFILLED) {
        return (
            <AuthenticatedOnlyLayout>
                <Outlet />;
            </AuthenticatedOnlyLayout>
        );
    }

    return <Navigate to="/auth/login" />;
}
