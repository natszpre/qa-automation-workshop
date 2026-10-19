import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'blob-report/**',
      'allure-*/**',
      'app/**',
      'perf/**',
      'scripts/**',
    ],
  },
  ...tseslint.configs.recommended,
  {
    ...playwright.configs['flat/recommended'],
    files: ['exercises/**/*.ts', 'solutions/**/*.ts', 'src/**/*.ts'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Exercise 17: change 'warn' to 'error' and see what happens.
      'playwright/missing-playwright-await': 'warn',
      'playwright/valid-expect': 'warn',
      'playwright/no-conditional-expect': 'warn',
      'playwright/expect-expect': 'warn',
      'playwright/prefer-web-first-assertions': 'warn',
      'playwright/no-wait-for-timeout': 'warn',
      // Exercises 10 and 28 contain bad test titles on purpose ('Test 1', 'test order').
      'playwright/valid-title': 'warn',
      'playwright/no-conditional-in-test': 'off',
      'playwright/no-skipped-test': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],
    },
  },
);