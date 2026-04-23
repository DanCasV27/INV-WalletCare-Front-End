import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  tsconfig: './e2e/tsconfig.json',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['allure-playwright', { outputFolder: 'allure-results', suiteTitle: false }],
  ],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // Fase 1: login una sola vez y guarda el JWT en e2e/.auth/user.json
    {
      name: 'setup',
      testDir: './e2e/setup',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    // Fase 2a: tests de auth (login/signup) — contexto limpio, sin sesión previa
    {
      name: 'auth-tests',
      testDir: './e2e/tests/auth',
      use: { ...devices['Desktop Chrome'] },
    },

    // Fase 2b: todos los demás tests — contexto con JWT ya cargado
    {
      name: 'chromium',
      testDir: './e2e/tests',
      testIgnore: /auth\/.*/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
  },
});
