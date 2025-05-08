import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import { NotFound } from '@/components/not-found/NotFound';
import { PublicLayout } from '@/components/layouts/PublicLayout';

const SettingsPageLazy = lazy(() => import('@/pages/SettingsPage'));

export const publicRoutes: RouteObject[] = [
    {
        element: <PublicLayout />,
        children: [
            {
                path: '/settings',
                element: <SettingsPageLazy />,
            },
        ],
    },
    {
        path: '*',
        element: <NotFound />,
    },
];
