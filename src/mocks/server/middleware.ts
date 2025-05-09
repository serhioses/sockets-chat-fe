import { DefaultBodyType, HttpResponse, HttpResponseResolver, PathParams } from 'msw';

import { MOCK_TOKEN } from '@/mocks/constants';

export function requireAuth<
    Params extends PathParams,
    RequestBodyType extends DefaultBodyType,
    ResponseBodyType extends DefaultBodyType,
>(
    resolver: HttpResponseResolver<Params, RequestBodyType, ResponseBodyType>,
): HttpResponseResolver<Params, RequestBodyType, ResponseBodyType> {
    return (info, ...rest) => {
        const token = info.cookies.token;

        if (token !== MOCK_TOKEN) {
            return HttpResponse.json(
                { errors: [{ message: 'Unauthorized.' }] } as unknown as ResponseBodyType,
                { status: 200 },
            );
        }

        return resolver(info, ...rest);
    };
}
