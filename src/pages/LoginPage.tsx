import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { MessageSquare } from 'lucide-react';

import { Form } from '@/components/form/Form';
import { FormInput } from '@/components/form/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/constants/auth';
import { useAuth } from '@/store/useAuth';
import { EAsyncStatus } from '@/constants/status';
import { AuthIllustration } from '@/components/auth/AutIllustration';

export function LoginPage() {
    const methods = useForm({
        resolver: zodResolver(loginSchema),
        reValidateMode: 'onSubmit',
    });
    const { status, login, error, formErrors } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    useEffect(() => {
        if (status === EAsyncStatus.FULFILLED) {
            navigate('/', { replace: true });
        }
    }, [status]);

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
                            <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                            <p className="text-base-content/60">Sign in to your account</p>
                        </div>
                    </div>

                    <Form methods={methods} onSubmit={login}>
                        {formErrors && (
                            <div className="flex flex-col gap-2">
                                {formErrors.map((err) => {
                                    return (
                                        <div key={err} className="text-error">
                                            {err}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
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
                            Don't have an account?{' '}
                            <Link to="/auth/signup" className="link link-primary">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <AuthIllustration
                title="Welcome back!"
                text="Sign in to continue your converstations and catch up with your messanges."
            />
        </div>
    );
}
