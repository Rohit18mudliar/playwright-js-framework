import base, { expect } from "@playwright/test";

// custom test and custom fixture 
 export const custTest = base.test.extend({
  testDataForOrder: {
    username: "rifapiv906@netoiu.com",
    password: "Rahul@123",
    itemName: "iphone 13 pro",
  },
});
