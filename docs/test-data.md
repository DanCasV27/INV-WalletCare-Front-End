# Test Data — WalletCare E2E

---

## JSON File Structure in `e2e/data/`

### `users.json`
```json
{
  "validUsers": [
    {
      "email": "testuser@walletcare.com",
      "password": "TestPass123!",
      "name": "Test",
      "lastname": "User",
      "nickname": "testuser",
      "role": "user"
    }
  ],
  "adminUsers": [
    {
      "email": "admin@walletcare.com",
      "password": "Admin123!",
      "role": "admin"
    }
  ],
  "invalidCredentials": [
    {
      "email": "noexiste@test.com",
      "password": "wrongpass",
      "expectedError": "Usuario o contraseña incorrectos"
    },
    {
      "email": "invalid-email",
      "password": "TestPass123!",
      "expectedError": "El correo electrónico no es válido"
    }
  ]
}
```

### `accounts.json`
```json
{
  "validAccounts": [
    {
      "name": "Test Personal Account",
      "description": "Personal account for automated testing",
      "type": "Personal"
    },
    {
      "name": "Test Shared Account",
      "description": "Shared account for automated testing",
      "type": "Compartida"
    }
  ],
  "invalidAccounts": [
    {
      "name": "AB",
      "description": "",
      "type": "Personal",
      "expectedError": "El nombre de la cuenta debe tener al menos 4 caracteres"
    }
  ]
}
```

### `transactions.json`
```json
{
  "incomes": [
    {
      "name": "Test Salary",
      "amount": 500000,
      "amountType": "Neto",
      "type": "unique",
      "description": "One-time test income"
    },
    {
      "name": "Test Rent Income",
      "amount": 150000,
      "amountType": "Neto",
      "type": "recurrence",
      "frequency": "Mensual",
      "description": "Recurring test income"
    }
  ],
  "expenses": [
    {
      "name": "Test Supermarket",
      "amount": 45000,
      "amountType": "Neto",
      "type": "unique",
      "description": "One-time test expense"
    },
    {
      "name": "Test Netflix",
      "amount": 8000,
      "amountType": "Neto",
      "type": "recurrence",
      "frequency": "Mensual",
      "description": "Recurring test expense"
    }
  ],
  "savings": [
    {
      "name": "Test Emergency Fund",
      "amount": 100000,
      "description": "Test saving"
    }
  ]
}
```

### `categories.json`
```json
{
  "validCategories": [
    { "name": "Food Test" },
    { "name": "Transport Test" },
    { "name": "Entertainment Test" }
  ],
  "invalidCategories": [
    {
      "name": "AB",
      "expectedError": "La categoría debe tener al menos 4 caracteres"
    }
  ]
}
```

---

## Data Strategy

### Isolation Principle
Each test must create its own data when needed and clean it up afterward. Never depend on data created by other tests.

```typescript
test.describe('Expenses CRUD', () => {
  let createdExpenseName: string;

  test.afterEach(async ({ authenticatedPage }) => {
    if (createdExpenseName) {
      // navigate to page and delete
    }
  });
});
```

### Authenticated tests
Always use the `authenticatedPage` fixture from `auth.fixture.ts` — never repeat the login flow in each test.

### Read vs. write tests
- **Read (GET):** Can share state, faster
- **Write (POST/PUT/DELETE):** Isolated, with cleanup

---

## Domain Data Reference

### Account types
- `Personal` — individual account
- `Compartida` — multi-member shared account

### Income/expense types
- `UNIQUE` — one-time transaction
- `RECURRENCE` — repeats by frequency

### Available frequencies
- Diario, Semanal, Quincenal, Mensual, Anual, Personalizado (specific day 1–31)

### Amount types
- `Neto` — amount without taxes
- `Bruto` — amount with taxes included

### Invitation statuses (IAccountUser.invitationStatus)
- `1` = Pending
- `2` = Accepted
- `3` = Rejected

### Goal statuses (GoalStatusEnum)
- `GOAL_PENDING` = Pending approval
- `GOAL_REJECTED` = Rejected
- `ACTIVE` = Active
- `COMPLETED` = Completed
- `FAILED` = Failed

---

## Expected Error Messages (for assertions)

**Login:**
- `"Usuario o contraseña incorrectos"`
- `"Lo sentimos, su cuenta ha sido deshabilitada por el administrador"`

**Account form:**
- `"Por favor ingrese el nombre de la cuenta"`
- `"El nombre de la cuenta debe tener al menos 4 caracteres"`
- `"El nombre de la cuenta no puede tener más de 100 caracteres"`

**Income/expense form:**
- `"Por favor ingrese el nombre del ingreso"`
- `"Por favor ingrese el monto"`
- `"El monto debe ser mayor a 0"`

**Success notifications:**
- `"Cuenta creada exitosamente"`
- `"Ingreso creado exitosamente"`
- `"Gasto creado exitosamente"`
- `"Ahorro agregado exitosamente"`
- `"La cuenta se ha eliminado correctamente"`