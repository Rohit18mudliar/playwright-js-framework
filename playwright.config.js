import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({

  testDir: './tests',
  timeout:20*1000, // in Milliseconds
  expect:{timeout:20000}, 
  reporter: 'html', /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  fullyParallel: true,  /* Run tests in files in parallel */ 
  forbidOnly: !!process.env.CI,  /* Fail the build on CI if you accidentally left test.only in the source code. */
  retries: process.env.CI ? 1 : 0,   /* Retry on CI only */
  workers: process.env.CI ? 1 : undefined,  /* Opt out of parallel tests on CI. */
  
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

  use: {

    browserName:'chromium',
    screenshot: 'on',     
    trace: 'on',  /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    video:'retain-on-failure',
    // headless:false,   
    baseURL: process.env.BASE_URL ?? 'https://rahulshettyacademy.com/client/' , /* Base URL to use in actions like `await page.goto('')`. */
  
  },

  /* Configure projects for major browsers */
  // projects: [
  //   {
  //     name: 'chromium',
  //     use: { ...devices['Desktop Chrome'] },
  //   },

  //   {
  //     name: 'firefox',
  //     use: { ...devices['Desktop Firefox'] },
  //   },

  //   {
  //     name: 'webkit',
  //     use: { ...devices['Desktop Safari'] },
  //   },

  //   /* Test against mobile viewports. */
  //   // {
  //   //   name: 'Mobile Chrome',
  //   //   use: { ...devices['Pixel 5'] },
  //   // },
  //   // {
  //   //   name: 'Mobile Safari',
  //   //   use: { ...devices['iPhone 12'] },
  //   // },

  //   /* Test against branded browsers. */
  //   // {
  //   //   name: 'Microsoft Edge',
  //   //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
  //   // },
  //   // {
  //   //   name: 'Google Chrome',
  //   //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
  //   // },
  // ],

});

