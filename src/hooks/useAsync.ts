import { useCallback, useReducer } from 'react';
import { AxiosResponse } from 'axios';

import { EAsyncStatus } from '@/constants/status';
import { TMaybe } from '@/types/utilities';
import { THttpResponse } from '@/types/http';

export function useAsync<T, R extends THttpResponse<T>>(initialState?: TState<T>) {
    const [state, dispatch] = useReducer(
        asyncReducer,
        initialState ?? { status: EAsyncStatus.IDLE },
    );

    const run = useCallback(
        (promise: Promise<AxiosResponse<R>>) => {
            dispatch({ type: EAsyncStatus.PENDING });

            return promise.then(
                (res: AxiosResponse<R>) => {
                    if (res.data.errors) {
                        dispatch({
                            type: EAsyncStatus.REJECTED,
                            error: res.data.errors.at(0)?.message,
                        });
                    } else {
                        dispatch({ type: EAsyncStatus.FULFILLED, data: res.data.data });
                    }
                },
                (error) => {
                    console.log('useAsync error:', error);
                    dispatch({ type: EAsyncStatus.REJECTED, error: 'Something went wrong.' });
                },
            );
        },
        [dispatch],
    );

    return { ...state, run, dispatch };
}

type TState<T> = {
    status: EAsyncStatus;
    data?: TMaybe<T>;
    error?: TMaybe<string>;
};

type TAction<T> = {
    type: EAsyncStatus;
    data?: TMaybe<T>;
    error?: TMaybe<string>;
};

function asyncReducer<T>(state: TState<T>, action: TAction<T>): TState<T> {
    switch (action.type) {
        case EAsyncStatus.IDLE: {
            return { ...state, data: action.data, error: action.error };
        }
        case EAsyncStatus.PENDING: {
            return { status: EAsyncStatus.PENDING, data: null, error: null };
        }
        case EAsyncStatus.FULFILLED: {
            return { status: EAsyncStatus.FULFILLED, data: action.data, error: null };
        }
        case EAsyncStatus.REJECTED: {
            return { status: EAsyncStatus.REJECTED, data: null, error: action.error };
        }
        default: {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}
