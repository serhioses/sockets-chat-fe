import { delay, http, HttpResponse } from 'msw';

import { THttpResponse } from '@/types/http';
import { TUser } from '@/types/user';
import { requireAuth } from '@/mocks/server/middleware';
import { MOCK_AVATAR_URL, MOCK_USER } from '@/mocks/constants';

export const restHandlers = [
    http.get<never, never, THttpResponse<TUser>>(
        'http://localhost:8000/api/auth/me',
        requireAuth(async () => {
            await delay();

            return HttpResponse.json({ data: MOCK_USER }, { status: 200 });
        }),
    ),
    http.post<never, never, THttpResponse<TUser>>(
        'http://localhost:8000/api/auth/login',
        async () => {
            await delay();

            return HttpResponse.json({ data: MOCK_USER }, { status: 200 });
        },
    ),
    http.post<never, never, THttpResponse<TUser>>(
        'http://localhost:8000/api/auth/signup',
        async () => {
            await delay();

            return HttpResponse.json({ data: MOCK_USER }, { status: 200 });
        },
    ),
    http.put<never, never, THttpResponse<TUser>>(
        'http://localhost:8000/api/profile/update-profile',
        async () => {
            await delay();

            const data = { ...MOCK_USER, avatar: MOCK_AVATAR_URL };

            return HttpResponse.json({ data }, { status: 200 });
        },
    ),
];
