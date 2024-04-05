import { Browser, Page, chromium } from '@playwright/test';

async function globalSetup() {
  const browser: Browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page: Page = await context.newPage();

  // run login code

  // save the state

  await page.context().storageState({ path: './LoginAuth.json' });
  await browser.close();
}

export default globalSetup;
