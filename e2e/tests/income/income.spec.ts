import { test, expect } from '../../fixtures/auth.fixture';
import { IncomePage } from '../../pages/income/IncomePage';
import transactionsData from '../../data/transactions.json';

test.describe('Income: Create', () => {
  let incomePage: IncomePage;
  let createdIncomeName: string | null = null;

  test.beforeEach(async ({ authenticatedPage }) => {
    incomePage = new IncomePage(authenticatedPage);
    await incomePage.navigate();
    // Clean up any leftover data from a previous failed run
    for (const income of transactionsData.incomes) {
      const row = authenticatedPage.getByRole('row').filter({ hasText: income.name });
      if (await row.isVisible({ timeout: 2000 }).catch(() => false)) {
        await incomePage.deleteIncome(income.name);
      }
    }
  });

  test.afterEach(async () => {
    if (createdIncomeName) {
      try {
        await incomePage.navigate();
        await incomePage.deleteIncome(createdIncomeName);
      } catch {
        // already deleted in test
      }
      createdIncomeName = null;
    }
  });

  test('Income: Create — unique income', async () => {
    const income = transactionsData.incomes[0];
    createdIncomeName = income.name;

    await incomePage.createUniqueIncome(income.name, income.amount, income.amountType as 'Neto' | 'Bruto');

    await incomePage.expectIncomeVisible(income.name);
  });

  test('Income: Create — recurring income', async () => {
    const income = transactionsData.incomes[1];
    createdIncomeName = income.name;

    await incomePage.createRecurringIncome(
      income.name,
      income.amount,
      income.frequency!,
      income.amountType as 'Neto' | 'Bruto'
    );

    await incomePage.expectIncomeVisible(income.name);
  });
});
