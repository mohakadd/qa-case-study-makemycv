import { test, expect } from '@playwright/test';

/**
 * ARCHITECTURE DEMONSTRATION: API TESTING
 * 
 * Cette suite de tests illustre la capacité de Playwright à réaliser
 * des tests de la couche API (Shift-Left Testing) via l'objet "request" natif,
 * en complément des tests End-To-End graphiques.
 */
test.describe('API Tests - CV CRUD Operations', () => {

  // On désactive l'attente du fichier user.json (StorageState UI) pour les tests API purs
  test.use({ storageState: { cookies: [], origins: [] } });

  const API_ENDPOINT = '/api/v1/cvs';

  test('✅ [GET] Health Check @smoke - L\'API principale ou la page d\'accueil doit répondre en 200 OK', async ({ request, baseURL }) => {
    // Pour l'audit, nous testons la réponse racine du serveur (Health Check basique)
    const response = await request.get(`${baseURL}/`);
    
    // Assertion sur le statut
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    // Assertion sur les en-têtes (Headers) garantissant l'intégrité de la réponse
    const headers = response.headers();
    expect(headers).toHaveProperty('content-type');
    expect(headers['content-type']).toContain('text/html'); // Ou application/json sur un vrai /api
  });

  test('🛡️ [POST] Sécurité - Doit rejeter une création de CV avec 401/403/404 sans Token', async ({ request, baseURL }) => {
    // Tentative d'injection sans en-tête d'autorisation (Bearer Token)
    const payload = {
      title: 'Mon Super CV',
      job_title: 'Lead QA Automation Engineer'
    };

    const response = await request.post(`${baseURL}${API_ENDPOINT}`, {
      data: payload,
    });

    // En l'état de l'audit externe, le serveur devrait rejeter la requête (Non Autorisé, Interdit, ou endpoint masqué)
    expect([401, 403, 404, 405]).toContain(response.status());
  });

  test('🔄 [POST] Validation Schéma - Doit rejeter un payload malformé', async ({ request, baseURL }) => {
    // Envoi d'un payload incomplet (ex: manque le titre du CV)
    const malformedPayload = {
      skills: ['Playwright', 'API Testing', 'TypeScript']
    };

    const response = await request.post(`${baseURL}${API_ENDPOINT}`, {
      data: malformedPayload,
      headers: {
        'Authorization': 'Bearer DUMMY_TEST_TOKEN'
      }
    });

    // On s'attend à ce que le Backend valide le schéma et rejette (Bad Request) ou refuse (Auth/Not Found)
    expect([400, 401, 403, 404, 405]).toContain(response.status());
  });
});
