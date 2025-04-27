import { PropsWithChildren } from 'react';

import { Navbar } from '@/components/navbar/Navbar';

export function AuthenticatedOnlyLayout({ children }: PropsWithChildren) {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
}
