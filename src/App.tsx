import { useEffect, useLayoutEffect } from 'react';

import { AppRoutes } from '@/routes/AppRoutes';
import { useBoundStore } from '@/store/useBoundStore';
import { Snackbar } from '@/components/snackbar/Snackbar';

export default function App() {
    const { getMe, theme, ...r } = useBoundStore();
    console.log(r);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        getMe();
    }, [getMe]);

    useLayoutEffect(() => {
        document.documentElement.dataset.theme = theme ?? undefined;
    }, [theme]);

    return (
        <>
            <AppRoutes />
            <Snackbar />
        </>
    );
}
