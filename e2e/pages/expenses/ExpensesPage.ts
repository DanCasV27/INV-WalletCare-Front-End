import { Page, Locator, expect } from '@playwright/test';

export class ExpensesPage {
  readonly page: Page;

  readonly createDropdown: Locator;
  readonly modal: Locator;
  readonly nameInput: Locator;
  readonly amountInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createDropdown = page.getByRole('button', { name: 'Crear Plantilla' });
    // NG-Zorro renders modal content via CDK portal into .ant-modal at document root
    this.modal = page.locator('.ant-modal');
    // nz-form-label doesn't generate for/id — use formcontrolname
    this.nameInput = this.modal.locator('input[formcontrolname="name"]');
    this.amountInput = this.modal.locator('nz-input-number input').first();
    this.submitButton = this.modal.getByRole('button', { name: 'Crear' });
  }

  async navigate() {
    await this.page.goto('/app/expense');
    await this.page.waitForLoadState('networkidle');
  }

  async openCreateModal(type: 'unique' | 'recurrence') {
    await this.createDropdown.click();
    const menuItem = type === 'unique'
      ? this.page.getByText('Gasto único')
      : this.page.getByText('Gasto recurrente');
    await menuItem.click();
    await expect(this.modal).toBeVisible();
  }

  async fillBaseFields(name: string, amount: number, amountType: 'Neto' | 'Bruto') {
    await this.nameInput.fill(name);
    await this.amountInput.fill(String(amount));
    // use .ant-radio-wrapper to avoid matching nz-form-label elements that contain the same text
    await this.modal.locator('.ant-radio-wrapper').filter({ hasText: amountType }).click();
  }

  async createUniqueExpense(name: string, amount: number, amountType: 'Neto' | 'Bruto' = 'Neto') {
    await this.openCreateModal('unique');
    await this.fillBaseFields(name, amount, amountType);
    await this.submitButton.click();
    await expect(this.modal).not.toBeVisible();
  }

  async createRecurringExpense(name: string, amount: number, frequency: string, amountType: 'Neto' | 'Bruto' = 'Neto') {
    await this.openCreateModal('recurrence');
    await this.fillBaseFields(name, amount, amountType);
    await this.modal.locator('.ant-radio-wrapper').filter({ hasText: frequency }).click();
    await this.submitButton.click();
    await expect(this.modal).not.toBeVisible();
  }

  async expectExpenseVisible(name: string) {
    await expect(this.page.getByRole('row').filter({ hasText: name })).toBeVisible();
  }

  async deleteExpense(name: string) {
    const row = this.page.getByRole('row').filter({ hasText: name });
    await row.getByRole('button').last().click();
    await this.page.getByRole('button', { name: 'Sí' }).click();
    await this.page.waitForLoadState('networkidle');
  }
}
