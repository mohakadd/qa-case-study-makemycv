import { test, expect } from '@playwright/test';
import testAccounts from '../fixtures/test-accounts.json';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { ProtonMailPage } from '../pages/ProtonMailPage';

test.describe('Authentification', () => {
  // On désactive la session globale pour tester le parcours depuis l'écran de login
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Compte existant @smoke', async ({ context }) => {

    // On initialise la page
    const appPage = await context.newPage();

    await test.step('Étape 1 : Arrivée sur l\'application via la Home Page', async () => {
      const homePage = new HomePage(appPage);
      await homePage.goto();
      await homePage.goToLogin();

      // On vérifie que la redirection vers l'espace de connexion s'est bien faite
      await expect(appPage).toHaveURL(/login/);
    });

    await test.step('Étape 2 : Demande de Magic Link', async () => {
      // C'est seulement mnt qu'on instancie le composant de page, 
      // puisqu'on vient physiquement d'arriver sur l'écran /login
      const loginPage = new LoginPage(appPage);

      // Le composant input doit être visible après notre clic précédent
      await expect(loginPage.emailInput).toBeVisible({ timeout: 15000 });

      const testUser = testAccounts.free;
      await loginPage.login(testUser.email);

      await expect(loginPage.bodyText).toContainText(/check your inbox|check you inbox/i, { timeout: 15000 });
    });

    //await test.step('Étape 3 : Récupération du magic link', async () => {
    /* 
     * NOTE : La suite de ce test a été commentée.
     * Bien que l'architecture multi-onglets (POM ProtonMailPage) soit fonctionnelle, 
     * l'automatisation de l'UI de ProtonMail est bloquée par les sécurités Anti-Bot
     * qui produisent un chargement infini empêchant le clic sur le lien magique.
     * 
     * Le code est conservé ci-dessous à titre de démonstration technique.
     */

    // const mailPage = await context.newPage();
    // const protonPage = new ProtonMailPage(mailPage);
    // await protonPage.goto();
    // await protonPage.login(testUser.email, process.env.TEST_PASSWORD as string);
    // const magicLinkUrl = await protonPage.openLatestMagicLink();
    // expect(magicLinkUrl).toBeTruthy();
    //
    // if (magicLinkUrl) {
    //   await appPage.goto(magicLinkUrl);
    //   await expect(appPage).toHaveURL(/dashboard|cv-editor/i, { timeout: 20000 });
    // }
  });

  test('Compte inexistant', async ({ page }) => {

  await test.step('Étape 1 : Arrivée sur l\'application via la Home Page', async () => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.goToLogin();
    await expect(page).toHaveURL(/login/);
  });

  await test.step('Étape 2 : Soumission d\'un format email incorrect', async () => {
    const loginPage = new LoginPage(page);
    await expect(loginPage.emailInput).toBeVisible({ timeout: 15000 });

    await loginPage.login('adresse_email_fantome');
    await expect(loginPage.bodyText).toContainText(/please provide a valid email address./i, { timeout: 15000 });
  });

});

});
