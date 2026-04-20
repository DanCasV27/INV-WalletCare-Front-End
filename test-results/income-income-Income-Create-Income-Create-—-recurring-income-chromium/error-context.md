# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: income/income.spec.ts >> Income: Create >> Income: Create — recurring income
- Location: e2e/tests/income/income.spec.ts:35:7

# Error details

```
Error: expect(locator).not.toBeVisible() failed

Locator:  locator('.ant-modal')
Expected: not visible
Received: visible
Timeout:  5000ms

Call log:
  - Expect "not toBeVisible" with timeout 5000ms
  - waiting for locator('.ant-modal')
    9 × locator resolved to <div cdkdrag="" role="document" ng-reflect-disabled="true" cdkdragboundary=".cdk-overlay-container" ng-reflect-boundary-element=".cdk-overlay-container" class="cdk-drag ant-modal ng-tns-c2116847144-14 cdk-drag-disabled">…</div>
      - unexpected value "visible"

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e6]:
      - generic [ref=e7]:
        - generic [ref=e8]: WalletCare
        - img [ref=e11]
      - generic [ref=e13]:
        - img [ref=e16] [cursor=pointer]
        - img [ref=e22] [cursor=pointer]
        - generic [ref=e26] [cursor=pointer]:
          - img [ref=e28]
          - text: dcastrov
          - img [ref=e31]
    - generic [ref=e33]:
      - list [ref=e36]:
        - listitem [ref=e37] [cursor=pointer]:
          - link "Inicio" [ref=e39]:
            - /url: /
            - img [ref=e41]
            - text: Inicio
        - listitem [ref=e43] [cursor=pointer]:
          - link "Mis cuentas" [ref=e45]:
            - /url: /app/accounts
            - img [ref=e47]
            - text: Mis cuentas
        - listitem [ref=e50] [cursor=pointer]:
          - link "Mis ingresos" [ref=e52]:
            - /url: /app/income
            - img [ref=e54]
            - text: Mis ingresos
        - listitem [ref=e56] [cursor=pointer]:
          - link "Mis ahorros" [ref=e58]:
            - /url: /app/savings
            - img [ref=e60]
            - text: Mis ahorros
        - listitem [ref=e62] [cursor=pointer]:
          - link "Mis gastos" [ref=e64]:
            - /url: /app/expense
            - img [ref=e66]
            - text: Mis gastos
        - listitem [ref=e68] [cursor=pointer]:
          - link "Mis categorias" [ref=e70]:
            - /url: /app/Categories
            - img [ref=e72]
            - text: Mis categorias
        - listitem [ref=e74] [cursor=pointer]:
          - link "Metas" [ref=e76]:
            - /url: /app/goals
            - img [ref=e78]
            - text: Metas
      - generic [ref=e82]:
        - generic [ref=e84]: Mis ingresos
        - generic [ref=e87]:
          - generic [ref=e88]:
            - generic [ref=e90]:
              - text: Mis Ingresos
              - img [ref=e92]
            - button "Crear Plantilla" [ref=e99] [cursor=pointer]:
              - generic [ref=e100]: Crear Plantilla
              - img [ref=e102]
          - generic [ref=e108]:
            - table [ref=e112]:
              - rowgroup [ref=e120]:
                - row "Nombre Descripción Tipo Monto Tipo de Monto Acciones" [ref=e121]:
                  - columnheader [ref=e122]
                  - columnheader "Nombre" [ref=e123] [cursor=pointer]:
                    - generic [ref=e124]:
                      - generic [ref=e125]: Nombre
                      - generic [ref=e127]:
                        - img [ref=e129]
                        - img [ref=e132]
                  - columnheader "Descripción" [ref=e134] [cursor=pointer]:
                    - generic [ref=e135]:
                      - generic [ref=e136]: Descripción
                      - generic [ref=e138]:
                        - img [ref=e140]
                        - img [ref=e143]
                  - columnheader "Tipo" [ref=e145] [cursor=pointer]:
                    - generic [ref=e146]:
                      - generic [ref=e147]: Tipo
                      - generic [ref=e149]:
                        - img [ref=e151]
                        - img [ref=e154]
                  - columnheader "Monto" [ref=e156] [cursor=pointer]:
                    - generic [ref=e157]:
                      - generic [ref=e158]: Monto
                      - generic [ref=e160]:
                        - img [ref=e162]
                        - img [ref=e165]
                  - columnheader "Tipo de Monto" [ref=e167] [cursor=pointer]:
                    - generic [ref=e168]:
                      - generic [ref=e169]: Tipo de Monto
                      - generic [ref=e171]:
                        - img [ref=e173]
                        - img [ref=e176]
                  - columnheader "Acciones" [ref=e178]
              - rowgroup [ref=e179]:
                - row:
                  - cell
                  - cell
                  - cell
                  - cell
                  - cell
                  - cell
                  - cell
                - row "Test Rent Income - Recurrente ₡ 150000 Neto" [ref=e180]:
                  - cell [ref=e181]:
                    - img [ref=e183]
                  - cell "Test Rent Income" [ref=e186]
                  - cell "-" [ref=e187]
                  - cell "Recurrente" [ref=e188]
                  - cell "₡ 150000" [ref=e189]
                  - cell "Neto" [ref=e190]
                  - cell [ref=e191]:
                    - generic [ref=e192]:
                      - button [ref=e193] [cursor=pointer]:
                        - img [ref=e195]
                      - button [ref=e198] [cursor=pointer]:
                        - img [ref=e200]
                - row "Test Salary - Único ₡ 500000 Neto" [ref=e202]:
                  - cell [ref=e203]:
                    - img [ref=e205]
                  - cell "Test Salary" [ref=e208]
                  - cell "-" [ref=e209]
                  - cell "Único" [ref=e210]
                  - cell "₡ 500000" [ref=e211]
                  - cell "Neto" [ref=e212]
                  - cell [ref=e213]:
                    - generic [ref=e214]:
                      - button [ref=e215] [cursor=pointer]:
                        - img [ref=e217]
                      - button [ref=e220] [cursor=pointer]:
                        - img [ref=e222]
            - list [ref=e225]:
              - listitem "Página anterior" [ref=e226]:
                - button "Página anterior" [disabled] [ref=e227]:
                  - img [ref=e229]
              - listitem "1" [ref=e231] [cursor=pointer]:
                - generic [ref=e232]: "1"
              - listitem "Página siguiente" [ref=e233]:
                - button "Página siguiente" [disabled] [ref=e234]:
                  - img [ref=e236]
  - generic:
    - generic [ref=e243]: Herramientas y calculadoras
    - dialog [ref=e246]:
      - document:
        - generic [ref=e247]:
          - button "Close" [ref=e248] [cursor=pointer]:
            - img [ref=e251]
          - generic [ref=e254]:
            - generic [ref=e255]:
              - img [ref=e257]
              - generic [ref=e260]: ¿Estás seguro de que quieres eliminar el ingreso?
              - generic [ref=e262]: Si eliminas el ingreso, se eliminarán todos los datos relacionados con el.
            - generic [ref=e263]:
              - button "No" [ref=e264] [cursor=pointer]:
                - generic [ref=e265]: "No"
              - button "Sí" [active] [ref=e266] [cursor=pointer]:
                - generic [ref=e267]: Sí
  - img
  - img
```

