import { useEffect, useLayoutEffect } from 'react';
import toast from 'react-hot-toast';

import { AppRoutes } from '@/routes/AppRoutes';
import { useBoundStore } from '@/store/useBoundStore';
import { Snackbar } from '@/components/snackbar/Snackbar';

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
        <>
            <AppRoutes />
            <Snackbar />
        </>
    );
}
