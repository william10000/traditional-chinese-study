import { defineConfig, devices } from '@playwright/test';

// Note: In production builds, Vite sets base to '/traditional-chinese-study/'.
// We run E2E against the built app via `vite preview` so paths are correct.

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html']],
  use: {
    baseURL: 'http://localhost:4173/traditional-chinese-study/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  // Start the server before running tests.
  // We build then preview to exercise production base path.
  webServer: [
    {
      command: 'pnpm run build',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'pnpm run preview -- --port 4173',
      url: 'http://localhost:4173/traditional-chinese-study/',
      reuseExistingServer: !process.env.CI,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  ],
});


