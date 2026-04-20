# WalletCare Frontend — Architecture

## Overview

WalletCare is an Angular 17 SPA consuming a REST API at `http://localhost:8080`. The app has two main layouts: `DefaultLayout` (public) and `AppLayout` (authenticated with sidebar).

---

## Layer Structure
┌──────────────────────────────────────────────┐
│               Pages (Routes)                 │
│  dashboard, accounts, income, expenses,      │
│  savings, goals, categories, users, profile  │
├──────────────────────────────────────────────┤
│             Components (UI)                  │
│   Lists, Forms, Charts, Layout               │
├──────────────────────────────────────────────┤
│            Services (Logic)                  │
│   Signals + HTTP, all extend BaseService     │
├──────────────────────────────────────────────┤
│          HTTP Interceptors                   │
│   base-url → access-token → handle-errors    │
├──────────────────────────────────────────────┤
│          Angular HttpClient                  │
└──────────────────────────────────────────────┘

---

## Interfaces Module (`src/app/interfaces/index.ts`)

All interfaces and enums are centralized here. Key ones:

| Interface/Enum | Usage |
|---|---|
| `IUser` | Authenticated user, users CRUD |
| `IAccount` | Financial account (personal/shared) |
| `ITransaction` | Account transaction |
| `IIncome` | Income (unique or recurring) |
| `IExpense` | Expense (unique or recurring) |
| `ISaving` | Saving with target date |
| `IGoal` | AI-proposed financial goal |
| `ICategory` | Expense category |
| `Itax` | Applicable tax |
| `INotification` | System notification |
| `IAccountUser` | User↔shared account relationship |
| `IRole` | `ROLE_ADMIN` / `ROLE_USER` |
| `ITypeForm` | `CREATE` / `UPDATE` (controls modal forms) |
| `IIncomeExpenceSavingType` | `UNIQUE` / `RECURRENCE` |
| `IFrequencyType` | `DAILY/WEEKLY/BIWEEKLY/MONTHLY/ANNUAL/OTHER` |
| `IAmountType` | `NET` / `GROSS` |
| `IBalance` | Feedback colors: surplus/deficit/balance |

---

## Signals Service Pattern

All services follow this pattern:

```typescript
@Injectable({ providedIn: 'root' })
export class AccountService extends BaseService<IAccount> {
  protected override source = 'accounts'; // base endpoint

  // Reactive state with Signals
  private accountListSignal = signal<IAccount[]>([]);
  get accounts$() { return this.accountListSignal; }

  // Signal methods: update signal + make HTTP call
  saveAccountSignal(account: IAccount): Observable<IAccount> {
    return this.add(account).pipe(
      tap((response) => {
        this.accountListSignal.update(list => [response, ...list]);
      })
    );
  }

  // Void methods: subscribe internally
  findAllSignal() {
    return this.findAll().subscribe({
      next: (response) => this.accountListSignal.set(response),
    });
  }
}
```

**Rule:** Components only call service methods. Never call `this.http` directly in a component.

---

## Modal Form Pattern (FormModalComponent)

All modal forms extend `FormModalComponent<T>`:

```typescript
export class AccountFormComponent extends FormModalComponent<IAccount> {
  override formGroup = this.fb.group({ ... });

  override handleSubmit() {
    // extra validation...
    super.handleSubmit(); // emits onCreated or onUpdated
  }
}
```

Standard `@Output()` events: `onCreated`, `onUpdated`, `onCanceled`.

---

## HTTP Interceptors (execution order)

1. **`base-url.interceptor`** — prepends `environment.apiUrl` to all URLs, adds `Accept: application/json`
2. **`access-token.interceptor`** — injects `Authorization: Bearer {token}` except on `/auth` routes
3. **`handle-errors.interceptor`** — (disabled in `app.config.ts`) would handle 401/403/404/422

---

## Guards

- **`AuthGuard`** — redirects to `/login` if no `access_token` in localStorage
- **`GuestGuard`** — redirects to `/app` if already authenticated
- **`AdminRoleGuard`** — redirects to `/access-denied` if user lacks `ROLE_ADMIN`

---

## Layouts

### `AppLayout` (authenticated)
- Header: sidebar toggle, calculator drawer, currency exchange, notifications, user menu
- Dynamic sidebar: filters routes by user `authorities` via `AuthService.getPermittedRoutes()`
- Reactive breadcrumb based on active route

### `DefaultLayout` (public)
- Header with logo and "Iniciar Sesión" button only
- Used by: landing, login, signup, invitation, 404

---

## Charts (ApexCharts)

All receive `@Input()` data and react to changes via `ngOnChanges`:

| Component | Type | Data |
|---|---|---|
| `BarchartComponent` | Bar | `IBarchartData[]` + X axis order |
| `PiechartComponent` | Pie/Donut | `IPiechartData[]` + label order |
| `IncomesVsExpensesChartComponent` | Line (annual) | Number arrays |
| `IncomesVsExpensesMonthlyChartComponent` | Line (monthly) | Arrays + days of month |
| `CurrenciesChartComponent` | Line | Days + exchange rates |
| `EstimatedExpenseVsTotalExpenseChartComponent` | Pie | Total vs estimated expenses |
| `NewUsersChartComponent` | Horizontal Bar | New users per month |

---

## Feedback Color System (IBalance)

```typescript
export enum IBalance {
  surplus = '#3E7422',  // green — positive balance
  deficit = '#D23537',  // red — negative balance
  balance = '#B17A0C'   // yellow — neutral balance
}
```

---

## NG-Zorro Theme Colors

Configured in `app.config.ts` via `NZ_CONFIG`:

- **Primary:** `#063578`
- **Success:** `#3E7422`
- **Warning:** `#B17A0C`
- **Error:** `#D23537`
- **Info/Link:** `#063578`

---

## Known Technical Decisions

1. **Signals over NgRx** — simpler for a small team
2. **Standalone components** — no custom NgModules
3. **`skipTests: true`** — Karma unit tests disabled in schematics by default
4. **`Categories` capitalized route** — known inconsistency (`/app/Categories`), do not rename without aligning with backend
5. **`handleErrorsInterceptor` commented out** — errors handled inline per component
6. **Duplicate `provideAnimationsAsync`** — exists in `app.config.ts`, not a functional bug

---

## Main API Endpoints (inferred from codebase)

| Endpoint | Description |
|---|---|
| `POST auth/login` | Login, returns JWT |
| `POST auth/signup` | New user registration |
| `GET/POST/PUT/DELETE accounts` | Accounts CRUD |
| `GET accounts/members/{id}` | Shared account members |
| `GET/POST/PUT/DELETE incomes` | Income CRUD |
| `GET/POST/PUT/DELETE expenses` | Expense CRUD |
| `GET/POST/PUT/DELETE savings` | Savings CRUD |
| `GET/POST/PUT/DELETE categories` | Categories CRUD |
| `GET/POST/PUT/DELETE goals` | Goals CRUD |
| `POST goals/propose` | AI goal proposal |
| `GET transactions/{accountId}` | Account transactions |
| `POST transactions/rollback/{id}` | Rollback transaction |
| `GET notifications` | User notifications |
| `POST tools/loan-calculator` | Credit calculator |
| `POST tools/exchange` | Currency exchange |
| `GET status` | Backend health check |