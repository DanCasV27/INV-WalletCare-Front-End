import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/auth/LoginPage';

type AuthFixtures = {
  authenticatedPage: Page;
  adminPage: Page;
};

export const test = base.extend<AuthFixtures>({
  // El proyecto 'chromium' ya carga e2e/.auth/user.json en el contexto del browser.
  // El JWT está en localStorage desde el inicio — no se necesita hacer login.
  authenticatedPage: async ({ page }, use) => {
    await use(page);
  },

  // El admin no tiene storageState configurado aún.
  // Hace login real hasta que se implemente e2e/.auth/admin.json.
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
