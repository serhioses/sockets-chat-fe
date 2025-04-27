import { useEffect } from 'react';
import { AppRoutes } from '@/routes/AppRoutes';
import { useAuth } from './store/useAuth';
import { Snackbar } from '@/components/snackbar/Snackbar';

export default function App() {
    const { getMe, ...rest } = useAuth();
    console.log(rest);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        getMe();
    }, [getMe]);

    // useEffect(() => {
    //     http.get('/chat/users')
    //         .then((r) => {
    //             console.log(r);
    //         })
    //         .catch(console.log);
    // }, []);

    // function renderRoutes() {
    //     if (meStatus === EAsyncStatus.PENDING) {
    //         return <div>Loading rotes...</div>;
    //     }

    //     if (meStatus === EAsyncStatus.FULFILLED) {
    //         return <AppRoutes />;
    //     }

    //     return null;
    // }

    return (
        <>
            {/* {renderRoutes()} */}
            <AppRoutes />
            {/* <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes> */}
            <Snackbar />
        </>
    );
}
