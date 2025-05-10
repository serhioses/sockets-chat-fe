import { expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { THEMES } from '@/constants/themes';
import { renderApp } from '@/test-utils/renderApp';

it('should render', () => {
    renderApp('/settings');

    const buttons = screen.getAllByTestId('theme-button');
    expect(buttons).toHaveLength(THEMES.length);
    expect(buttons[0].textContent).toMatchInlineSnapshot('"Light"');
});

it('should properly change theme', async () => {
    renderApp('/settings');

    expect(localStorage.getItem('themeName')).toBe(null);

    const themeToSelect = THEMES[2];
    const themeButton = screen.getByRole('button', { name: new RegExp(themeToSelect, 'i') });

    await userEvent.click(themeButton);

    expect(JSON.parse(localStorage.getItem('themeName')!)).toMatchInlineSnapshot('"cupcake"');
    expect(document.documentElement.dataset.theme).toBe(themeToSelect);
    expect(themeButton).toHaveClass('bg-base-200');
});
