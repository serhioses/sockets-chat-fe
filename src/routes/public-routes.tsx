import { RouteObject } from 'react-router-dom';

import { NotFound } from '@/components/not-found/NotFound';
import { SettingsPage } from '@/pages/SettingsPage';
import { PublicLayout } from '@/components/layouts/PublicLayout';

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
