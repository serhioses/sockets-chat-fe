import toast, { ToastBar, Toaster } from 'react-hot-toast';
import { Info, X } from 'lucide-react';

export function Snackbar() {
    return (
        <Toaster
            toastOptions={{
                duration: 3000,
            }}
        >
            {(t) => (
                <ToastBar toast={t}>
                    {({ message }) => (
                        <>
                            <Info className="text-error" />
                            {message}
                            {t.type !== 'loading' && (
                                <button
                                    onClick={() => toast.dismiss(t.id)}
                                    className="btn btn-circle btn-error btn-xs"
                                >
                                    <X />
                                </button>
                            )}
                        </>
                    )}
                </ToastBar>
            )}
        </Toaster>
    );
}
