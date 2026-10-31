export class CheckoutPage {

  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
    this.userLabelElement = page.locator("div.user__name  label");
    this.cvv = page.locator("div.field input.txt").nth(2);
    this.coupon = page.locator('[name="coupon"]');
    this.couponApplyButton = page.locator("button.btn-primary");
    this.couponAppliedMessage = page.locator("p.ng-star-inserted");
    this.countryDropdown = page.locator('[placeholder="Select Country"]');
    this.countryDropdownOptions = page.locator("section.ta-results");
    this.placeOrderButton = page.locator('div.actions a');
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
    await this.countryDropdown.pressSequentially("ind");
    await this.countryDropdownOptions.waitFor();
    const optionCount = await this.countryDropdownOptions.locator("button").count();
    for (let i = 0; i < optionCount; i++) {
      const text = await this.countryDropdownOptions.locator("button").nth(i).textContent();
      if (text === " India") {
        await this.countryDropdownOptions.locator("button").nth(i).click();
        break;
      }
    }
  }

  async clickPlaceOrder(){
    await this.placeOrderButton.click(); // place order click
    await this.page.waitForURL("**/dashboard/thanks**");
  }


   
}
