import { RouteObject, Navigate } from 'react-router';

import { LoginPage } from '@/pages/LoginPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { NotAuthenticatedRoute } from '@/routes/NotAuthenticatedRoute';

export const notAuthenticatedRoutes: RouteObject[] = [
    {
        path: '/auth',
        element: <NotAuthenticatedRoute />,
        children: [
            {
                index: true,
                element: <Navigate to="login" replace={true} />,
            },
            {
                path: 'signup',
                element: <SignUpPage />,
            },
            {
                path: 'login',
                element: <LoginPage />,
            },
        ],
    },
];
