import { useBoundStore } from '@/store/useBoundStore';
import { Outlet } from 'react-router-dom';

export function PublicLayout() {
    const { user } = useBoundStore();

    return (
        <div>
            <h1>Public</h1>
            {!!user ? <div>There is user</div> : <div>Default</div>}
            <Outlet />
        </div>
    );
}
