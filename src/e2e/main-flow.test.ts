import { buildFakeUser } from '@/test-utils/user';
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Main flow', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /create account/i }).click();

    const fakeUser = buildFakeUser();
    await page.getByLabel('Full name').fill(fakeUser.fullName);
    await page.getByLabel('Email').fill(fakeUser.email);
    await page.getByLabel('Password').fill(fakeUser.password);
    await page.getByRole('button').click();

    await expect(page.getByTestId('chat-placeholder')).toBeAttached();

    await page.getByRole('button', { name: /logout/i }).click();

    await page.getByLabel('Email').fill(fakeUser.email);
    await page.getByLabel('Password').fill(fakeUser.password);
    await page.getByRole('button').click();

    await page.locator('[data-testid="chat-contact"]').nth(0).click();

    const randomText = 'Hello ' + crypto.randomUUID() + '!';
    await page.getByLabel(/message text/i).fill(randomText);
    await page.getByLabel(/add emoji/i).click();
    await page.getByLabel(/Type to search for an emoji/i).fill('laugh');
    await page.getByLabel(/rolling on the floor laughing/i).click();
    await page.getByLabel(/upload an image/i).setInputFiles(path.join(__dirname, '1.jpg'));

    const currentMessageCount = await page.getByTestId('chat-message').count();
    await page.getByLabel(/send message/i).click();

    await expect(page.getByTestId('chat-message')).toHaveCount(currentMessageCount + 1);
    expect(await page.getByTestId('chat-message').last().textContent()).toContain(randomText);
    await expect(
        page.locator('[data-testid="chat-message"]:last-child img[src*="cloudinary"]'),
    ).toBeAttached();
});
