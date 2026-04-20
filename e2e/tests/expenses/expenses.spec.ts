import { test, expect } from '../../fixtures/auth.fixture';
import { ExpensesPage } from '../../pages/expenses/ExpensesPage';
import transactionsData from '../../data/transactions.json';

test.describe('Expenses: Create', () => {
  let expensesPage: ExpensesPage;
  let createdExpenseName: string | null = null;

  test.beforeEach(async ({ authenticatedPage }) => {
    expensesPage = new ExpensesPage(authenticatedPage);
    await expensesPage.navigate();
    // Clean up any leftover data from a previous failed run
    for (const expense of transactionsData.expenses) {
      const row = authenticatedPage.getByRole('row').filter({ hasText: expense.name });
      if (await row.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expensesPage.deleteExpense(expense.name);
      }
    }
  });

  test.afterEach(async () => {
    if (createdExpenseName) {
      try {
        await expensesPage.navigate();
        await expensesPage.deleteExpense(createdExpenseName);
      } catch {
        // already deleted in test
      }
      createdExpenseName = null;
    }
  });

  test('Expenses: Create — unique expense', async () => {
    const expense = transactionsData.expenses[0];
    createdExpenseName = expense.name;

    await expensesPage.createUniqueExpense(expense.name, expense.amount, expense.amountType as 'Neto' | 'Bruto');

    await expensesPage.expectExpenseVisible(expense.name);
  });

  test('Expenses: Create — recurring expense', async () => {
    const expense = transactionsData.expenses[1];
    createdExpenseName = expense.name;

    await expensesPage.createRecurringExpense(
      expense.name,
      expense.amount,
      expense.frequency!,
      expense.amountType as 'Neto' | 'Bruto'
    );

    await expensesPage.expectExpenseVisible(expense.name);
  });
});
