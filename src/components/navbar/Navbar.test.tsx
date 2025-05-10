import { MemoryRouter } from 'react-router';
import { expect, it, vi } from 'vitest';
import { render, renderHook, screen } from '@testing-library/react';

import { MOCK_TOKEN } from '@/mocks/constants';
import { Navbar } from '@/components/navbar/Navbar';
import { useBoundStore } from '@/store/useBoundStore';

it('should render correct Navbar for authenticated user', async () => {
    const spy = vi.spyOn(useBoundStore.getState(), 'connectSocket').mockResolvedValue(undefined);
    document.cookie = `token=${MOCK_TOKEN}`;
    const { result } = renderHook(() => useBoundStore());

    render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>,
    );

    expect(screen.getByTestId('navbar-skeleton')).toBeInTheDocument();

    await result.current.getMe();

    expect(screen.queryByTestId('navbar-skeleton')).not.toBeInTheDocument();
    expect(screen.queryByTestId('login-link')).not.toBeInTheDocument();
    expect(screen.getByTestId('profile-link').textContent).toMatchInlineSnapshot(
        '"Profile (Test user)"',
    );
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
    spy.mockRestore();
});

it('should render correct Navbar for unauthenticated user', async () => {
    const spy = vi.spyOn(useBoundStore.getState(), 'connectSocket').mockResolvedValue(undefined);
    const { result } = renderHook(() => useBoundStore());

    render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>,
    );

    expect(screen.getByTestId('navbar-skeleton')).toBeInTheDocument();

    await result.current.getMe();

    expect(screen.getByTestId('login-link')).toBeInTheDocument();
    expect(screen.queryByTestId('profile-link')).not.toBeInTheDocument();
    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
    spy.mockRestore();
});
