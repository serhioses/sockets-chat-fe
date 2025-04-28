import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { MessageSquare } from 'lucide-react';

import { Form } from '@/components/form/Form';
import { FormInput } from '@/components/form/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '@/constants/auth';
import { useBoundStore } from '@/store/useBoundStore';
import { EAsyncStatus } from '@/constants/status';
import { AuthIllustration } from '@/components/auth/AutIllustration';

export function SignUpPage() {
    const methods = useForm({
        resolver: zodResolver(signUpSchema),
        reValidateMode: 'onSubmit',
    });
    const {
        signUp,
        signUpState: { status, error, formErrors },
    } = useBoundStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    useEffect(() => {
        if (status === EAsyncStatus.FULFILLED) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            navigate('/', { replace: true });
        }
    }, [navigate, status]);

    return (
        <div className="min-h-dvh grid lg:grid-cols-2">
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div
                                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
                            >
                                <MessageSquare className="size-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                            <p className="text-base-content/60">
                                Get started with your free account
                            </p>
                        </div>
                    </div>

                    <Form methods={methods} onSubmit={signUp}>
                        {formErrors && (
                            <div className="flex flex-col gap-2">
                                {formErrors.map((err: string) => {
                                    return (
                                        <div key={err} className="text-error">
                                            {err}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <FormInput name="fullName" label="Full name" id="full-name" />
                        <FormInput name="email" label="Email" id="email" type="email" />
                        <FormInput name="password" label="Password" id="password" type="password" />
                        <button
                            type="submit"
                            className="btn btn-soft btn-primary btn-lg w-full mt-4"
                        >
                            {status === EAsyncStatus.PENDING && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Submit
                        </button>
                    </Form>

                    <div className="text-center">
                        <p className="text-base-content/60">
                            Already have an account?{' '}
                            <Link to="/auth/login" className="link link-primary">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <AuthIllustration
                title="Join our community"
                text="Connect with friends, share moments, and stay in touch with your loved ones."
            />
        </div>
    );
}
