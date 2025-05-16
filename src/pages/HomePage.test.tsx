import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { screen, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react';
import { Server, type Socket as ServerSocket } from 'socket.io';
import { type Socket as ClientSocket } from 'socket.io-client';
import { createServer } from 'node:http';
import { type AddressInfo } from 'node:net';

import { renderApp } from '@/test-utils/renderApp';
import {
    MOCK_MESSAGE,
    MOCK_MESSAGE_HISTORY,
    MOCK_TOKEN,
    MOCK_USER,
    MOCK_USER_LIST,
} from '@/mocks/constants';
import { useBoundStore } from '@/store/useBoundStore';
import userEvent from '@testing-library/user-event';
import { TMessage } from '@/types/chat';

function waitForEvent(socket: ServerSocket | ClientSocket, event: string) {
    return new Promise((resolve) => {
        socket.once(event, resolve);
    });
}

async function renderHome() {
    renderApp();

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loader'));
}

describe('HomePage', () => {
    let io: Server | undefined = undefined;
    let serverSocket: ServerSocket | undefined = undefined;

    beforeAll(() => {
        const httpServer = createServer();
        io = new Server(httpServer, { cors: { origin: '*', credentials: true } });
        httpServer.listen(() => {
            const port = (httpServer.address() as AddressInfo).port;
            io!.on('connection', (socket) => {
                serverSocket = socket;
                io!.emit('getOnlineUsers', [MOCK_USER.id, MOCK_USER_LIST[0].id]);
            });
            vi.stubEnv('VITE_SOCKET_URL', `http://localhost:${port}`);
        });
    });

    afterAll(async () => {
        await io!.close();
        vi.unstubAllEnvs();
        io = undefined;
        serverSocket = undefined;
    });

    it('should render', async () => {
        document.cookie = `token=${MOCK_TOKEN}`;
        await renderHome();

        expect(screen.getByTestId('chat-placeholder')).toBeInTheDocument();
        await waitForElementToBeRemoved(screen.getByTestId('chat-sidebar-skeleton'));

        expect(screen.getByTestId('chat-sidebar-title').textContent).toMatchInlineSnapshot(
            '"Contacts"',
        );
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
        expect(screen.getAllByTestId('chat-contact')).toHaveLength(MOCK_USER_LIST.length);

        await waitFor(() => {
            expect(screen.getByTestId('chat-online-count').textContent).toMatch(/\(1 online\)/i);
        });
    });

    it('should filter users by online status', async () => {
        document.cookie = `token=${MOCK_TOKEN}`;
        await renderHome();

        await waitForElementToBeRemoved(screen.getByTestId('chat-sidebar-skeleton'));
        await waitForEvent(useBoundStore.getState().socket as ClientSocket, 'getOnlineUsers');

        await userEvent.click(screen.getByRole('checkbox'));
        expect(screen.getAllByTestId('chat-contact')).toHaveLength(1);

        await userEvent.click(screen.getByRole('checkbox'));
        expect(screen.getAllByTestId('chat-contact')).toHaveLength(MOCK_USER_LIST.length);
    });

    it('should select/deselect user and load/clear message history', async () => {
        document.cookie = `token=${MOCK_TOKEN}`;
        await renderHome();

        await waitForElementToBeRemoved(screen.getByTestId('chat-sidebar-skeleton'));
        await waitForEvent(useBoundStore.getState().socket as ClientSocket, 'getOnlineUsers');

        const joinRoomPromise = waitForEvent(serverSocket!, 'joinRoom');
        await userEvent.click(screen.getAllByTestId('chat-contact')[0]);
        await joinRoomPromise;

        const selectedUserEl = screen.getByTestId('chat-selected-user');
        expect(selectedUserEl).toBeInTheDocument();
        expect(screen.getByTestId('chat-selected-user-name').textContent).toBe(
            MOCK_USER_LIST[0].fullName,
        );

        await waitForElementToBeRemoved(screen.getByTestId('chat-messages-loader'));
        expect(screen.getAllByTestId('chat-message')).toHaveLength(MOCK_MESSAGE_HISTORY.length);
        expect(screen.getByLabelText(/upload an image/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/message text/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add emoji/i })).toBeInTheDocument();

        await userEvent.click(within(selectedUserEl).getByRole('button'));
        expect(screen.queryByTestId('chat-selected-user')).not.toBeInTheDocument();
        expect(screen.getByTestId('chat-placeholder')).toBeInTheDocument();
    });

    it('should send text messages', async () => {
        document.cookie = `token=${MOCK_TOKEN}`;
        await renderHome();

        await waitForElementToBeRemoved(screen.getByTestId('chat-sidebar-skeleton'));
        await waitForEvent(useBoundStore.getState().socket as ClientSocket, 'getOnlineUsers');

        const joinRoomPromise = waitForEvent(serverSocket!, 'joinRoom');
        await userEvent.click(screen.getAllByTestId('chat-contact')[0]);
        await joinRoomPromise;

        await waitForElementToBeRemoved(screen.getByTestId('chat-messages-loader'));
        const messageInput = screen.getByLabelText(/message text/i);
        const submitButton = screen.getByRole('button', { name: /send message/i });

        await userEvent.click(submitButton);

        expect(messageInput).toHaveAttribute('aria-invalid', 'true');

        serverSocket!.on(
            'message',
            (_: unknown, __: unknown, cb: (_: { data: TMessage }) => void) => {
                cb({ data: MOCK_MESSAGE });
            },
        );
        await userEvent.type(messageInput, 'New message');
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getAllByTestId('chat-message')).toHaveLength(
                MOCK_MESSAGE_HISTORY.length + 1,
            );
        });
        expect(messageInput).toHaveValue('');

        // NOTE: message with image is not tested due to unclear error with file.
    });
});
