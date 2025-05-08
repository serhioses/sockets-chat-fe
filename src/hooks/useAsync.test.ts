import { expect, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAsync } from '@/hooks/useAsync';
import { EAsyncStatus } from '@/constants/status';
import { deffered } from '@/test-utils/deffered';
import { THttpResponse } from '@/types/http';

const defaultState = {
    status: EAsyncStatus.IDLE,
    run: expect.any(Function) as unknown,
    dispatch: expect.any(Function) as unknown,
};
const pendingState = {
    ...defaultState,
    status: EAsyncStatus.PENDING,
    data: null,
    error: null,
};
const resolvedState = {
    ...defaultState,
    status: EAsyncStatus.FULFILLED,
    error: null,
};
const rejectedState = {
    ...defaultState,
    status: EAsyncStatus.REJECTED,
    data: null,
    error: expect.any(String) as string,
};

it('should call run with a promise that resolves', async () => {
    const { promise, resolve } = deffered<number>();
    const { result } = renderHook(() => useAsync<number, THttpResponse<number>>());

    expect(result.current).toEqual(defaultState);

    let p: Promise<void>;
    act(() => {
        p = result.current.run(promise);
    });

    expect(result.current).toEqual(pendingState);

    await act(async () => {
        resolve({ data: { data: 1 } });
        await p;
    });
    expect(result.current).toEqual({ ...resolvedState, data: 1 });
});

it('should call run with a promise that rejects', async () => {
    const { promise, reject } = deffered<number>();
    const { result } = renderHook(() => useAsync<number, THttpResponse<number>>());

    expect(result.current).toEqual(defaultState);

    let p: Promise<void>;
    act(() => {
        p = result.current.run(promise);
    });

    expect(result.current).toEqual(pendingState);

    await act(async () => {
        reject();
        await p.catch();
    });

    expect(result.current).toEqual(rejectedState);
});

it('allows to set an initial state', () => {
    const { result } = renderHook((props) => useAsync(props), {
        initialProps: { status: EAsyncStatus.PENDING, data: 10, error: null },
    });

    expect(result.current).toEqual({
        ...defaultState,
        status: EAsyncStatus.PENDING,
        data: 10,
        error: null,
    });
});

it('throws an error if run is called with a non-promise argument', () => {
    const { result } = renderHook(() => useAsync());

    const run = result.current.run as unknown as () => void;
    expect(() => run()).toThrowErrorMatchingInlineSnapshot(
        '[Error: run function must be called only with a Promise.]',
    );
});
