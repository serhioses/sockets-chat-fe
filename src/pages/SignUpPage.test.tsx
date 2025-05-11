import { expect, it, vi } from 'vitest';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { renderApp } from '@/test-utils/renderApp';
import { MOCK_TOKEN } from '@/mocks/constants';
import { useBoundStore } from '@/store/useBoundStore';
import { server } from '@/mocks/server/server';
import { THttpResponse } from '@/types/http';

async function renderSignUp() {
    renderApp('/auth/signup');

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loader'));

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    return { nameInput, emailInput, passwordInput, submitButton };
}

it('should render', async () => {
    const { nameInput, emailInput, passwordInput, submitButton } = await renderSignUp();

    expect(screen.getByTestId('auth-subtitle').textContent).toMatchInlineSnapshot(
        '"Get started with your free account"',
    );

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
});

it('should properly show errors', async () => {
    const spy = vi.spyOn(useBoundStore.getState(), 'signUp').mockResolvedValue(undefined);
    const { nameInput, emailInput, passwordInput, submitButton } = await renderSignUp();

    await userEvent.click(submitButton);

    let alertTexts = screen.getAllByRole('alert').map((el) => el.textContent);
    expect(alertTexts).toMatchInlineSnapshot(`
      [
        "Full name is required",
        "Email is required",
        "Password is required",
      ]
    `);

    await userEvent.type(nameInput, ' ');
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.type(passwordInput, 'short');
    await userEvent.click(submitButton);

    alertTexts = screen.getAllByRole('alert').map((el) => el.textContent);
    expect(alertTexts).toMatchInlineSnapshot(`
      [
        "Full name must be at least 1 character long.",
        "Invalid email",
        "Password must be at least 6 characters.",
      ]
    `);

    await userEvent.clear(nameInput);
    await userEvent.clear(emailInput);
    await userEvent.clear(passwordInput);

    await userEvent.type(nameInput, 'a'.repeat(70));
    await userEvent.type(emailInput, 'valid@mail.com');
    await userEvent.type(passwordInput, 'kdfg78JHF__3sd3');
    await userEvent.click(submitButton);

    expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
        '"Full name cannot be more than 64 characters."',
    );

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Full name');
    await userEvent.click(submitButton);

    expect(screen.queryAllByRole('alert')).toHaveLength(0);
    spy.mockRestore();
});

it('should register user', async () => {
    const spy = vi.spyOn(useBoundStore.getState(), 'connectSocket').mockResolvedValue(undefined);
    const { nameInput, emailInput, passwordInput, submitButton } = await renderSignUp();

    await userEvent.type(nameInput, 'John Doe');
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

it('should show error when email already exist', async () => {
    server.use(
        http.post<never, never, THttpResponse<unknown>>(
            'http://localhost:8000/api/auth/signup',
            () => {
                return HttpResponse.json({
                    errors: [{ message: 'User with this email already exists' }],
                });
            },
        ),
    );

    const spy = vi.spyOn(useBoundStore.getState(), 'connectSocket').mockResolvedValue(undefined);

    const { nameInput, emailInput, passwordInput, submitButton } = await renderSignUp();

    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'valid@mail.com');
    await userEvent.type(passwordInput, 'kdfg78JHF__3sd3');
    await userEvent.click(submitButton);

    const snackbar = await screen.findByRole('status');
    expect(snackbar.textContent).toMatchInlineSnapshot('"User with this email already exists"');
    expect(window.location.pathname).toBe('/auth/signup');

    spy.mockRestore();
});
