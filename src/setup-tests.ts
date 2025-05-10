import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

import { server } from '@/mocks/server/server';
import { resetAllStores } from '@/lib/utils/store';
import { useBoundStore } from '@/store/useBoundStore';
import { clearCookies } from '@/mocks/utils';

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterAll(() => server.close());

afterEach(() => {
    server.resetHandlers();
    cleanup();
    useBoundStore.getState().resetAuth();
    resetAllStores();
    clearCookies();
});
