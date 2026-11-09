import { test as base, expect ,request} from "@playwright/test";
import {POManager} from '../pageObjects/POManager.js';

const loginPayload = {userEmail: "testuser5@mail.com", userPassword: "Rahul@123"};


export const test = base.extend({

  authenticatedPage: async ({browser},use) => {  
                                                //login via UI
                                                const context = await browser.newContext();
                                                const page = await context.newPage();
                                                const poManager = new POManager(page,expect);
                                                const loginPage = await poManager.getLoginPage();
                                                await loginPage.goToLoginPage();
                                                await loginPage.login(loginPayload.userEmail, loginPayload.userPassword);
                                                await expect(page).toHaveTitle("Let's Shop");                                                
                                                await use(page);  // return value
                                                await context.close(); // tear down
                                            }  

});
