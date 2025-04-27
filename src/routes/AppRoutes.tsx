import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { authenticatedOnlyRoutes } from '@/routes/authenticated-only-routes';
import { notAuthenticatedRoutes } from '@/routes/not-authenticated-routes';
import { publicRoutes } from '@/routes/public-routes';

export function AppRoutes() {
    const isLoggedIn = false;
    // let router: ReturnType<typeof createBrowserRouter>;

    // if (isLoggedIn) {
    //     router = createBrowserRouter([...mainRoutes]);
    // } else {
    //     router = createBrowserRouter([...authRoutes]);
    // }

    const router = createBrowserRouter([
        ...authenticatedOnlyRoutes,
        ...notAuthenticatedRoutes,
        ...publicRoutes,
    ]);

    return <RouterProvider router={router} />;
}
