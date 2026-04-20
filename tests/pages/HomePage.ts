import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model — Page d'Accueil (Landing Page)
 */
export class HomePage {
  readonly page: Page;

  readonly myAccountLink: Locator;
  readonly createCvBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    // Locators
    this.myAccountLink = page.getByText(/My account/i).first();
    this.createCvBtn = page.getByRole('button', { name: 'Create my CV' }).first();
  }

  // --- Actions ---
  async goto() {
    await this.page.goto('/');
  }

  async goToLogin() {
    await this.myAccountLink.click();
  }

  async startCvCreation() {
    await this.createCvBtn.click();
  }
}
