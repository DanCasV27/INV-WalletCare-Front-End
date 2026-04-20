import { Page, Locator, expect } from '@playwright/test';

export class AccountsPage {
  readonly page: Page;

  readonly createButton: Locator;
  readonly modal: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly fieldErrors: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createButton = page.getByRole('button', { name: 'Crear Cuenta' });
    // NG-Zorro renders modal content via CDK portal into .ant-modal at document root
    this.modal = page.locator('.ant-modal');
    // nz-form-label doesn't generate for/id — use formcontrolname
    this.nameInput = this.modal.locator('input[formcontrolname="name"]');
    this.descriptionInput = this.modal.locator('textarea[formcontrolname="description"]');
    this.submitButton = this.modal.getByRole('button', { name: 'Crear' });
    this.cancelButton = this.modal.getByRole('button', { name: 'Cancelar' });
    this.fieldErrors = this.modal.locator('.ant-form-item-explain-error');
  }

  async navigate() {
    await this.page.goto('/app/accounts');
    await this.page.waitForLoadState('networkidle');
  }

  async openCreateModal() {
    await this.createButton.click();
    await expect(this.modal).toBeVisible();
  }

  async fillForm(name: string, description: string, type?: 'Personal' | 'Compartida') {
    await this.nameInput.fill(name);
    if (description) await this.descriptionInput.fill(description);
    if (type) await this.modal.locator('label').filter({ hasText: type }).click();
  }

  async createAccount(name: string, description: string, type: 'Personal' | 'Compartida') {
    await this.openCreateModal();
    await this.fillForm(name, description, type);
    await this.submitButton.click();
    await expect(this.modal).not.toBeVisible();
  }

  async expectAccountVisible(name: string) {
    await expect(this.page.getByRole('row').filter({ hasText: name })).toBeVisible();
  }

  async expectAccountNotVisible(name: string) {
    await expect(this.page.getByRole('row').filter({ hasText: name })).not.toBeVisible();
  }

  async deleteAccount(name: string) {
    const row = this.page.getByRole('row').filter({ hasText: name });
    await row.getByRole('button').last().click();
    await this.page.getByRole('button', { name: 'Sí' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async expectFieldError(text: string) {
    await expect(this.fieldErrors.filter({ hasText: text })).toBeVisible();
  }
}
