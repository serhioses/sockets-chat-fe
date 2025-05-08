import toast, { DefaultToastOptions, ToastBar, Toaster } from 'react-hot-toast';
import { Info, X } from 'lucide-react';

type TSnackbarProps = {
    options?: DefaultToastOptions;
};

export function Snackbar({ options = {} }: TSnackbarProps) {
    return (
        <Toaster
            toastOptions={{
                duration: 3000,
                ...options,
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
