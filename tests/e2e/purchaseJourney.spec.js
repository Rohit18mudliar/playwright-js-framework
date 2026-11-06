import test, { expect } from "@playwright/test";
import {POManager} from '../../pageObjects/POManager';


test("@Smoke E2E Ecommerce Purchase Journey", async ({ page }) => {

const username ="testuser4@mail.com";
const password = "Rahul@123";
const itemName = "iphone 13 pro";

const poManager = new POManager(page,expect);

// ------------------ Valid Login ----------------------
const loginPage = await poManager.getLoginPage();
await loginPage.goToLoginPage();
await loginPage.login(username,password);
await expect(page).toHaveTitle("Let's Shop");

// ------------------ Add item to Cart ----------------------
const dashboardPage = await poManager.getDashboardPage();
await dashboardPage.searchProductsAndAddToCart(itemName);
await dashboardPage.navigateToCartPage();

// ------------------ Cart page ----------------------
const cartPage = await poManager.getCartPage();
const cartitems = await cartPage.getCartItems();
await cartPage.checkCartPageUrl();
await cartPage.waitForFirstCartItem();
await expect(await cartPage.getCartItemByName(itemName)).toBeVisible(); // Check visiblity of item added
await cartPage.clickCheckout();

// ------------------ Checkout Page ----------------------
const checkoutPage = await poManager.getCheckoutPage();
await expect(await checkoutPage.getUserLabelElement()).toHaveText(username);
await checkoutPage.fillCvv();
await checkoutPage.fillCouponCode();
await checkoutPage.clickApplyButtonForCoupon();
await expect(await checkoutPage.getCouponAppliedMessage()).toBeVisible({timeout: 5000});
await checkoutPage.fillCountryDropdown(); // Dropdown
await expect(checkoutPage.countryDropdown).toHaveValue('India');
await checkoutPage.clickPlaceOrder();

// ------------------ Thank you page ----------------------
const thankYouPage = await poManager.getThankYouPage();
await expect(await thankYouPage.getItems(itemName)).toBeVisible();
const orderID = await thankYouPage.getExactOrderId();
await thankYouPage.clickOrders(); // Goto order list page

// ------------------ Order History Page ----------------------
await expect(page.getByText(orderID)).toBeVisible(); //  check orderId present
const orderHistoryPage = await poManager.getOrderHistoryPage();
await orderHistoryPage.clickViewButtonForOrderId(orderID); // click view button for row with orderId

// ------------------ Order Details Page ----------------------
const orderDetailsPage = await poManager.getOrderDetailsPage();
await expect( orderDetailsPage.getitem()).toHaveText(itemName); //Check same item in order details 
await expect(page.getByText(orderID)).toBeVisible(); //  check orderId present

});