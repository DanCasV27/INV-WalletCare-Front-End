import { test, expect } from '../../fixtures/auth.fixture';
import { AccountsPage } from '../../pages/accounts/AccountsPage';
import accountsData from '../../data/accounts.json';

test.describe('Accounts: CRUD', () => {
  let accountsPage: AccountsPage;
  let createdAccountName: string | null = null;

  test.beforeEach(async ({ authenticatedPage }) => {
    accountsPage = new AccountsPage(authenticatedPage);
    await accountsPage.navigate();
  });

  test.afterEach(async () => {
    if (createdAccountName) {
      try {
        await accountsPage.navigate();
        await accountsPage.deleteAccount(createdAccountName);
      } catch {
        // already deleted in test
      }
      createdAccountName = null;
    }
  });

  test('Accounts: Create — valid personal account', async () => {
    const account = accountsData.validAccounts[0];
    createdAccountName = account.name;

    await accountsPage.createAccount(account.name, account.description, account.type as 'Personal' | 'Compartida');

    await accountsPage.expectAccountVisible(account.name);
  });

  test('Accounts: Create — validation error with short name', async () => {
    const invalid = accountsData.invalidAccounts[0];

    await accountsPage.openCreateModal();
    await accountsPage.fillForm(invalid.name, invalid.description, invalid.type as 'Personal' | 'Compartida');
    await accountsPage.submitButton.click();

    await accountsPage.expectFieldError(invalid.expectedError);
    await accountsPage.cancelButton.click();
  });

  test('Accounts: Delete — removes account from list', async () => {
    const account = accountsData.validAccounts[0];

    await accountsPage.createAccount(account.name, account.description, account.type as 'Personal' | 'Compartida');
    await accountsPage.expectAccountVisible(account.name);

    await accountsPage.deleteAccount(account.name);
    await accountsPage.expectAccountNotVisible(account.name);

    createdAccountName = null;
  });
});
