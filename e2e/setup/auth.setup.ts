import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/auth/LoginPage';
import * as fs from 'fs';
import * as path from 'path';

const userAuthFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate as user', async ({ page }) => {
  fs.mkdirSync(path.dirname(userAuthFile), { recursive: true });

  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(
    process.env.TEST_USER_EMAIL ?? 'castrodaniel612@gmail.com',
    process.env.TEST_USER_PASSWORD ?? 'AmoAMari02!'
  );
  await page.waitForURL('**/app');
  await page.context().storageState({ path: userAuthFile });
});
