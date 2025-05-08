import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import { AuthenticatedOnlyRoute } from '@/routes/AuthenticatedOnlyRoute';

const HomePageLazy = lazy(() => import('@/pages/HomePage'));
const ProfilePageLazy = lazy(() => import('@/pages/ProfilePage'));

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
                element: <ProfilePageLazy />,
            },
        ],
    },
];
