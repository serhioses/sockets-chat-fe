import { RouteObject } from 'react-router-dom';

import { HomePage } from '@/pages/HomePage';
import { ProfilePage } from '@/pages/ProfilePage';
import { AuthenticatedOnlyRoute } from '@/routes/AuthenticatedOnlyRoute';

export const authenticatedOnlyRoutes: RouteObject[] = [
    {
        path: '/',
        element: <AuthenticatedOnlyRoute />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'profile',
                element: <ProfilePage />,
            },
        ],
    },
];
