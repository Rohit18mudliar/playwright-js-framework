export class LoginPage {

  constructor(page) {
    // Locators in the page should be in constructor
    this.page = page;
    this.userName = page.locator("#userEmail");
    this.password = page.locator("#userPassword");
    this.signInButton = page.locator('[name="login"]');
  }

  // Actions in the page should be methods . These methods should use the locators initialised in constructors

  async goToLoginPage(){
    await this.page.goto("https://rahulshettyacademy.com/client/#/auth/login");
}

  async validLogin(username, password) {

    await this.userName.fill(username);
    await this.password.fill(password);
    await this.signInButton.click();  

  }
}
