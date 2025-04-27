import { EAsyncStatus } from '@/constants/status';
import { useAuth } from '@/store/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Navbar() {
    const { logOut, logOutStatus } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (logOutStatus === EAsyncStatus.FULFILLED) {
            navigate('/auth/login', { replace: true });
        }
    }, [logOutStatus]);

    return (
        <div>
            <p>Navbar</p>
            <button className="btn" onClick={logOut}>
                Logout
            </button>
        </div>
    );
}
