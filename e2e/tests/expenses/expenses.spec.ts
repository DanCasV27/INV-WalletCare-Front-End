import { test, expect } from '../../fixtures/auth.fixture';
import { ExpensesPage } from '../../pages/expenses/ExpensesPage';
import transactionsData from '../../data/transactions.json';

test.describe('Expenses: Create', () => {
  let expensesPage: ExpensesPage;
  let createdExpenseName: string | null = null;

  test.beforeEach(async ({ authenticatedPage }) => {
    expensesPage = new ExpensesPage(authenticatedPage);
    await expensesPage.navigate();
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
    const uniqueName = `${expense.name} ${Date.now()}`;
    createdExpenseName = uniqueName;

    await expensesPage.createUniqueExpense(uniqueName, expense.amount, expense.amountType as 'Neto' | 'Bruto');

    await expensesPage.expectExpenseVisible(uniqueName);
  });

  test('Expenses: Create — recurring expense', async () => {
    const expense = transactionsData.expenses[1];
    const uniqueName = `${expense.name} ${Date.now()}`;
    createdExpenseName = uniqueName;

    await expensesPage.createRecurringExpense(
      uniqueName,
      expense.amount,
      expense.frequency!,
      expense.amountType as 'Neto' | 'Bruto'
    );

    await expensesPage.expectExpenseVisible(uniqueName);
  });
});
