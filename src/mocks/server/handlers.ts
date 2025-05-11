import { delay, http, HttpResponse } from 'msw';

import { THttpResponse } from '@/types/http';
import { TUser } from '@/types/user';
import { requireAuth } from '@/mocks/server/middleware';

export const restHandlers = [
    http.get<never, never, THttpResponse<Partial<TUser>>>(
        'http://localhost:8000/api/auth/me',
        requireAuth(async () => {
            await delay();

            return HttpResponse.json({ data: { id: '1', fullName: 'Test user' } }, { status: 200 });
        }),
    ),
    http.post<never, never, THttpResponse<TUser>>(
        'http://localhost:8000/api/auth/login',
        async () => {
            await delay();

            return HttpResponse.json(
                {
                    data: {
                        id: '1',
                        fullName: 'Test user',
                        email: 'test@mail.com',
                        createdAt: '',
                        avatar: '',
                    },
                },
                { status: 200 },
            );
        },
    ),
    http.post<never, never, THttpResponse<TUser>>(
        'http://localhost:8000/api/auth/signup',
        async () => {
            await delay();

            return HttpResponse.json(
                {
                    data: {
                        id: '1',
                        fullName: 'Test user',
                        email: 'test@mail.com',
                        createdAt: '',
                        avatar: '',
                    },
                },
                { status: 200 },
            );
        },
    ),
];
