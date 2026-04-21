import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly submitBtn: Locator;
  readonly bodyText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.submitBtn = page.locator('button[type="submit"]');
    this.bodyText = page.locator('body');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string) {
    await this.emailInput.click();
    await this.emailInput.fill(email);
    await expect(this.emailInput).toHaveValue(email);
    await this.submitBtn.click();
  }
}
