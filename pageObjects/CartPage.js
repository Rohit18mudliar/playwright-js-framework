export class CartPage {

constructor(page,expect) {
    this.page = page;
    this.expect = expect;    
    this.cartItems = page.locator('div.infoWrap');    
    this.ContinueShoppingLink = page.getByRole('button', { name: 'Continue Shopping' });
}

async navigateToCartPage(){
     await this.page.goto("#/dashboard/cart");   
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
  await this.expect(this.page).toHaveURL('#/dashboard/cart');
}

async clickCheckout(){
  await this.page.getByRole('button',{name:'Checkout'}).click();

}
//delete cart item by name
async deleteCartItemByName(itemName){
  const cartItem = await this.getCartItemByName(itemName);
  await cartItem.locator('button.btn-danger').click();
  await this.expect(cartItem).toHaveCount(0);

}

// Click on Continue Shopping link
async clickContinueShopping(){
  await this.ContinueShoppingLink.click();
  await this.expect(this.page).toHaveURL('#/dashboard/dash');
}

//Click on Buy Now button for a specific cart item
async clickBuyNowForCartItem(itemName){
  const cartItem = await this.getCartItemByName(itemName);
  await cartItem.getByRole('button', { name: 'Buy Now' }).click();
  await this.expect(this.page).toHaveURL(/\/dashboard\/order/);
}

}