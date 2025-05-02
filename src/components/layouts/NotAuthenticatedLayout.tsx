import { useBoundStore } from '@/store/useBoundStore';
import { PropsWithChildren, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function NotAuthenticatedLayout({ children }: PropsWithChildren) {
    const { resetAuth } = useBoundStore();
    const location = useLocation();

    useEffect(() => {
        resetAuth();
    }, [location.pathname, resetAuth]);

    return <div className="grid lg:grid-cols-2 h-dvh">{children}</div>;
}
