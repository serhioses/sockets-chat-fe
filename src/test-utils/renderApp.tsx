import { render } from '@testing-library/react';

import App from '@/App';

export function renderApp(route?: string) {
    window.history.pushState({}, 'Test page', route ?? '/');

    return render(<App />);
}
