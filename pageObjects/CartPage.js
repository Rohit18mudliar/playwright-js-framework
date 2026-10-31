export class CartPage {

  constructor(page,expect) {
    this.page = page;
    this.expect = expect; 
    this.cartItems = page.locator('div li.ng-star-inserted'); 

  }


async getCartItems(){
  return this.cartItems;
}

async getCartItemByName(itemName){
  return this.cartItems.filter({hasText :itemName });
}

async waitForFirstCartItem(){
  await this.cartItems.first().waitFor();
}

async checkCartPageUrl(){
  await this.expect(this.page).toHaveURL('https://rahulshettyacademy.com/client/#/dashboard/cart');
}

async clickCheckout(){
  await this.page.getByRole('button',{name:'Checkout'}).click();

}


}
