import { test, expect } from '../../fixtures/auth.fixture';
import { IncomePage } from '../../pages/income/IncomePage';
import transactionsData from '../../data/transactions.json';

test.describe('Income: Create', () => {
  let incomePage: IncomePage;
  let createdIncomeName: string | null = null;

  test.beforeEach(async ({ authenticatedPage }) => {
    incomePage = new IncomePage(authenticatedPage);
    await incomePage.navigate();
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
    const uniqueName = `${income.name} ${Date.now()}`;
    createdIncomeName = uniqueName;

    await incomePage.createUniqueIncome(uniqueName, income.amount, income.amountType as 'Neto' | 'Bruto');

    await incomePage.expectIncomeVisible(uniqueName);
  });

  test('Income: Create — recurring income', async () => {
    const income = transactionsData.incomes[1];
    const uniqueName = `${income.name} ${Date.now()}`;
    createdIncomeName = uniqueName;

    await incomePage.createRecurringIncome(
      uniqueName,
      income.amount,
      income.frequency!,
      income.amountType as 'Neto' | 'Bruto'
    );

    await incomePage.expectIncomeVisible(uniqueName);
  });
});
