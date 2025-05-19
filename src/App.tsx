import { useEffect, useLayoutEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import toast from 'react-hot-toast';

import { AppRoutes } from '@/routes/AppRoutes';
import { useBoundStore } from '@/store/useBoundStore';
import { Snackbar } from '@/components/snackbar/Snackbar';
import { FullPageError } from '@/components/error/FullPageError';

export default function App() {
    const { getMe, theme, error } = useBoundStore();

    useEffect(() => {
        void getMe();
    }, [getMe]);

    useEffect(() => {
        let toastId = '';
        if (error) {
            toastId = toast.error(error);
        }

        return () => {
            if (toastId) {
                toast.dismiss(toastId);
                toastId = '';
            }
        };
    }, [error]);

    useLayoutEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    return (
        <ErrorBoundary FallbackComponent={FullPageError}>
            <AppRoutes />
            <Snackbar />
        </ErrorBoundary>
    );
}
