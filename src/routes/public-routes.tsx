import { RouteObject } from 'react-router';

import { NotFound } from '@/components/not-found/NotFound';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { SettingsPage } from '@/pages/SettingsPage';
import { RouteError } from '@/components/error/FullPageError';

export const publicRoutes: RouteObject[] = [
    {
        element: <PublicLayout />,
        errorElement: <RouteError />,
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
