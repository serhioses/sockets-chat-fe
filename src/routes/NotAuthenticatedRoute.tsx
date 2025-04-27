import { Navigate, Outlet } from 'react-router-dom';

import { EAsyncStatus } from '@/constants/status';
import { useAuth } from '@/store/useAuth';

export function NotAuthenticatedRoute() {
    const { meStatus } = useAuth();

    if (meStatus === EAsyncStatus.PENDING) {
        return <div>Loading auth...</div>;
    }

    if (meStatus === EAsyncStatus.REJECTED) {
        return <Outlet />;
    }

    return <Navigate to="/" />;
}
