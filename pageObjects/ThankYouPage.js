export class ThankYouPage {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
    this.items = page.locator("td.line-item div.title");
    this.orderIds = page.locator("tr.ng-star-inserted label");
    this.orderHistoryLink = page.locator(
      'label[routerlink="/dashboard/myorders"]',
    );
  }

  async getItems() {
    return this.items;
  }

  // async getOrderIds() {
  //   return this.orderIds;
  // }

  async clickOrders() {
    await this.orderHistoryLink.click();
    await this.page.waitForURL("**/dashboard/myorders**");
  }

  async getExactOrderId() {
    const OrderIDFull = await (this.orderIds).textContent();
    const orderID = OrderIDFull.slice(2, OrderIDFull.length - 2); // extract orderID or use includes later
    console.log('orderID  '+orderID);
    return orderID;

  }
}
