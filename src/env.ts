import path from 'node:path';

/** Port on which Playwright starts the app for the tests (different from `npm run app`). */
export const TEST_PORT = Number(process.env.TEST_PORT ?? 3100);

/** When BASE_URL is set (e.g. in Docker), tests use an app that is already running. */
export const USE_EXTERNAL_APP = Boolean(process.env.BASE_URL);

export const BASE_URL = process.env.BASE_URL ?? `http://localhost:${TEST_PORT}`;

/** SQLite database file of the app started by Playwright (exercise 06). */
export const TEST_DB_PATH = path.resolve(__dirname, '../app/data/test.db');