# Test source

```ts
  1  | import { Page, Locator, expect } from '@playwright/test';
  2  | 
  3  | export class IncomePage {
  4  |   readonly page: Page;
  5  | 
  6  |   readonly createDropdown: Locator;
  7  |   readonly modal: Locator;
  8  |   readonly nameInput: Locator;
  9  |   readonly amountInput: Locator;
  10 |   readonly submitButton: Locator;
  11 | 
  12 |   constructor(page: Page) {
  13 |     this.page = page;
  14 |     this.createDropdown = page.getByRole('button', { name: 'Crear Plantilla' });
  15 |     // NG-Zorro renders modal content via CDK portal into .ant-modal at document root
  16 |     this.modal = page.locator('.ant-modal');
  17 |     // nz-form-label doesn't generate for/id — use formcontrolname
  18 |     this.nameInput = this.modal.locator('input[formcontrolname="name"]');
  19 |     this.amountInput = this.modal.locator('nz-input-number input').first();
  20 |     this.submitButton = this.modal.getByRole('button', { name: 'Crear' });
  21 |   }
  22 | 
  23 |   async navigate() {
  24 |     await this.page.goto('/app/income');
  25 |     await this.page.waitForLoadState('networkidle');
  26 |   }
  27 | 
  28 |   async openCreateModal(type: 'unique' | 'recurrence') {
  29 |     await this.createDropdown.click();
  30 |     const menuItem = type === 'unique'
  31 |       ? this.page.getByText('Ingreso único')
  32 |       : this.page.getByText('Ingreso recurrente');
  33 |     await menuItem.click();
  34 |     await expect(this.modal).toBeVisible();
  35 |   }
  36 | 
  37 |   async fillBaseFields(name: string, amount: number, amountType: 'Neto' | 'Bruto') {
  38 |     await this.nameInput.fill(name);
  39 |     await this.amountInput.fill(String(amount));
  40 |     // use .ant-radio-wrapper to avoid matching nz-form-label elements that contain the same text
  41 |     await this.modal.locator('.ant-radio-wrapper').filter({ hasText: amountType }).click();
  42 |   }
  43 | 
  44 |   async createUniqueIncome(name: string, amount: number, amountType: 'Neto' | 'Bruto' = 'Neto') {
  45 |     await this.openCreateModal('unique');
  46 |     await this.fillBaseFields(name, amount, amountType);
  47 |     await this.submitButton.click();
  48 |     await expect(this.modal).not.toBeVisible();
  49 |   }
  50 | 
  51 |   async createRecurringIncome(name: string, amount: number, frequency: string, amountType: 'Neto' | 'Bruto' = 'Neto') {
  52 |     await this.openCreateModal('recurrence');
  53 |     await this.fillBaseFields(name, amount, amountType);
  54 |     await this.modal.locator('.ant-radio-wrapper').filter({ hasText: frequency }).click();
  55 |     await this.submitButton.click();
> 56 |     await expect(this.modal).not.toBeVisible();
     |                                  ^ Error: expect(locator).not.toBeVisible() failed
  57 |   }
  58 | 
  59 |   async expectIncomeVisible(name: string) {
  60 |     await expect(this.page.getByRole('row').filter({ hasText: name })).toBeVisible();
  61 |   }
  62 | 
  63 |   async deleteIncome(name: string) {
  64 |     const row = this.page.getByRole('row').filter({ hasText: name });
  65 |     await row.getByRole('button').last().click();
  66 |     await this.page.getByRole('button', { name: 'Sí' }).click();
  67 |     await this.page.waitForLoadState('networkidle');
  68 |   }
  69 | }
  70 | 
```