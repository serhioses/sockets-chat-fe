import { FallbackProps } from 'react-error-boundary';
import { useAsyncError } from 'react-router';

type TBaseErrorProps = {
    error: unknown;
};

function BaseError({ error }: TBaseErrorProps) {
    return (
        <div className="p-8">
            <div role="alert" className="alert alert-error">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span>Uh oh... There&apos;s a problem. Try refreshing the app.</span>
                {error instanceof Error && <pre>{error.message}</pre>}
            </div>
        </div>
    );
}

export function FullPageError({ error }: FallbackProps) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return <BaseError error={error} />;
}

export function RouteError() {
    const error = useAsyncError();

    return <BaseError error={error} />;
}
