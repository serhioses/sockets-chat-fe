import { RouteObject } from 'react-router-dom';

import { NotFound } from '@/components/not-found/NotFound';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { SettingsPage } from '@/pages/SettingsPage';

export const publicRoutes: RouteObject[] = [
    {
        element: <PublicLayout />,
        children: [
            {
                path: '/settings',
                element: <SettingsPage />,
            },
        ],
    },
    {
        path: '*',
        element: <NotFound />,
    },
];
