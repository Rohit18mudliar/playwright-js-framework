import test, { expect } from "@playwright/test";
import {POManager} from '../pageObjects/POManager';


/**** Array of objects as data *****/
import dataJSON from '../Helpers/placeOrderArrayTestData.json' with { type: 'json' };

// Debugging steps
console.log('typeof data:', typeof dataJSON);
console.log('Is array:', Array.isArray(dataJSON));
console.log('Raw:', JSON.stringify(dataJSON));
   
dataJSON.forEach((dataset)=>{

    test(`Ecommerce test01 - ${dataset.itemName}`, async ({ page }) => {

    const poManager = new POManager(page,expect);

    // ------------------ Login ----------------------
    const loginPage = await poManager.getLoginPage();
    await loginPage.goToLoginPage();
    await loginPage.validLogin(dataset.username,dataset.password);
    await expect(page).toHaveURL('https://rahulshettyacademy.com/client/#/dashboard/dash');

    // ------------------ Add item to Cart ----------------------
    const dashboardPage = await poManager.getDashboardPage();
    await dashboardPage.searchProductsAndAddToCart(dataset.itemName);
    await dashboardPage.navigateToCartPage();

    // ------------------ Cart page ----------------------
    const cartPage = await poManager.getCartPage();
    const cartitems = await cartPage.getCartItems();
    await cartPage.checkCartPageUrl();
    await cartPage.waitForFirstCartItem();
    await expect(await cartPage.getCartItemByName(dataset.itemName)).toBeVisible(); // Check visiblity of item added
    await cartPage.clickCheckout();

    // ------------------ Checkout Page ----------------------
    const checkoutPage = await poManager.getCheckoutPage();
    await expect(await checkoutPage.getUserLabelElement()).toHaveText(dataset.username);
    await checkoutPage.fillCvv();
    await checkoutPage.fillCouponCode();
    await checkoutPage.clickApplyButtonForCoupon();
    await expect(await checkoutPage.getCouponAppliedMessage()).toHaveText('* Coupon Applied');
    await checkoutPage.fillCountryDropdown(); // Dropdown
    await expect(checkoutPage.countryDropdown).toHaveValue('India');
    await checkoutPage.clickPlaceOrder();

    // ------------------ Thank you page ----------------------
    const thankYouPage = await poManager.getThankYouPage();
    await expect(await (await thankYouPage.getItems()).first()).toHaveText(dataset.itemName);
    const orderID = await thankYouPage.getExactOrderId();
    await thankYouPage.clickOrders(); // Goto order list page

    // ------------------ Order History Page ----------------------
    await expect(page.getByText(orderID)).toBeVisible(); //  check orderId present
    const orderHistoryPage = await poManager.getOrderHistoryPage();
    await orderHistoryPage.clickViewButtonForOrderId(orderID); // click view button for row with orderId

    // ------------------ Order Details Page ----------------------
    const orderDetailsPage = await poManager.getOrderDetailsPage();
    await expect( orderDetailsPage.getitem()).toHaveText(dataset.itemName); //Check same item in order details 
    await expect(page.getByText(orderID)).toBeVisible(); //  check orderId present



    });


    })
  
    
