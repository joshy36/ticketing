import { Page, expect } from '@playwright/test';

export async function testLogin(page: Page) {
  await page.goto('https://www.jupiter-tickets.com/');
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByPlaceholder('name@example.com').click();
  await page.getByPlaceholder('name@example.com').fill('36bend@gmail.com');
  await page.getByPlaceholder('name@example.com').press('Tab');
  await page.getByLabel('Password').fill('qwerty');
  await page.getByRole('button', { name: 'Sign In with Email' }).click();
  await expect(page.getByRole('button', { name: 'pfp' })).toBeVisible();
  await page.getByRole('button', { name: 'Search events, artists...' }).click();
}
