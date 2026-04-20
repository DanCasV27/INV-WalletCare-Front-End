import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/auth/LoginPage';
import usersData from '../../data/users.json';

test.describe('Login: valid credentials', () => {
  test('Login: Valid login — redirects to /app', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const user = usersData.validUsers[0];

    await loginPage.navigate();
    await loginPage.login(user.email, user.password);
    await loginPage.expectRedirectToApp();
  });
});

test.describe('Login: invalid credentials', () => {
  for (const cred of usersData.invalidCredentials) {
    test(`Login: Invalid credentials — ${cred.email}`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.navigate();
      await loginPage.login(cred.email, cred.password);

      if (cred.email === 'invalid-email') {
        // Frontend validation: email format error shown in form field
        await loginPage.expectFieldError(loginPage.emailFieldError, cred.expectedError);
      } else {
        // Backend error: shown as inline nz-alert
        await loginPage.expectInlineAlert(cred.expectedError);
      }
    });
  }
});

test.describe('Login: empty fields', () => {
  test('Login: Empty fields — shows required field errors', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.submitButton.click();

    await loginPage.expectFieldError(
      loginPage.emailFieldError,
      'Por favor ingrese su correo electrónico'
    );
    await loginPage.expectFieldError(
      loginPage.passwordFieldError,
      'Por favor ingrese su contraseña'
    );
  });

  test('Login: Empty password only — shows password required error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const user = usersData.validUsers[0];

    await loginPage.navigate();
    await loginPage.emailInput.fill(user.email);
    await loginPage.submitButton.click();

    await loginPage.expectFieldError(
      loginPage.passwordFieldError,
      'Por favor ingrese su contraseña'
    );
  });
});
