import { expect, it, vi } from 'vitest';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { renderApp } from '@/test-utils/renderApp';
import { MOCK_TOKEN } from '@/mocks/constants';
import { useBoundStore } from '@/store/useBoundStore';
import { server } from '@/mocks/server/server';
import { THttpResponse } from '@/types/http';

const apiURL = import.meta.env.VITE_API_URL;

async function renderLogin() {
    renderApp('/auth/login');

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loader'));

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    return { emailInput, passwordInput, submitButton };
}

it('should render', async () => {
    const { emailInput, passwordInput, submitButton } = await renderLogin();

    expect(screen.getByTestId('auth-subtitle').textContent).toMatchInlineSnapshot(
        '"Sign in to your account"',
    );

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create account/i })).toBeInTheDocument();
});

it('should properly show errors', async () => {
    const spy = vi.spyOn(useBoundStore.getState(), 'login').mockResolvedValue(undefined);
    const { emailInput, passwordInput, submitButton } = await renderLogin();

    await userEvent.click(submitButton);

    let alertTexts = screen.getAllByRole('alert').map((el) => el.textContent);
    expect(alertTexts).toMatchInlineSnapshot(`
      [
        "Email is required",
        "Password is required",
      ]
    `);

    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.type(passwordInput, 'short');
    await userEvent.click(submitButton);

    alertTexts = screen.getAllByRole('alert').map((el) => el.textContent);
    expect(alertTexts).toMatchInlineSnapshot(`
      [
        "Invalid email",
        "Password must be at least 6 characters.",
      ]
    `);

    await userEvent.clear(emailInput);
    await userEvent.clear(passwordInput);
    await userEvent.type(emailInput, 'valid@mail.com');
    await userEvent.type(passwordInput, 'kdfg78JHF__3sd3');
    await userEvent.click(submitButton);

    expect(screen.queryAllByRole('alert')).toHaveLength(0);
    spy.mockRestore();
});

it('should log user in', async () => {
    const spy = vi.spyOn(useBoundStore.getState(), 'connectSocket').mockResolvedValue(undefined);
    const { emailInput, passwordInput, submitButton } = await renderLogin();

    await userEvent.type(emailInput, 'valid@mail.com');
    await userEvent.type(passwordInput, 'kdfg78JHF__3sd3');

    document.cookie = `token=${MOCK_TOKEN}`;
    await userEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    await waitForElementToBeRemoved(submitButton);
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loader'));

    expect(window.location.pathname).toBe('/');
    spy.mockRestore();
});

it('should show error when wrong credentials', async () => {
    server.use(
        http.post<never, never, THttpResponse<unknown>>(`${apiURL}/auth/login`, () => {
            return HttpResponse.json({ errors: [{ message: 'Login error' }] });
        }),
    );

    const spy = vi.spyOn(useBoundStore.getState(), 'connectSocket').mockResolvedValue(undefined);

    const { emailInput, passwordInput, submitButton } = await renderLogin();

    await userEvent.type(emailInput, 'valid@mail.com');
    await userEvent.type(passwordInput, 'kdfg78JHF__3sd3');
    await userEvent.click(submitButton);

    const snackbar = await screen.findByRole('status');
    expect(snackbar.textContent).toMatchInlineSnapshot('"Login error"');
    expect(window.location.pathname).toBe('/auth/login');

    spy.mockRestore();
});
