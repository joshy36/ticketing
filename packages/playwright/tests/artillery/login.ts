import { clickingAround } from '../commands/clickingAround';
import { testLogin } from '../commands/login';
import { Page } from '@playwright/test';

export async function artilleryScript(page: Page) {
  // await testLogin(page);
  await clickingAround(page);
}
