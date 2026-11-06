export class ThankYouPage {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
    this.items = page.getByRole('cell');
    this.orderIds = page.getByRole('cell').locator("label").filter({ hasText: /\|\s*[a-f0-9]{24}\s*\|/ });
    this.orderHistoryLink = page.getByText('Orders History Page');
  }

  async getItems(itemName) {
    return this.items.getByText(itemName);
  }

  async clickOrders() {
    await this.orderHistoryLink.click();
    await this.page.waitForURL("**/dashboard/myorders**");
  }

  async getExactOrderId() {
    const OrderIDFull = await (this.orderIds).textContent(); // eg.  | 6aed743092a4341c4c06e7c0 | 
    const orderID = OrderIDFull.replace(/\|/g, '').trim(); // extract orderID
    console.log('orderID  '+orderID);
    return orderID;

  }
}
