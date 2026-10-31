import {LoginPage} from './LoginPage';
import {DashboardPage} from './DashboardPage';
import {CartPage} from './CartPage';
import {CheckoutPage} from './CheckoutPage';
import {ThankYouPage} from './ThankYouPage';
import {OrderHistoryPage} from './OrderHistoryPage';
import {OrderDetailsPage} from './OrderDetailsPage';


export class POManager {
  constructor(page,expect) {
    this.page = page;
    this.expect = expect;
    this.loginPage = new LoginPage(this.page);
    this.dashboardPage = new DashboardPage(this.page, this.expect);
    this.cartPage = new CartPage(this.page, this.expect);
    this.checkoutPage = new CheckoutPage(this.page, this.expect);
    this.thankYouPage = new ThankYouPage(this.page, this.expect);
    this.orderHistoryPage = new OrderHistoryPage(this.page, this.expect);
    this.orderDetailsPage = new OrderDetailsPage(this.page, this.expect);
  }

  async getLoginPage() {
    return this.loginPage;
  }

  async getDashboardPage() {
    return this.dashboardPage;
  }
  async getCartPage() {
    return this.cartPage;
  }
  async getCheckoutPage() {
    return this.checkoutPage;
  }

  async getThankYouPage() {
    return this.thankYouPage;
  }
  async getOrderHistoryPage() {
    return this.orderHistoryPage;
  }
  async getOrderDetailsPage() {
    return this.orderDetailsPage;
  }
}
