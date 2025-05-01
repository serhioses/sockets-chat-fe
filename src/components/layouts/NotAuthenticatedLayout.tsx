import { PropsWithChildren } from 'react';

export function NotAuthenticatedLayout({ children }: PropsWithChildren) {
    return <div className="grid lg:grid-cols-2 h-dvh">{children}</div>;
}
