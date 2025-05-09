import { RouterProvider, createBrowserRouter } from 'react-router';

import { authenticatedOnlyRoutes } from '@/routes/authenticated-only-routes';
import { notAuthenticatedRoutes } from '@/routes/not-authenticated-routes';
import { publicRoutes } from '@/routes/public-routes';

export function AppRoutes() {
    const router = createBrowserRouter([
        ...authenticatedOnlyRoutes,
        ...notAuthenticatedRoutes,
        ...publicRoutes,
    ]);

    return <RouterProvider router={router} />;
}
