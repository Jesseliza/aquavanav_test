import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './client/src',
  testMatch: /.*\.spec\.tsx?/,
});
