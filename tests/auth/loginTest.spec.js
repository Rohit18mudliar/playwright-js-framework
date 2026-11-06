import test, { expect } from "@playwright/test";
import {POManager} from '../../pageObjects/POManager';
import dataJSON from '../../testData/LoginCases.json' with {type:'json'};

// ------------------ Valid Login & Logout ----------------------

test("@Smoke Valid Login flow", async ({ page }) => {
const username="rifapiv906@netoiu.com";
const password = "Rahul@123";
const poManager = new POManager(page,expect);
const loginPage = await poManager.getLoginPage();
await loginPage.goToLoginPage();
await loginPage.login(username,password);
await expect(page).toHaveTitle("Let's Shop");

});

// ------------------ Invalid Login - Data Driven ----------------------+

for(const dataset of dataJSON){

test(`Invalid Login flow - ${dataset.name}`, async ({ page }) => {
    const poManager = new POManager(page,expect);
    const loginPage = await poManager.getLoginPage();
    await loginPage.goToLoginPage();
    await loginPage.login(dataset.email,dataset.password);
    await expect(page.getByText(dataset.message)).toBeVisible();
});

}