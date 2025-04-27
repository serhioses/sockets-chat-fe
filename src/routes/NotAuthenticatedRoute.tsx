import { Navigate, Outlet } from 'react-router-dom';

import { EAsyncStatus } from '@/constants/status';
import { useAuth } from '@/store/useAuth';

export function NotAuthenticatedRoute() {
    const { status } = useAuth();

    if (status === EAsyncStatus.PENDING) {
        return <div>Loading auth...</div>;
    }

    if (status === EAsyncStatus.REJECTED) {
        return <Outlet />;
    }

    return <Navigate to="/" />;
}
