import { RouteObject } from 'react-router-dom';

import { NotFound } from '@/components/not-found/NotFound';
import { SettingsPage } from '@/pages/SettingsPage';

export const publicRoutes: RouteObject[] = [
    {
        path: '/settings',
        element: <SettingsPage />,
    },
    {
        path: '*',
        element: <NotFound />,
    },
];
