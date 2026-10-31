export class OrderDetailsPage {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
    this.item = page.locator('div.title');
  }

  
getitem(){
return  this.item;
}



}
