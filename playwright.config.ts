import { defineConfig, devices } from '@playwright/test';
import { BASE_URL, TEST_DB_PATH, TEST_PORT, USE_EXTERNAL_APP } from './src/env';

// Exercise 19: uncomment to load variables from the .env file
// import 'dotenv/config';

export default defineConfig({
  // `npm run solutions` sets TEST_DIR=solutions
  testDir: process.env.TEST_DIR ?? './exercises',

  // Exercises 14 and 25: what happens when you change this to true?
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),

  // Exercise 13: retries do NOT fix a flaky test.
  retries: 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    // Exercise 12: uncomment to enable Allure
    // ['allure-playwright', { resultsDir: 'allure-results' }],
  ],

  use: {
    baseURL: BASE_URL,
    // Exercise 11: configure artifacts that help you debug failures
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Exercise 20 (bonus): add more browsers
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],

  // Playwright starts the app on port 3100 with a fresh database.
  // Bug flags (e.g. CHAOS_CLASSES=1) are passed through from the environment.
  webServer: USE_EXTERNAL_APP
    ? undefined
    : {
        command: 'node --no-warnings app/server.mjs',
        url: `${BASE_URL}/api/health`,
        reuseExistingServer: false,
        timeout: 30_000,
        env: {
          ...(process.env as Record<string, string>),
          PORT: String(TEST_PORT),
          DB_PATH: TEST_DB_PATH,
        },
      },
});
