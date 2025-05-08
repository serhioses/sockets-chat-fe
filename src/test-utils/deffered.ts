import { THttpResponse } from '@/types/http';
import { AxiosResponse } from 'axios';

type TResolveValue<T> = Partial<AxiosResponse<THttpResponse<T>>>;

export function deffered<T>() {
    let resolve;
    let reject;

    const promise = new Promise<TResolveValue<T>>((res, rej) => {
        resolve = res;
        reject = rej;
    });

    return {
        promise,
        resolve: resolve as unknown as (
            value: TResolveValue<T> | PromiseLike<TResolveValue<T>>,
        ) => void,
        reject: reject as unknown as (reason?: unknown) => void,
    };
}
