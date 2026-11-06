export class LoginPage {

  constructor(page) {
    this.page = page;
    this.userName = page.locator("#userEmail");
    this.password = page.locator("#userPassword");
    this.signInButton = page.getByRole('button', { name: 'Login' });
  }

  async goToLoginPage(){
    await this.page.goto("#/auth/login");
  }

  async login(username, password) {
    await this.userName.fill(username);
    await this.password.fill(password);
    await this.signInButton.click();  
  }


}
