export class DashboardPage {

  constructor(page,expect) {
    this.page = page;
    this.expect = expect;
    this.products = page.locator(".card-body");
    this.titles = page.locator(".card-body b");
    this.searchInput = page.getByRole('textbox', {name: 'search'});
    this.toastMessage = page.locator("div.toast-message");
    this.cartLink = page.locator('[routerlink="/dashboard/cart"]');
    this.signOut = page.getByRole('button', { name: ' Sign Out ' });
    this.filter = page.locator('div.form-group');    
  }

async searchProduct(productName){
    await this.searchInput.clear();
    await this.searchInput.pressSequentially(productName);
    await this.searchInput.press('Enter');
  }

async viewProduct(productName){
    await this.products.filter({hasText: productName}).getByRole('button', {name: 'View'}).click();
}

async searchAndfilterProduct(productName, filterText){
    await this.searchInput.clear();
    await this.searchInput.pressSequentially(productName);
    await this.searchInput.press('Enter');
    await this.filter.filter({has: this.page.getByText(filterText,{exact: true})}).getByRole('checkbox').check();
}

async searchProductsAndAddToCart(itemName){  
  await this.titles.first().waitFor();
  await this.products.filter({hasText:itemName}).getByRole('button', { name: 'Add To Cart' }).click();
  await this.expect(this.toastMessage).toContainText("Product Added To Cart");
}

async navigateToCartPage(){
     await this.cartLink.click();     
}

async navigateToDashboardPage(){
     await this.page.goto("#/dashboard/dash");
   
}

async clickSignOut(){
  await this.signOut.click();     
  await this.expect(this.page).toHaveURL("#/auth/login");

}

}
