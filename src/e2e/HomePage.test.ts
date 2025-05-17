import { test, expect } from '@playwright/test';

test('HomePage test fly', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/vite/i);

    await page.getByLabel('Email').fill('test@test.com');
    await page.getByLabel('Password').fill('123456');
    await page.getByRole('button').click();

    await expect(page.getByTestId('chat-placeholder')).toBeAttached();
});
