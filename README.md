# Playwright JS Framework

End-to-end and API-assisted UI test automation for an e-commerce web app, built with **Playwright** and **JavaScript (ES modules)**. It uses the Page Object Model, custom fixtures, data-driven tests, tag-based suites, sharded CI runs and combined reporting.

The tests run against the public practice app at <https://rahulshettyacademy.com/client/>.

## Highlights

- **Page Object Model** with a `POManager` that creates and hands out every page object.
- **Custom fixture** (`authenticatedPage`) that logs in once per test and tears down cleanly.
- **Data-driven tests**: invalid-login cases are read from a JSON file and generate one test each.
- **API-assisted setup**: `ApiUtils` logs in and adds items to the cart over the API, and the token is injected into the browser, so UI tests skip slow UI steps.
- **Tag-based suites**: `@Smoke` and `@API` tags, run through npm scripts.
- **CI/CD**: GitHub Actions (4-way sharding in Microsoft's Playwright Docker image, merged Playwright HTML report and combined Allure report published as run artifacts, failure email) and a Jenkins pipeline.
- **Reporting**: Playwright HTML report, Allure report, traces, screenshots and video on failure.

## Tech stack

| Area | Tool |
|---|---|
| Test runner | `@playwright/test` |
| Language | JavaScript (ESM, `"type": "module"`) |
| Reporting | Playwright HTML, `allure-playwright`, `allure-commandline` |
| CI | GitHub Actions, Jenkins |
| Other | `exceljs` |

## Project structure

```
.
├── .github/workflows/playwright.yml   # GitHub Actions: sharded run + merged report
├── Jenkinsfile                        # Jenkins pipeline (Windows agent)
├── playwright.config.js               # Runner, reporter and browser settings
├── package.json                       # Scripts and dependencies
├── Helpers/
│   ├── fixtures.js                    # Custom `authenticatedPage` fixture
│   ├── ApiUtils.js                    # API login, create order, add to cart
│   └── Utils.js                       # Random phone number and date helpers
├── pageObjects/
│   ├── POManager.js                   # Creates and returns all page objects
│   ├── LoginPage.js
│   ├── DashboardPage.js
│   ├── CartPage.js
│   ├── CheckoutPage.js
│   ├── ThankYouPage.js
│   ├── OrderHistoryPage.js
│   └── OrderDetailsPage.js
├── testData/
│   └── LoginCases.json                # Data for invalid-login tests
└── tests/
    ├── auth/loginTest.spec.js
    ├── catalog/searchCatalogTest.spec.js
    ├── cart/addToCartTest.spec.js
    ├── cart/cartTest.spec.js
    └── e2e/purchaseJourney.spec.js
```

Folders are organised by feature (`auth`, `catalog`, `cart`) with one `e2e` folder for full user journeys.

## Test coverage

| Area | File | What it checks | Tags |
|---|---|---|---|
| Auth | `tests/auth/loginTest.spec.js` | Valid login; four invalid-login cases (wrong email, wrong password, empty email, empty password) driven from `LoginCases.json` | `@Smoke` on valid login |
| Catalog | `tests/catalog/searchCatalogTest.spec.js` | Search and view a product; search with category filters | `@Smoke` |
| Cart | `tests/cart/addToCartTest.spec.js` | Add an item (API login, token injected) and verify it in the cart | `@Smoke` |
| Cart | `tests/cart/cartTest.spec.js` | Continue Shopping, Buy Now and Delete on a cart item, with the item added through the API | `@API` |
| E2E | `tests/e2e/purchaseJourney.spec.js` | Login, add to cart, checkout with coupon and country, order confirmation, order history and details | `@Smoke` |

## Getting started

### Prerequisites

- A current LTS version of **Node.js** (CI uses Node 24)
- **Java** to build or open Allure reports (Allure 2 needs it)

### Install

```bash
npm ci
npx playwright install --with-deps
```

## Running tests

```bash
npm run smoke        # tests tagged @Smoke
npm run apiTests     # tests tagged @API
npm run regression   # everything
```

These scripts use the `line`, `html` and `allure-playwright` reporters.

Useful direct commands:

```bash
npx playwright test tests/auth/loginTest.spec.js      # one file
npx playwright test -g "Valid Login"                   # by test title
npx playwright test --headed                           # watch the browser
npx playwright test --ui                               # UI mode
npx playwright test --list                             # list tests without running
```

## Configuration

Settings live in `playwright.config.js`.

| Setting | Local | When `CI` is set |
|---|---|---|
| Reporter | `html` | `blob` + `github` + `allure-playwright` (shard results are merged into one report later) |
| Retries | 0 | 1 |
| Workers | Playwright default | 1 per shard |
| Failure artifacts | Screenshot, trace and video kept on failure | same |

**Base URL.** `BASE_URL` overrides the default (`https://rahulshettyacademy.com/client/`):

```bash
BASE_URL=https://your-env.example.com/client/ npm run smoke
```

The app uses hash routing, so page objects navigate with paths like `#/auth/login`, relative to the base URL.

## Reports

**Playwright HTML report**

```bash
npx playwright show-report
```

**Allure report** (after a run that used the `allure-playwright` reporter):

```bash
npx allure serve allure-results
```

Traces can be opened from the HTML report, or directly with `npx playwright show-trace <trace.zip>`.

**Reports from a GitHub Actions run**

Open the run and scroll to the **Artifacts** section:

| Artifact | Contents |
|---|---|
| `html-report` | Merged Playwright HTML report for all shards |
| `allure-report` | Combined Allure report for all shards |
| `blob-report-1` to `blob-report-4` | Raw Playwright data per shard |
| `allure-results-1` to `allure-results-4` | Raw Allure data per shard |

To view the Allure report, download and unzip `allure-report`, then run:

```bash
npx allure open allure-report
```

Opening `index.html` directly may show a blank page, so use the command above. Java is required.

## CI/CD

### GitHub Actions (`.github/workflows/playwright.yml`)

- **Triggers:** pull requests to `main` or `master`, a daily schedule, and manual runs.
- **Sharding:** a matrix of 4 shards, each running `npx playwright test --shard=N/4` inside the `mcr.microsoft.com/playwright` Docker image. Keep the image tag in sync with the `@playwright/test` version in `package.json`.
- **Reports:** each shard uploads a Playwright blob report and its Allure results. A `merge-reports` job combines the blobs into one HTML report (`html-report` artifact) and the Allure results into one Allure report (`allure-report` artifact). Both run even when tests fail.
- **Java:** the merge job installs Java 17, because `allure-commandline` (Allure 2) needs it to build the report.
- **Runners:** both jobs run on `ubuntu-24.04`, pinned so a change to `ubuntu-latest` can't break browser installs.
- **Email:** a short notification with a link to the run is sent when the test job fails. It does not include a report summary.

**Repository secrets needed**

| Secret | Purpose |
|---|---|
| `PRODUCTION_URL` | Sets `BASE_URL` for the run |
| `EMAIL_USERNAME` | SMTP username for the failure email |
| `EMAIL_PASSWORD` | SMTP password or app password |

### Jenkins (`Jenkinsfile`)

- Runs on any agent with Windows `bat` steps: `npm ci`, `npx playwright install --with-deps`, `npm run regression`.
- Publishes the Playwright HTML report and an Allure report, archives `test-results/`, and emails on failure with links to both reports.
- Needs the HTML Publisher, Allure and Email Extension plugins.

## Design notes

- **POManager** keeps every page object behind one entry point, so specs ask for pages instead of constructing them.
- **Fixtures** (`Helpers/fixtures.js`) hold shared setup. `authenticatedPage` logs in through the UI and closes its context after the test.
- **Token injection**: API-assisted tests call `addInitScript` to put the auth token in `localStorage`, which avoids logging in through the UI each time.
- **Data-driven tests**: the loop in `loginTest.spec.js` creates one uniquely titled test per entry in `LoginCases.json`.

## Planned improvements

- Move test credentials out of spec files and into environment variables or CI secrets.
- Add per-environment configuration files.
- Convert the suite to TypeScript.
- Publish the Allure report with history, for example through GitHub Pages.
