import { defineConfig, devices } from '@playwright/test';

/**
 * One project per practice site so baseURL and folders stay isolated.
 * Add a project when a new suite lands; don't point this repo at private apps.
 */
export default defineConfig({
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [
        ['github'],
        ['html', { open: 'never' }],
        ['json', { outputFile: 'test-results/results.json' }],
      ]
    : [
        ['list'],
        ['html', { open: 'never' }],
        ['json', { outputFile: 'test-results/results.json' }],
      ],
  use: {
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  projects: [
    {
      name: 'saucedemo',
      testDir: './tests/saucedemo',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
      },
    },
    {
      name: 'the-internet',
      testDir: './tests/the-internet',
      timeout: 60_000,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://the-internet.herokuapp.com',
        navigationTimeout: 45_000,
      },
    },
    {
      // Request-only project against the public Restful Booker practice API.
      // Heroku dynos can cold-start; keep a longer timeout like the-internet.
      name: 'restful-booker',
      testDir: './tests/restful-booker',
      timeout: 45_000,
      use: {
        baseURL: 'https://restful-booker.herokuapp.com',
        extraHTTPHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    },
    {
      name: 'demoqa',
      testDir: './tests/demoqa',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://demoqa.com',
      },
    },
  ],
});
