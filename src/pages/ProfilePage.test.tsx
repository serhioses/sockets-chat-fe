import { expect, it, vi } from 'vitest';
import { screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { renderApp } from '@/test-utils/renderApp';
import { MOCK_AVATAR_URL, MOCK_TOKEN } from '@/mocks/constants';
import { useBoundStore } from '@/store/useBoundStore';
import { ALLOWED_IMAGE_FORMATS } from '@/constants/file';
import { server } from '@/mocks/server/server';
import { THttpResponse } from '@/types/http';

const apiURL = import.meta.env.VITE_API_URL;

async function renderProfile() {
    renderApp('/profile');

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loader'));

    const fileInput: HTMLInputElement = screen.getByLabelText(/upload profile image/i);

    return fileInput;
}

it('should render', async () => {
    const spy = vi.spyOn(useBoundStore.getState(), 'connectSocket').mockResolvedValue(undefined);
    document.cookie = `token=${MOCK_TOKEN}`;
    const fileInput = await renderProfile();

    expect(screen.getByRole('heading', { level: 2 }).textContent).toMatchInlineSnapshot(
        '"Profile"',
    );
    expect(screen.getByTestId('profile-image')).toBeInTheDocument();
    expect(fileInput).toBeInTheDocument();
    expect(screen.getByTestId('user-fullname').textContent).toMatchInlineSnapshot('"Test user"');
    expect(screen.getByTestId('user-email').textContent).toMatchInlineSnapshot('"test@mail.com"');
    expect(screen.getByTestId('user-createdAt').textContent).toMatchInlineSnapshot('"2000-09-14"');
    expect(screen.getByTestId('user-status').textContent).toBe('Active');

    spy.mockRestore();
});

it('should not allow to upload invalid images', async () => {
    const spy = vi.spyOn(useBoundStore.getState(), 'connectSocket').mockResolvedValue(undefined);
    document.cookie = `token=${MOCK_TOKEN}`;
    const fileInput = await renderProfile();

    expect(fileInput).toHaveAttribute('accept', ALLOWED_IMAGE_FORMATS.join(', '));

    const uploadFile = new File([''], 'image.png', { type: 'image/png' });
    Object.defineProperty(uploadFile, 'size', {
        value: 1000 * 1000 * 7,
    });
    await userEvent.upload(fileInput, uploadFile);

    expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
        '"File cannot be larger than 5MB."',
    );

    spy.mockRestore();
});

it('should properly update user avatar', async () => {
    const spy = vi.spyOn(useBoundStore.getState(), 'connectSocket').mockResolvedValue(undefined);
    document.cookie = `token=${MOCK_TOKEN}`;
    const fileInput = await renderProfile();

    const uploadFile = new File([Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10])], 'image.png', {
        type: 'image/png',
    });

    await userEvent.upload(fileInput, uploadFile);

    expect(screen.getByTestId('profile-update-avatar-status').textContent).toMatch(/uploading/i);

    await waitFor(() => {
        expect(screen.getByTestId('profile-image')).toHaveAttribute('src', MOCK_AVATAR_URL);
    });

    spy.mockRestore();
});

it('should handle error', async () => {
    server.use(
        http.put<never, never, THttpResponse<unknown>>(`${apiURL}/profile/update-profile`, () => {
            return HttpResponse.json({ errors: [{ message: 'Profile error' }] });
        }),
    );

    const spy = vi.spyOn(useBoundStore.getState(), 'connectSocket').mockResolvedValue(undefined);
    document.cookie = `token=${MOCK_TOKEN}`;
    const fileInput = await renderProfile();

    const uploadFile = new File([Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10])], 'image.png', {
        type: 'image/png',
    });

    await userEvent.upload(fileInput, uploadFile);

    const error = await screen.findByRole('alert');
    expect(error.textContent).toMatchInlineSnapshot('"Profile error"');

    spy.mockRestore();
});
