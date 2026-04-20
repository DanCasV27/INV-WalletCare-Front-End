import { Page, Locator, expect } from '@playwright/test';

export class SignupPage {
  readonly page: Page;

  readonly nameInput: Locator;
  readonly lastnameInput: Locator;
  readonly nicknameInput: Locator;
  readonly idNumberInput: Locator;
  readonly nextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // nz-form-label doesn't generate for/id association — use formcontrolname
    this.nameInput = page.locator('input[formcontrolname="name"]');
    this.lastnameInput = page.locator('input[formcontrolname="lastname"]');
    this.nicknameInput = page.locator('input[formcontrolname="nickname"]');
    this.idNumberInput = page.locator('input[formcontrolname="identificationNumber"]');
    this.nextButton = page.getByRole('button', { name: 'Siguiente' });
  }

  async navigate() {
    await this.page.goto('/signup');
    await this.page.waitForLoadState('networkidle');
  }

  async expectFieldError(text: string) {
    await expect(this.page.locator('.ant-form-item-explain-error').filter({ hasText: text })).toBeVisible();
  }
}
