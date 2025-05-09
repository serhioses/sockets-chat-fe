import { PropsWithChildren, useEffect } from 'react';
import { useLocation } from 'react-router';

import { useBoundStore } from '@/store/useBoundStore';

export function NotAuthenticatedLayout({ children }: PropsWithChildren) {
    const { resetAuth } = useBoundStore();
    const location = useLocation();

    useEffect(() => {
        resetAuth();
    }, [location.pathname, resetAuth]);

    useEffect(() => {
        void import('@/pages/HomePage');
    }, []);

    return <div className="grid lg:grid-cols-2 h-dvh">{children}</div>;
}
