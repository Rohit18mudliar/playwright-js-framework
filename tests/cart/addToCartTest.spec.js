import { expect,request } from "@playwright/test";
import {POManager} from '../../pageObjects/POManager.js';
import {test} from '../../Helpers/fixtures.js';
import {ApiUtils} from '../../Helpers/ApiUtils.js'

/******************************  Variables  ************************************************/

const loginPayload = {userEmail: "testuser2@mail.com", userPassword: "Rahul@123"};
let token;
let apiContext;
let itemName = 'ADIDAS ORIGINAL';

/******************************  Tests  ************************************************/


test("@Smoke Add one item to Cart and verify item in cart page", async ({ page }) => {

// Login via API and get token
apiContext = await request.newContext();
const apiUtils = new ApiUtils(apiContext,loginPayload);
token = await apiUtils.getToken();

// Reuse login token
await page.addInitScript((value)=>window.localStorage.setItem("token",value),token);

// Search catalog and add to cart
const poManager = new POManager(page,expect);
const dashboardPage = await poManager.getDashboardPage();
await dashboardPage.navigateToDashboardPage();
await dashboardPage.searchProduct(itemName);
await dashboardPage.searchProductsAndAddToCart(itemName);
await dashboardPage.navigateToCartPage();

// Verify cart page and item
const cartPage = await poManager.getCartPage();
await cartPage.checkCartPageUrl();
await cartPage.waitForFirstCartItem();
const cartItem = await cartPage.getCartItemByName(itemName);
await expect(cartItem).toHaveCount(1);

});




