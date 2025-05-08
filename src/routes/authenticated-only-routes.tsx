import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import { AuthenticatedOnlyRoute } from '@/routes/AuthenticatedOnlyRoute';
import { ProfilePage } from '@/pages/ProfilePage';

const HomePageLazy = lazy(() => import('@/pages/HomePage'));

export const authenticatedOnlyRoutes: RouteObject[] = [
    {
        path: '/',
        element: <AuthenticatedOnlyRoute />,
        children: [
            {
                index: true,
                element: <HomePageLazy />,
            },
            {
                path: 'profile',
                element: <ProfilePage />,
            },
        ],
    },
];
