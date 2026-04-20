import { test, expect } from '@playwright/test';
import { SignupPage } from '../../pages/auth/SignupPage';

test.describe('Signup: validation', () => {
  let signupPage: SignupPage;

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
    await signupPage.navigate();
  });

  test('Signup: Empty step 1 — shows required field errors', async () => {
    await signupPage.nextButton.click();

    await signupPage.expectFieldError('Por favor ingrese su nombre.');
    await signupPage.expectFieldError('Por favor ingrese su apellido.');
    await signupPage.expectFieldError('Por favor ingrese su alias.');
    await signupPage.expectFieldError('Por favor ingrese su número de identificación.');
  });

  test('Signup: Invalid name format — shows pattern error', async () => {
    await signupPage.nameInput.fill('Juan123');
    await signupPage.nextButton.click();

    await signupPage.expectFieldError('El nombre solo puede contener letras.');
  });
});
