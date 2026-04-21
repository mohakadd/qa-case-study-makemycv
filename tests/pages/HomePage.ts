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
    const viewport = this.page.viewportSize();
    if (viewport && viewport.width < 768) {
      // On mobile, the desktop nav link is intercepted by overlapping elements.
      // Navigate directly to the app login page.
      await this.page.goto('https://app.makemycv.com/en/login');
    } else {
      await this.myAccountLink.click();
    }
  }

  async startCvCreation() {
    await this.createCvBtn.click();
  }
}
