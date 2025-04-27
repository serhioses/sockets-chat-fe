import { useAuth } from '@/store/useAuth';
import { Outlet } from 'react-router-dom';

export function PublicLayout() {
    const { user } = useAuth();

    return (
        <div>
            <h1>Public</h1>
            {!!user ? <div>There is user</div> : <div>Default</div>}
            <Outlet />
        </div>
    );
}
