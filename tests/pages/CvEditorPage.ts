import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model — Assistant de Création de CV (Onboarding)
 * Sépare strictement les "Actions / Locators" de l'UI des "Assertions" (qui restent dans le test).
 */
export class CvEditorPage {
  readonly page: Page;

  // --- Locators (Boutons de navigation) ---
  readonly importCvBtn: Locator;
  readonly browseBtn: Locator;
  readonly importSubmitBtn: Locator;
  readonly continueBtn: Locator;
  readonly nextBtn: Locator;

  // --- Locators (Champs du formulaire Personal/Contact) ---
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly jobTitleInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly addressInput: Locator;
  readonly postalCodeInput: Locator;

  // --- Locators (Textes pour synchronisation/Assertions) ---
  readonly startHeadingText: Locator;
  readonly readyForUploadText: Locator;
  readonly importCompletedText: Locator;
  readonly confirmContactHeadingText: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation & Boutons
    this.importCvBtn = page.getByRole('button', { name: 'Import my CV' });
    this.browseBtn = page.getByRole('button', { name: 'Browse' });
    this.importSubmitBtn = page.getByRole('button', { name: 'Import' });
    this.continueBtn = page.getByRole('button', { name: 'Continue' });
    this.nextBtn = page.getByRole('button', { name: 'Next' });

    // Inputs (Sélecteurs robustes qui matchent la réalité du Front-End Vue/React)
    this.firstNameInput = page.locator('input[name="first_name"]');
    this.lastNameInput = page.locator('input[name="last_name"]');
    this.jobTitleInput = page.locator('input[name="job_title"]');
    this.emailInput = page.locator('input[name="email"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.addressInput = page.locator('input[name="address"]');
    this.postalCodeInput = page.locator('input[name="postal_code"]');

    // Textes de confirmation
    this.startHeadingText = page.getByText(/How do you want to start/i);
    this.readyForUploadText = page.getByText(/Ready for upload/i);
    this.importCompletedText = page.getByText(/Import has been completed/i);
    this.confirmContactHeadingText = page.getByText(/Let’s confirm with your contact details/i);
  }

  // --- Actions ---

  /**
   * Encapsule toute la mécanique de la boîte de dialogue système pour injecter le fichier PDF
   */
  async uploadCvAndSubmit(filePath: string) {
    // On prépare l'interception de la boîte de dialogue de Windows/Mac
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    
    // On clique sur le vrai bouton (Browse) qui déclenche l'upload
    await this.browseBtn.first().click();

    // On récupère la fenêtre et on injecte le fichier
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
  }
}
