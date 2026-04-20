import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/auth/LoginPage';

type AuthFixtures = {
  authenticatedPage: Page;
  adminPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(
      process.env.TEST_USER_EMAIL ?? 'castrodaniel612@gmail.com',
      process.env.TEST_USER_PASSWORD ?? 'AmoAMari02!'
    );
    await page.waitForURL('**/app');
    await use(page);
  },

  adminPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(
      process.env.TEST_ADMIN_EMAIL ?? 'admin@walletcare.com',
      process.env.TEST_ADMIN_PASSWORD ?? 'Admin123!'
    );
    await page.waitForURL('**/app');
    await use(page);
  },
});

export { expect } from '@playwright/test';
