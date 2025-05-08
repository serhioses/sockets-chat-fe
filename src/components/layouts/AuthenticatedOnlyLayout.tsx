import { PropsWithChildren, Suspense } from 'react';

import { Navbar } from '@/components/navbar/Navbar';
import { PageLoader } from '@/components/loading/PageLoader';

export function AuthenticatedOnlyLayout({ children }: PropsWithChildren) {
    return (
        <div className="h-dvh flex flex-col">
            <Navbar />
            <Suspense fallback={<PageLoader />}>{children}</Suspense>
        </div>
    );
}
