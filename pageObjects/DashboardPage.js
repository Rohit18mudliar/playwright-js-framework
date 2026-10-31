export class DashboardPage {

  constructor(page,expect) {
    this.page = page;
    this.expect = expect;
    this.products = page.locator(".card-body");
    this.titles = page.locator(".card-body b");
    this.cart = page.locator('[routerlink="/dashboard/cart"]');
    this.toastMessage = page.locator("div.toast-message");
    this.cartLink = page.locator('[routerlink="/dashboard/cart"]');

  }

async searchProductsAndAddToCart(itemName){

    await this.titles.first().waitFor();
    const count = await this.products.count();

    for(let i=0;i<count;i++){
    
        if(await this.products.nth(i).locator('b').textContent()===itemName){
            await this.products.nth(i).locator('text= Add To Cart').click();
            break;
          }
    
      }

    await this.expect(this.toastMessage).toContainText("Product Added To Cart");

}

async navigateToCartPage(){
     await this.cartLink.click();     
}


}
