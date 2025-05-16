import { delay, http, HttpResponse } from 'msw';

import { THttpResponse } from '@/types/http';
import { TUser } from '@/types/user';
import { requireAuth } from '@/mocks/server/middleware';
import {
    MOCK_AVATAR_URL,
    MOCK_MESSAGE_HISTORY,
    MOCK_USER,
    MOCK_USER_LIST,
} from '@/mocks/constants';
import { TMessage } from '@/types/chat';

const apiURL = import.meta.env.VITE_API_URL;

export const restHandlers = [
    http.get<never, never, THttpResponse<TUser>>(
        `${apiURL}/auth/me`,
        requireAuth(async () => {
            await delay();

            return HttpResponse.json({ data: MOCK_USER }, { status: 200 });
        }),
    ),
    http.post<never, never, THttpResponse<TUser>>(`${apiURL}/auth/login`, async () => {
        await delay();

        return HttpResponse.json({ data: MOCK_USER }, { status: 200 });
    }),
    http.post<never, never, THttpResponse<TUser>>(`${apiURL}/auth/signup`, async () => {
        await delay();

        return HttpResponse.json({ data: MOCK_USER }, { status: 200 });
    }),
    http.put<never, never, THttpResponse<TUser>>(
        `${apiURL}/profile/update-profile`,
        requireAuth(async () => {
            await delay();

            const data = { ...MOCK_USER, avatar: MOCK_AVATAR_URL };

            return HttpResponse.json({ data }, { status: 200 });
        }),
    ),
    http.get<never, never, THttpResponse<TUser[]>>(
        `${apiURL}/chat/users`,
        requireAuth(async () => {
            await delay();

            return HttpResponse.json({ data: MOCK_USER_LIST }, { status: 200 });
        }),
    ),
    http.get<never, never, THttpResponse<TMessage[]>>(
        `${apiURL}/chat/:contactId`,
        requireAuth(async () => {
            await delay();

            return HttpResponse.json({ data: MOCK_MESSAGE_HISTORY }, { status: 200 });
        }),
    ),
];
