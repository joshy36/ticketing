import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.jupiter-tickets.com/');
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await page.getByRole('link', { name: 'image' }).click();
  await page.getByRole('link', { name: 'Explore Events' }).click();
  await page
    .getByRole('link', { name: 'this is a test event where we' })
    .click();
  await expect(page.getByRole('heading', { name: 'test' })).toBeVisible();
  await page.getByText('Jan 27, 1:30 AM').click();
  await page.getByRole('link', { name: 'image' }).click();
  await expect(
    page.getByRole('link', { name: 'Explore Events' })
  ).toBeVisible();
});
