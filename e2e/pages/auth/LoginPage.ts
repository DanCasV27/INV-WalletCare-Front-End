import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly inlineAlert: Locator;
  readonly emailFieldError: Locator;
  readonly passwordFieldError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('Correo electrónico');
    // Note: placeholder has a typo in source ("Cotraseña"), using the actual value
    this.passwordInput = page.getByPlaceholder('Cotraseña');
    this.submitButton = page.getByRole('button', { name: 'Iniciar sesión' });
    this.inlineAlert = page.locator('nz-alert');
    this.emailFieldError = page.locator('.ant-form-item-explain-error').first();
    this.passwordFieldError = page.locator('.ant-form-item-explain-error').last();
  }

  async navigate() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectInlineAlert(text: string) {
    await expect(this.inlineAlert).toBeVisible();
    await expect(this.inlineAlert).toContainText(text);
  }

  async expectFieldError(locator: Locator, text: string) {
    await expect(locator).toBeVisible();
    await expect(locator).toContainText(text);
  }

  async expectRedirectToApp() {
    await this.page.waitForURL(/\/app/, { timeout: 15000 });
    await this.page.waitForLoadState('networkidle');
    await expect(this.page).toHaveURL(/\/app/);
  }
}
