import { test, expect } from '../../fixtures/auth.fixture';
import { CategoriesPage } from '../../pages/categories/CategoriesPage';
import categoriesData from '../../data/categories.json';

test.describe('Categories: CRUD', () => {
  let categoriesPage: CategoriesPage;
  let createdCategoryName: string | null = null;

  test.beforeEach(async ({ authenticatedPage }) => {
    categoriesPage = new CategoriesPage(authenticatedPage);
    await categoriesPage.navigate();
  });

  test.afterEach(async () => {
    if (createdCategoryName) {
      try {
        await categoriesPage.navigate();
        await categoriesPage.deleteCategory(createdCategoryName);
      } catch {
        // already deleted in test
      }
      createdCategoryName = null;
    }
  });

  test('Categories: Create — valid category', async () => {
    const category = categoriesData.validCategories[0];
    createdCategoryName = category.name;

    await categoriesPage.createCategory(category.name);

    await categoriesPage.expectCategoryVisible(category.name);
  });

  test('Categories: Create — validation error with short name', async () => {
    const invalid = categoriesData.invalidCategories[0];

    await categoriesPage.openCreateModal();
    await categoriesPage.nameInput.fill(invalid.name);
    await categoriesPage.submitButton.click();

    await categoriesPage.expectFieldError(invalid.expectedError);
    await categoriesPage.cancelButton.click();
  });

  test('Categories: Edit — updates category name', async () => {
    const original = categoriesData.validCategories[1];
    const updated = 'Updated Transport Test';
    createdCategoryName = updated;

    await categoriesPage.createCategory(original.name);
    await categoriesPage.expectCategoryVisible(original.name);

    await categoriesPage.editCategory(original.name, updated);

    await categoriesPage.expectCategoryVisible(updated);
    await categoriesPage.expectCategoryNotVisible(original.name);
  });
});
