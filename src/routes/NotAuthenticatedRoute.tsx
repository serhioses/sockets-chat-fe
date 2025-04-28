import { Navigate, Outlet } from 'react-router-dom';

import { EAsyncStatus } from '@/constants/status';
import { useBoundStore } from '@/store/useBoundStore';

export function NotAuthenticatedRoute() {
    const {
        meState: { status },
    } = useBoundStore();

    if (status === EAsyncStatus.IDLE) {
        return null;
    }

    if (status === EAsyncStatus.PENDING) {
        return <div>Loading auth...</div>;
    }

    if (status === EAsyncStatus.REJECTED) {
        return <Outlet />;
    }

    return <Navigate to="/" />;
}
