# WalletCare — Frontend

## Project Description
Personal and shared financial management web app. Users can manage accounts, income, expenses, savings, and financial goals. Includes a dashboard with charts, financial calculators, and a notification system.

## Tech Stack
- **Framework:** Angular 17 (standalone components, signals)
- **UI Library:** NG-Zorro Antd 17 (Ant Design for Angular)
- **Charts:** ApexCharts + ng-apexcharts
- **Styles:** SCSS — custom theme with NG-Zorro CSS variables
- **HTTP:** Angular HttpClient with functional interceptors
- **State:** Angular Signals (no NgRx)
- **Language:** TypeScript 5.4 (strict mode enabled)
- **E2E Testing:** Playwright (MCP connected)

## Essential Commands
```bash
npm start                                    # ng serve — dev server at http://localhost:4200
npm run build                                # ng build — output at dist/inv-walletcare
npm test                                     # ng test — Karma unit tests
npx playwright test                          # run all E2E tests
npx playwright test --headed                 # with visible browser
npx playwright test --ui                     # interactive UI mode
npx playwright test tests/login.spec.ts      # specific test file
npx playwright codegen http://localhost:4200 # record interactions
```

## Project Structure
src/
app/
components/       # Reusable components (feature-based)
pages/            # Main pages/routes
services/         # Angular services (signals pattern)
guards/           # Auth + Guest guards
interceptors/     # base-url, access-token, handle-errors
interfaces/       # All types and interfaces (index.ts)
environments/       # environment.ts / environment.development.ts
e2e/                  # Playwright tests (to be created)
pages/              # Page Objects
tests/              # Specs organized by feature
fixtures/           # Auth fixtures and helpers
data/               # Test data (data-driven)

## Service Architecture
All services extend `BaseService<T>` which provides CRUD (find, findAll, add, edit, del, filter). Services use **Angular Signals** for reactive state — never use Subject/BehaviorSubject for list state.

Standard service pattern:
```typescript
private itemListSignal = signal<IItem[]>([]);
get items$() { return this.itemListSignal; }
saveItemSignal(item): Observable<IItem> { ... }
```

## Code Conventions
- **Components:** standalone: true, ChangeDetectionStrategy.OnPush when applicable
- **Imports:** ES modules (import/export), destructuring when possible
- **File naming:** kebab-case (`account-form.component.ts`)
- **Classes:** PascalCase | **Functions/vars:** camelCase | **Interfaces:** I prefix (`IAccount`)
- **Styles:** per-component SCSS with `:host { display: block }` as base
- **Forms:** ReactiveFormsModule (FormBuilder + Validators)
- **Dates:** DatePipe injected as provider in the component

## Main Routes
/                       → LandingPage (GuestGuard)
/login                  → LoginComponent (GuestGuard)
/signup                 → SignupComponent (GuestGuard)
/app                    → Dashboard (AuthGuard)
/app/accounts           → Accounts list
/app/accounts/details/:id → Account detail
/app/income             → My income
/app/expense            → My expenses
/app/savings            → My savings
/app/goals              → Goals
/app/Categories         → Expense categories
/app/users              → Users (admin only)
/app/profile            → User profile

## User Roles
- `ROLE_USER` — standard access to accounts and personal finances
- `ROLE_ADMIN` — access to user management and admin dashboard (new users chart)

## API Base URL
- **Development:** `http://localhost:8080` (configured in environment.development.ts)
- The `base-url.interceptor.ts` prepends the URL automatically to all requests

## Authentication
JWT stored in localStorage (`access_token`). The `access-token.interceptor.ts` injects the Bearer token in every request. `AuthGuard` redirects to `/login` if no token. `GuestGuard` redirects to `/app` if already authenticated.

## Important Rules for Claude
- Always run `npm run build` to verify no TypeScript compilation errors before finishing
- For E2E tests, always run a single isolated test before the full suite
- NG-Zorro selectors generate `.ant-*` classes in the DOM — use `data-testid` whenever possible for tests
- Do not add `console.log` in production code (several existing ones should be cleaned up eventually)
- `skipTests: true` is configured in schematics — Karma unit tests are optional

## Additional References
- @docs/architecture.md — architecture and technical decisions
- @docs/playwright-conventions.md — E2E conventions and POM
- @docs/test-data.md — test data for testing