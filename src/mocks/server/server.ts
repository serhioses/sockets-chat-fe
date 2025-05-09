import { setupServer } from 'msw/node';

import { restHandlers } from '@/mocks/server/handlers';

export const server = setupServer(...restHandlers);
