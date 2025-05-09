export function PageLoader() {
    return (
        <div className="fixed inset-0 flex items-center justify-center" data-testid="page-loader">
            <span className="loading loading-spinner loading-xl"></span>
        </div>
    );
}
