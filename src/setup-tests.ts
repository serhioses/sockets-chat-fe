import { afterAll, afterEach, beforeAll } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

import { server } from '@/mocks/server/server';
import { resetAllStores } from '@/lib/utils/store';
import { useBoundStore } from '@/store/useBoundStore';
import { clearCookies } from '@/mocks/utils';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterAll(() => server.close());

afterEach(() => {
    server.resetHandlers();
    clearCookies();
    cleanup();
    useBoundStore.getState().resetAuth();
    resetAllStores();
});
