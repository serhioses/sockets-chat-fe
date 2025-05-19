import { lazy } from 'react';
import { RouteObject } from 'react-router';

import { AuthenticatedOnlyRoute } from '@/routes/AuthenticatedOnlyRoute';
import { ProfilePage } from '@/pages/ProfilePage';
import { RouteError } from '@/components/error/FullPageError';

const HomePageLazy = lazy(() => import('@/pages/HomePage'));

export const authenticatedOnlyRoutes: RouteObject[] = [
    {
        path: '/',
        element: <AuthenticatedOnlyRoute />,
        errorElement: <RouteError />,
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
