import { PropsWithChildren } from 'react';

import { Navbar } from '@/components/navbar/Navbar';

export function AuthenticatedOnlyLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-dvh">
            <Navbar />
            {children}
        </div>
    );
}
