export class OrderHistoryPage {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
    this.rows = page.getByRole('row');
  }

async clickViewButtonForOrderId(orderID){    
    this.rows.filter({hasText:orderID}).getByRole('button',{name: 'View'}).click(); //Click view for orderid
    await this.page.waitForURL("**/dashboard/order-details**");
}

async getOrderIdList(){
  const orderIDArray = await this.rows.getByRole('columnheader').allTextContents(); // storing orderIDs in array
  return orderIDArray;
}

async rowWithOrderId(orderID){
return page.getByRole('row', { name: orderID });
}



}
