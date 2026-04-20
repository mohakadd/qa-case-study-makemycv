import { test, expect } from '@playwright/test';
import cvData from '../fixtures/cv-data.json';
import { HomePage } from '../pages/HomePage';
import { CvEditorPage } from '../pages/CvEditorPage';

test.describe('Parcours de Création de CV sans authentification', () => {
  // On désactive la session globale pour tester le parcours from scratch
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Tunnel de création complet', async ({ page }) => {

    // Instanciation de notre Page Object Model pour le wizard
    const editorPage = new CvEditorPage(page);

    const homePage = new HomePage(page);

    await test.step('Étape 1 et 2 : Depuis la Home Page vers le Tunnel de Création', async () => {
      await homePage.goto();
      await expect(page).toHaveTitle(/MakeMyCV/i);

      await homePage.startCvCreation();
      await expect(editorPage.startHeadingText).toBeVisible({ timeout: 15000 });
    });

    await test.step('Étape 3 : Upload du CV existant', async () => {
      // 1. On clique sur le bouton d'import
      await editorPage.importCvBtn.first().click();

      // 2. On délègue l'interception et le clic au POM
      await editorPage.uploadCvAndSubmit('tests/fixtures/CvComplet.pdf');

      // 3. On s'assure que l'upload est prêt
      await expect(editorPage.readyForUploadText).toBeVisible({ timeout: 15000 });

      // 4. Validation finale de l'upload
      await editorPage.importSubmitBtn.first().click();

      // 5. Vérification du traitement
      await expect(editorPage.importCompletedText).toBeVisible({ timeout: 15000 });
    });

    await test.step('Étape 4 : Validation et passage aux informations de contact', async () => {
      await editorPage.continueBtn.first().click();
      await expect(editorPage.confirmContactHeadingText).toBeVisible({ timeout: 15000 });

      // Vérification du parsing des données
      const personal = cvData.complete.personal;

      await expect(editorPage.firstNameInput).toHaveValue(personal.first_name);
      await expect(editorPage.lastNameInput).toHaveValue(personal.last_name);
      await expect(editorPage.jobTitleInput).toHaveValue(personal.job_title);
      await expect(editorPage.emailInput).toHaveValue(personal.email);

      const actualPhone = await editorPage.phoneInput.inputValue();
      expect(actualPhone.replace(/\s/g, '')).toBe(personal.phone);

      await expect(editorPage.postalCodeInput).toHaveValue(personal.postal_code);
    });

    await test.step('Étape 5 : Passage à la section Expérience', async () => {
      await editorPage.nextBtn.first().click();
      // Expectation ready for the next section
    });

  });
});
