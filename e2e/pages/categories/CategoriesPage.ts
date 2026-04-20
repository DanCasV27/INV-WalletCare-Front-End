import { Page, Locator, expect } from '@playwright/test';

export class CategoriesPage {
  readonly page: Page;

  readonly createButton: Locator;
  readonly modal: Locator;
  readonly nameInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly fieldErrors: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createButton = page.getByRole('button', { name: 'Crear Categoria' });
    // NG-Zorro renders modal content via CDK portal into .ant-modal at document root
    this.modal = page.locator('.ant-modal');
    // nz-form-label doesn't generate for/id — use formcontrolname
    this.nameInput = this.modal.locator('input[formcontrolname="name"]');
    this.submitButton = this.modal.getByRole('button', { name: 'Crear' });
    this.cancelButton = this.modal.getByRole('button', { name: 'Cancelar' });
    this.fieldErrors = this.modal.locator('.ant-form-item-explain-error');
  }

  async navigate() {
    await this.page.goto('/app/Categories');
    await this.page.waitForLoadState('networkidle');
  }

  async openCreateModal() {
    await this.createButton.click();
    await expect(this.modal).toBeVisible();
  }

  async createCategory(name: string) {
    await this.openCreateModal();
    await this.nameInput.fill(name);
    await this.submitButton.click();
    await expect(this.modal).not.toBeVisible();
  }

  async expectCategoryVisible(name: string) {
    await expect(this.page.locator('td').getByText(name, { exact: true })).toBeVisible();
  }

  async expectCategoryNotVisible(name: string) {
    await expect(this.page.locator('td').getByText(name, { exact: true })).not.toBeVisible();
  }

  async openEditModal(name: string) {
    const row = this.page.getByRole('row').filter({ hasText: name });
    await row.getByRole('button').first().click();
    await expect(this.modal).toBeVisible();
  }

  async editCategory(currentName: string, newName: string) {
    await this.openEditModal(currentName);
    await this.nameInput.clear();
    await this.nameInput.fill(newName);
    await this.modal.getByRole('button', { name: 'Actualizar' }).click();
    await expect(this.modal).not.toBeVisible();
  }

  async deleteCategory(name: string) {
    const row = this.page.getByRole('row').filter({ hasText: name });
    await row.getByRole('button').last().click();
    await this.page.getByRole('button', { name: 'Sí' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async expectFieldError(text: string) {
    await expect(this.fieldErrors.filter({ hasText: text })).toBeVisible();
  }
}
