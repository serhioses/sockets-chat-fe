import { expect, it } from 'vitest';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import toast from 'react-hot-toast';

import { Snackbar } from '@/components/snackbar/Snackbar';

it('can show and auto hide', async () => {
    render(<Snackbar options={{ duration: 100 }} />);

    toast('Test toast');

    const el = await screen.findByText(/test toast/i);
    expect(el).toBeInTheDocument();

    await waitForElementToBeRemoved(el, { timeout: 1500 });

    expect(screen.queryByText(/test toast/i)).not.toBeInTheDocument();
});

it('can close on button click', async () => {
    render(<Snackbar options={{ duration: 100 }} />);

    toast('Test toast 2');

    const el = await screen.findByText(/test toast/i);
    await userEvent.click(screen.getByRole('button'));

    await waitForElementToBeRemoved(el);

    expect(screen.queryByText(/test toast/i)).not.toBeInTheDocument();
});
