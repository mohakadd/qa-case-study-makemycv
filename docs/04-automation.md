# Partie 4 — Approche d'automatisation

## 1. Choix du framework : Playwright (TypeScript)

### Décision

**Playwright** avec TypeScript est retenu comme framework principal d'automatisation E2E.

### Justification

| Critère | Playwright | Cypress | Selenium |
|---------|-----------|---------|----------|
| Stack cohérente avec Dotworld | ✅ TypeScript natif, Next.js ready | ✅ JS/TS | ⚠️ Multi-lang |
| Multi-navigateurs natifs | ✅ Chromium, Firefox, WebKit | ❌ Chrome/Electron only (sans plugin) | ✅ |
| Tests mobiles (viewports) | ✅ Natif | ⚠️ Limité | ⚠️ Via Appium |
| Gestion de l'authentification | ✅ `storageState` — session réutilisable | ⚠️ Plus verbeux | ⚠️ |
| Parallélisme natif | ✅ Workers natifs | ⚠️ Payant (Cypress Cloud) | ⚠️ |
| CI/CD GitHub Actions | ✅ Image Docker officielle | ✅ | ✅ |
| Interception réseau (API mocking) | ✅ `page.route()` | ✅ `cy.intercept()` | ❌ |
| Traces & rapports | ✅ Trace Viewer, HTML Report | ✅ Dashboard payant | ⚠️ |
| Courbe d'apprentissage | 🟡 Modérée | 🟢 Faible | 🔴 Élevée |

**Playwright remporte la décision** grâce à : la cohérence TypeScript, la couverture multi-navigateurs incluant Safari/WebKit (critique pour les utilisateurs iOS), et le parallélisme natif sans surcoût.

Pour les **tests d'API**, **Playwright Test** intègre nativement `request` context — pas besoin d'outil séparé pour les tests d'API REST simples. Pour des tests API approfondis, **Postman/Newman** sera utilisé en complément en CI.

---

## 2. Architecture du projet de tests

```
tests/
├── e2e/
│   ├── auth.test.ts              # Tests inscription / connexion / déconnexion
│   └── cv-creation.test.ts       # Parcours création CV complet (happy path + edge cases)
├── api/
│   └── cv.api.test.ts            # Tests API REST (endpoints CV CRUD)
├── fixtures/
│   ├── test-accounts.json        # Données utilisateurs de test
│   ├── cv-data.json              # Jeux de données CV (complet, vide, edge cases)
│   └── payment.json              # Cartes Stripe de test
├── pages/                        # Page Object Model
│   ├── HomePage.ts               # Actions liées à la page d'accueil (Landing)
│   ├── LoginPage.ts
│   ├── RegisterPage.ts
│   ├── CvEditorPage.ts           # Actions de l'éditeur contenant l'Upload filechooser
│   ├── TemplateSelectorPage.ts
│   └── PricingPage.ts
├── helpers/
│   ├── auth.helper.ts            # Réutilisation session (storageState)
│   └── cv.helper.ts              # Helpers création CV programmatique
└── playwright.config.ts
```

### Principes d'architecture

**Page Object Model (POM)** : chaque page a sa propre classe encapsulant les sélecteurs et les actions. Les tests ne contiennent que de la logique de scénario, pas de sélecteurs bruts.

```typescript
// pages/CvEditorPage.ts — exemple
export class CvEditorPage {
  constructor(private page: Page) {
     this.firstNameInput = page.locator('input[name="first_name"]');
     this.browseBtn = page.getByRole('button', { name: 'Browse' });
  }

  async uploadCvAndSubmit(filePath: string) {
    // Interception de la boîte de dialogue système
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.browseBtn.first().click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
  }
}
```

**Fixtures réutilisables** : les données de test (utilisateurs, CVs) sont externalisées en JSON pour être facilement maintenables par toute l'équipe. L'isolation empêche les conflits asynchrones (`test-accounts.json`).

**Authentification centralisée** : le `storageState` Playwright est généré une fois (`playwright/.auth/user.json`) et réutilisé dans tous les tests nécessitant un compte connecté — évite de répéter le login à chaque test nominal.

---

## 3. Scénario automatisé — Création d'un CV complet

Le test principal du tunnel de création (Onboarding + Upload CV) est implémenté dans le fichier suivant, utilisant le pattern `test.step()` de manière robuste avec les abstractions du `CvEditorPage` :
Voir le fichier : [`tests/e2e/cv-creation.test.ts`](../tests/e2e/cv-creation.test.ts)

---

## 4. Stratégie CI/CD

### Pipeline GitHub Actions

Voir le fichier : [`.github/workflows/tests.yml`](../.github/workflows/tests.yml)

### Déclencheurs et Intégration Vercel

| Trigger | Tests exécutés | Objectif |
|---------|---------------|----------|
| `deployment_status` (Vercel) | Suite E2E complète (Chromium) | Déclenchement automatique et injection de l'URL éphémère de Preview une fois le déploiement de la PR terminé. |
| `push` sur feature branch | Tests unitaires + API | Feedback rapide dev (~3 min) |
| `schedule` daily 7h00 | Suite E2E multi-navigateurs | Régression quotidienne avant déploiement 9h. Permet de valider la branche de Staging avant canary. |
| `workflow_dispatch` (Production) | Smoke Tests (Selenium/Playwright tagués `@smoke`) | Validation sur `makemycv.com` post-Canary. Notifie Slack en cas d'échec. |

### Règles de merge

- **Aucun merge sans green CI** sur les tests P0/P1
- Les tests E2E sont en `--reporter=html` → artefact uploadé sur chaque run

### Priorité des variables (Séparation Local vs CI)

Pour éviter que la configuration personnelle d'un développeur ne casse les tests sur GitHub, le système utilise un ordre de priorité simple pour l'URL à tester :

1. **Développement Local** : Les tests exploitent le fichier local `.env` (ignoré par Git via le `.gitignore`). Le développeur y inscrit `BASE_URL=https://makemycv.com` (ou `http://localhost:3000`) pour tester son environnement.
2. **Exécution CI (GitHub Actions)** : Absent du cloud, le `.env` est ignoré. À la place, le workflow GitHub écrase dynamiquement le `BASE_URL` au sein de la "step" E2E. En cas de Pull Request, il injecte `${{ github.event.deployment_status.environment_url }}`, forçant ainsi Playwright à cibler la toute nouvelle Preview Vercel éphémère.

### Intégration avec le process de déploiement canary

Compte tenu du déploiement quotidien à 9h avec une fenêtre canary de 3h :

```
07:00 — Pipeline CI déclenché (cron) sur l'environnement de Staging
07:15 — Suite E2E Multibrowser terminée → rapport détaillé disponible pour l'équipe QA
08:00 — Validation QA des résultats CI + GO technique prod
09:00 — Déploiement canary automatisé (20% des utilisateurs)
09:05 — Pipeline Workflow Dispatch exécuté sur l'URL de Prod (Suite @smoke)
09:06 — En cas d'échec critique (alerte Slack) : Déclenchement automatique d'un Rollback Vercel via l'API. La prod est sauvée instantanément.
09:00–12:00 — Fenêtre d'observation technique (Crash logs, Monitoring, etc.)
12:00 — Rollout 100% sur tous les utilisateurs si aucune anomalie n'a été détectée pendant la fenêtre d'observation.
```
