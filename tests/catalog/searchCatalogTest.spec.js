import { expect } from "@playwright/test";
import {POManager} from '../../pageObjects/POManager.js';
import {test} from '../../Helpers/fixtures.js';


test("@Smoke Search and View Catalog", async ({ authenticatedPage }) => {

//search catalog
const itemName = 'ZARA COAT 3';
const poManager = new POManager(authenticatedPage,expect);
const dashboardPage = await poManager.getDashboardPage();
await dashboardPage.navigateToDashboardPage();
await dashboardPage.searchProduct(itemName);
await expect(authenticatedPage.getByText('Showing 1 results')).toBeVisible();
await expect(authenticatedPage.getByText(itemName)).toBeVisible();
await dashboardPage.viewProduct(itemName);
await expect(authenticatedPage.getByText(itemName)).toBeVisible();
});


test("@Smoke Search and filter Catalog", async ({ authenticatedPage }) => {

//search catalog and filter by men -should show no products found
const itemName = 'ZARA COAT 3';
const poManager = new POManager(authenticatedPage,expect);
const dashboardPage = await poManager.getDashboardPage();
await dashboardPage.navigateToDashboardPage();
await dashboardPage.searchAndfilterProduct(itemName, 'men');
await expect(authenticatedPage.getByText('No Products Found')).toBeVisible();
await expect(authenticatedPage.getByText('Showing 0 results')).toBeVisible();

//search catalog and filter by women -should show 1 product
await dashboardPage.searchAndfilterProduct(itemName, 'women');
await expect(authenticatedPage.getByText('Showing 1 results')).toBeVisible();
await expect(authenticatedPage.getByText(itemName)).toBeVisible();
});

