# Playwright E2E — WalletCare Conventions

## Architecture: Page Object Model (POM)

### Directory Structure
e2e/
pages/
auth/
LoginPage.ts
SignupPage.ts
accounts/
AccountsPage.ts
AccountDetailPage.ts
income/
IncomePage.ts
expenses/
ExpensesPage.ts
savings/
SavingsPage.ts
goals/
GoalsPage.ts
categories/
CategoriesPage.ts
common/
AppLayout.ts       # Header, sidebar, navigation
Modal.ts           # NG-Zorro modal interactions
tests/
auth/
login.spec.ts
signup.spec.ts
accounts/
accounts.spec.ts
account-detail.spec.ts
income/
income.spec.ts
...
fixtures/
auth.fixture.ts      # Pre-authenticated login fixture
base.fixture.ts      # Base fixture with helpers
data/
users.json
accounts.json
transactions.json
utils/
helpers.ts
---

## Base Page Object Structure

```typescript
// e2e/pages/accounts/AccountsPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class AccountsPage {
  readonly page: Page;

  readonly createButton: Locator;
  readonly accountTable: Locator;
  readonly pageHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createButton = page.getByRole('button', { name: 'Crear Cuenta' });
    this.accountTable = page.locator('nz-table');
    this.pageHeader = page.locator('nz-page-header-title');
  }

  async navigate() {
    await this.page.goto('/app/accounts');
    await this.page.waitForLoadState('networkidle');
  }

  async createAccount(name: string, description: string, type: 'Personal' | 'Compartida') {
    await this.createButton.click();
    await this.page.getByLabel('Nombre de la cuenta').fill(name);
    await this.page.getByLabel('Descripción').fill(description);
    await this.page.getByLabel(type).click();
    await this.page.getByRole('button', { name: 'Crear' }).click();
  }

  async getAccountRowByName(name: string) {
    return this.page.getByRole('row').filter({ hasText: name });
  }

  async expectAccountVisible(name: string) {
    await expect(this.page.getByRole('row').filter({ hasText: name })).toBeVisible();
  }
}
```

---

## Auth Fixture (pre-login)

```typescript
// e2e/fixtures/auth.fixture.ts
import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/auth/LoginPage';

type AuthFixtures = {
  authenticatedPage: Page;
  adminPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(
      process.env.TEST_USER_EMAIL ?? 'testuser@walletcare.com',
      process.env.TEST_USER_PASSWORD ?? 'TestPass123!'
    );
    await page.waitForURL('**/app');
    await use(page);
  },

  adminPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(
      process.env.TEST_ADMIN_EMAIL ?? 'admin@walletcare.com',
      process.env.TEST_ADMIN_PASSWORD ?? 'AdminPass123!'
    );
    await page.waitForURL('**/app');
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

---

## Spec Structure (Data-Driven)

```typescript
// e2e/tests/accounts/accounts.spec.ts
import { test, expect } from '../../fixtures/auth.fixture';
import { AccountsPage } from '../../pages/accounts/AccountsPage';
import accountsData from '../../data/accounts.json';

test.describe('Accounts — CRUD', () => {
  let accountsPage: AccountsPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    accountsPage = new AccountsPage(authenticatedPage);
    await accountsPage.navigate();
  });

  // Data-driven: iterating over external data
  for (const account of accountsData.validAccounts) {
    test(`Create account: ${account.name}`, async () => {
      await accountsPage.createAccount(account.name, account.description, account.type);
      await accountsPage.expectAccountVisible(account.name);
    });
  }

  test('Show error when creating account with duplicate name', async () => {
    // ...
  });
});
```

---

## Selector Priority (highest to lowest)

1. `getByRole()` — ARIA roles (button, textbox, heading, row, etc.)
2. `getByLabel()` — NG-Zorro form labels
3. `getByText()` — visible text
4. `getByTestId()` — `data-testid` attribute (add to HTML when needed)
5. `locator('.ant-*')` — NG-Zorro classes (last resort, brittle)

**Rule:** Never use dynamically generated IDs or positional selectors (`:nth-child`).

### Adding data-testid when needed
```html
<button nz-button nzType="primary" data-testid="create-account-btn">
  Crear Cuenta
</button>
```

---

## NG-Zorro Interaction Patterns

### Modals (nz-modal)
```typescript
await expect(page.locator('nz-modal')).toBeVisible();

// Confirm nzModalService.confirm dialog
await page.getByRole('button', { name: 'Sí' }).click();

// Cancel modal
await page.getByRole('button', { name: 'No' }).click();
```

### Dropdowns (nz-select)
```typescript
await page.locator('nz-select[formcontrolname="type"]').click();
await page.getByText('Personal').click();
```

### Notifications (nz-notification)
```typescript
await expect(page.locator('.ant-notification-notice')).toBeVisible();
await expect(page.locator('.ant-notification-notice')).toContainText('exitosamente');
```

### Tables (nz-table)
```typescript
const row = page.getByRole('row').filter({ hasText: 'Cuenta Principal' });
await expect(row).toBeVisible();

// Click action button inside a row
await row.getByRole('button').filter({ has: page.locator('[nztype="edit"]') }).click();
```

### Input Number (nz-input-number)
```typescript
// NG-Zorro input-number has a nested input element
await page.locator('nz-input-number input').fill('5000');
```

---

## playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: false,       // WalletCare has backend state — no parallel
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## E2E Workflow Rules

1. **Always run a single isolated test first:** `npx playwright test tests/login.spec.ts`
2. **Clean state between tests** that create data — use `test.afterEach` for API cleanup when possible
3. **No hardcoded credentials** in specs — use environment variables or `e2e/data/users.json`
4. **Test naming:** `[Feature]: [Action] — [Scenario]` → `"Accounts: Create — valid personal account"`
5. **Group with `test.describe`** by feature, not by page
6. **Explicit assertions:** always use `await expect(...)` — never assume an action completed without verifying

---

## Environment Variables

```bash
# e2e/.env (add to .gitignore)
TEST_USER_EMAIL=testuser@walletcare.com
TEST_USER_PASSWORD=TestPass123!
TEST_ADMIN_EMAIL=admin@walletcare.com
TEST_ADMIN_PASSWORD=Admin123!
BASE_URL=http://localhost:4200
API_URL=http://localhost:8080
```