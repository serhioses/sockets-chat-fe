import { Link } from 'react-router-dom';

export function NotFound() {
    return (
        <main className="grid h-dvh place-items-center px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-base font-semibold">404</p>
                <h2 className="mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
                    Page not found
                </h2>
                <p className="mt-6 text-lg text-primary font-medium text-pretty sm:text-xl/8">
                    Sorry, we couldn’t find the page you’re looking for.
                </p>
                <div className="mt-10">
                    <Link to="/" className="btn btn-primary">
                        Go back home
                    </Link>
                </div>
            </div>
        </main>
    );
}
