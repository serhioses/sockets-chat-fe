import { PropsWithChildren } from 'react';

import { Navbar } from '@/components/navbar/Navbar';

export function AuthenticatedOnlyLayout({ children }: PropsWithChildren) {
    return (
        <div className="h-dvh flex flex-col">
            <Navbar />
            {children}
        </div>
    );
}
