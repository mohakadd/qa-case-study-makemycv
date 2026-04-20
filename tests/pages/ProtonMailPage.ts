import { Page, Locator } from '@playwright/test';

export class ProtonMailPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitBtn: Locator;
  readonly emailItemRow: Locator;
  readonly magicLinkBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    // Sélecteurs hautement probabilistes pour ProtonMail (Login)
    this.usernameInput = page.locator('input#username, input[name="username"]');
    this.passwordInput = page.locator('input#password, input[name="password"]');
    this.submitBtn = page.locator('button[type="submit"]');

    // Sélecteur pour la boîte mail (Inbox)
    // On cherche une ligne d'email qui provient de MakeMyCV
    this.emailItemRow = page.locator('li').filter({ hasText: /MakeMyCV|Login|Magic Link/i }).first();
    
    // Le lien magique ou bouton à l'intérieur de l'email
    this.magicLinkBtn = page.locator('a').filter({ hasText: /Log in|Sign in|Magic Link|Connect/i });
  }

  async goto() {
    // Si l'URL n'est pas dans le .env, on a une valeur de repli direct
    const url = process.env.MAIL_PROVIDER_URL || 'https://account.proton.me/login';
    await this.page.goto(url);
  }

  async login(username: string, password?: string) {
    await this.usernameInput.fill(username);
    await this.submitBtn.click();

    // ProtonMail utilise parfois un formulaire en 2 étapes (Email puis Mot de passe)
    // Sinon, le mot de passe est sur la même page. On attend un peu.
    await this.passwordInput.waitFor({ state: 'visible', timeout: 5000 });
    if (password) {
      await this.passwordInput.fill(password);
      await this.submitBtn.click();
    }
  }

  async openLatestMagicLink() {
    // Attendre l'apparition du tableau des emails (Inbox)
    await this.page.waitForLoadState('networkidle');
    await this.emailItemRow.waitFor({ state: 'visible', timeout: 30000 });
    await this.emailItemRow.click();
    
    // Attendre que le corps de l'email charge, puis cliquer sur le lien magique
    await this.magicLinkBtn.waitFor({ state: 'visible', timeout: 10000 });
    
    // Plutôt que de cliquer directement (ce qui ouvrirait un 3ème onglet selon le target="_blank"),
    // nous récupérons le href pour pouvoir y naviguer explicitement
    const href = await this.magicLinkBtn.getAttribute('href');
    return href;
  }
}
