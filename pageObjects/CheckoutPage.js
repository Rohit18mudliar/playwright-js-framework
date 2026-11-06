export class CheckoutPage {

  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
    this.userLabelElement = page.locator("div.user__name  label");
    this.cvv = page.locator("div.field").filter({hasText : 'CVV Code '}).locator('input.txt');
    this.coupon = page.locator('[name="coupon"]');
    this.couponApplyButton = page.getByRole('button',{name: 'Apply Coupon'});    
    this.couponAppliedMessage = page.getByText('Coupon Applied');    
    this.countryDropdown = page.getByPlaceholder("Select Country");
    this.countryDropdownOptions = page.locator("section.ta-results");
    this.placeOrderButton = page.getByText('Place Order ');
  }

  async getUserLabelElement() {
    return this.userLabelElement;
  }

  async fillCvv() {
    await this.cvv.fill("123");
  }

  async fillCouponCode() {
    await this.coupon.fill("rahulshettyacademy");
  }

  async clickApplyButtonForCoupon() {
    await this.couponApplyButton.click();
  }

  async getCouponAppliedMessage() {
    return this.couponAppliedMessage;
  }

  async fillCountryDropdown() {

    await this.countryDropdown.pressSequentially('ind', { delay: 100 });
    await this.countryDropdownOptions.waitFor();
    await this.countryDropdownOptions.locator('button').filter({ hasText: /^ India$/ }).click();
    await this.expect(this.countryDropdown).toHaveValue('India');

  }

  async clickPlaceOrder(){
    await this.placeOrderButton.click(); // place order click
    await this.page.waitForURL("**/dashboard/thanks**");
  }


   
}
