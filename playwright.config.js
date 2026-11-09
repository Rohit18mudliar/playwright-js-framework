import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({

  testDir: './tests',
  timeout:20*1000, // in Milliseconds, Test timeout global level
  expect:{timeout:20000}, // Assertion timeout global level
  reporter: process.env.CI
  ? [['blob'], ['github'], ['allure-playwright']]
  : 'html', // Blob & allure report for CI sharding, Html  for local testing
  fullyParallel: true,  /* Run tests in files in parallel */ 
  forbidOnly: !!process.env.CI,  /* Fail the build on CI if you accidentally left test.only in the source code. */
  retries: process.env.CI ? 1 : 0,   /* Retry on CI only */
  workers: process.env.CI ? 1 : undefined,  /* Opt out of parallel tests on CI. */  
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    browserName:'chromium',
    screenshot: 'only-on-failure',     
    trace: 'retain-on-failure',  
    video:'retain-on-failure',    
    baseURL: process.env.BASE_URL || 'https://rahulshettyacademy.com/client/',   
  },

  /* Configure projects for major browsers */
  // projects: [
  //   {
  //     name: 'chromium',
  //     use: { ...devices['Desktop Chrome'] }, //Overrides only listed , Rest are inherited
  //   },

  //   {
  //     name: 'firefox',
  //     use: { ...devices['Desktop Firefox'] },
  //   },

  //   {
  //     name: 'webkit',
  //     use: { ...devices['Desktop Safari'] },
  //   },
  // ],
  
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });
  
});

