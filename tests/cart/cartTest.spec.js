import { expect,request } from "@playwright/test";
import {POManager} from '../../pageObjects/POManager.js';
import {test} from '../../Helpers/fixtures.js';
import {ApiUtils} from '../../Helpers/ApiUtils.js'

/******************************  Variables  ************************************************/

const loginPayload = {userEmail: "rifapiv906@netoiu.com", userPassword: "Rahul@123"};
const addToCartPayload = {"_id":"699c5ab6ef5a289f838de6f2","product":{"_id":"6960eac0c941646b7a8b3e68","productName":"ZARA COAT 3","productCategory":"electronics","productSubCategory":"mobiles","productPrice":11500,"productDescription":"Apple phone","productImage":"https://rahulshettyacademy.com/api/ecom/uploads/productImage_1767959232316.jpeg","productRating":"0","productTotalOrders":"0","productStatus":true,"productFor":"women","productAddedBy":"admin","__v":0}};
let token;
let apiContext,cartPage,dashboardPage,apiUtils;
let response = {};
let itemName = 'ZARA COAT 3';

/******************************  Tests  ************************************************/

test.describe.configure({serial:true}); // Run tests in this file in serial mode, as we are using same cart item for all tests

test.beforeAll(async()=>{   
    apiContext = await request.newContext();
    apiUtils = new ApiUtils(apiContext,loginPayload); 
});

test.beforeEach(async({page})=>{
     // API - login and Add to cart
    response = await apiUtils.addToCart(addToCartPayload);
    await expect(response.message).toBe("Product Added To Cart");   
    // injecting a token
    await page.addInitScript((value)=>window.localStorage.setItem("token",value),response.token);
    //Get Page objects
    const poManager = new POManager(page,expect);
    cartPage = await poManager.getCartPage();
    dashboardPage = await poManager.getDashboardPage();
    console.log('Before each - Login , Added item to cart and injected token');
});

test.afterAll(async()=>{
    await apiContext.dispose();
});


test('@API Cart page - Click Continue Shopping link',async({page})=>{
    // Navigate to cart page
    await cartPage.navigateToCartPage();
    // Click on Continue Shopping link
    await cartPage.clickContinueShopping();
});


test('@API Cart page - Click on Buy Now button for a specific cart item ',async({page})=>{
    //Navigate to cart page
    await cartPage.navigateToCartPage();
    //Click on Buy Now button for a specific cart item
    await cartPage.clickBuyNowForCartItem(itemName);
});


test('@API Cart page - Delete item from cart ',async({page})=>{
    //Navigate to cart page
    await cartPage.navigateToCartPage();
    //Delete item from cart
    await cartPage.deleteCartItemByName(itemName);
});

