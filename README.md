<div align="center">
  <img src="docs/screens/makemycv.svg" width="400">
</div>

# QA Case Study

> Étude de cas technique pour le poste de QA Engineer Senior chez Dotworld.

---

## Présentation

MakeMyCV est une application web SaaS permettant aux utilisateurs de créer, personnaliser et télécharger leur CV en ligne, avec assistance IA, templates recruteur-approuvés, génération de lettre de motivation et export PDF ou Word.

---

## Organisation du repo

```
qa-case-study-makemycv/
├── README.md                    # Ce fichier — vue d'ensemble & getting started
├── docs/
│   ├── screens/                 # Dossier contenant les captures d'écrans
│   ├── 01-test-strategy.md      # Cartographie fonctionnelle, matrice de risques, plan de test
│   ├── 02-test-cases.md         # Cas de test détaillés (12 cas manuels)
│   ├── 03-bug-reports.md        # Bugs identifiés durant l'exploration
│   ├── 04-automation.md         # Stratégie d'automatisation, architecture, CI/CD
│   └── 05-recommendations.md    # Recommandations UX, vision QA 3 mois, métriques
├── tests/
│   ├── e2e/
│   │   ├── cv-creation.test.ts  # Scénario E2E critique : création de CV complet
│   │   └── auth.test.ts         # Tests d'authentification (inscription / connexion)
│   ├── api/
│   │   └── cv.api.test.ts       # Tests API REST (health check, sécurité, validation schéma)
│   ├── pages/                   # Page Object Models
│   │   ├── HomePage.ts
│   │   ├── LoginPage.ts
│   │   ├── CvEditorPage.ts
│   │   └── ProtonMailPage.ts
│   └── fixtures/                # Données de test (JSON, PDF, DOCX)
├── package.json
└── .github/
    └── workflows/
        ├── e2e-pr.yml           # Tests E2E Chromium — déclenché sur chaque PR
        ├── e2e-full.yml         # Suite complète multi-navigateurs — cron quotidien 7h00
        └── smoke-prod.yml       # Smoke tests Production — déclenchement manuel post-canary
```

---

## Getting Started

### Prérequis

- Node.js >= 18
- npm >= 9

### Installation

```bash
git clone https://github.com/mohakadd/qa-case-study-makemycv.git
cd qa-case-study-makemycv
npm install
npx playwright install --with-deps
```

### Exécuter les tests E2E

```bash
# Tous les tests
npx playwright test

# Avec interface graphique (headed)
npx playwright test --headed

# Mode UI interactif
npx playwright test --ui

# Un fichier spécifique
npx playwright test tests/e2e/cv-creation.test.ts

# Rapport HTML
npx playwright show-report
```

### Variables d'environnement

Créer un fichier `.env` à la racine (voir `.env.example`) :

```env
BASE_URL=https://makemycv.com
TEST_EMAIL=ton_email_de_test@example.com
TEST_PASSWORD=TonMotDePasse!
```

### Secrets & variables GitHub Actions

À configurer dans **Settings → Secrets and variables → Actions** du repo pour que la CI fonctionne :

#### Secrets (sensibles — chiffrés, jamais visibles après création)

| Nom | Workflow | Description |
|-----|----------|-------------|
| `TEST_EMAIL` | e2e-pr, e2e-full | Email du compte de test |
| `TEST_PASSWORD` | e2e-pr, e2e-full | Mot de passe du compte de test |
| `PROD_TEST_EMAIL` | smoke-prod | Email du compte de test Production |
| `PROD_TEST_PASSWORD` | smoke-prod | Mot de passe du compte de test Production |
| `VERCEL_TOKEN` | smoke-prod | Token API Vercel (Account Settings → Tokens) |
| `SLACK_QA_WEBHOOK` | smoke-prod | Webhook Slack pour les alertes d'échec |

#### Variables (non sensibles)

| Nom | Workflow | Description |
|-----|----------|-------------|
| `BASE_URL` | e2e-pr, e2e-full | URL cible (défaut : `https://makemycv.com`) |
| `VERCEL_PROJECT_ID` | smoke-prod | ID du projet Vercel (Project Settings → General) |

---

## Synthèse de l'approche

### Méthode d'exploration

L'exploration du produit a suivi une approche **session-based testing** : 3 sessions de 30 minutes chacune ciblant respectivement (1) le parcours de création de CV, (2) les fonctionnalités IA et la personnalisation, (3) le tunnel de conversion Premium et la gestion de compte.

### Constats clés

| Dimension | Observation |
|-----------|-------------|
| **Périmètre** | Application mature avec 14 fonctionnalités identifiées (F1–F14) |
| **Risque principal** | Le tunnel de paiement et l'export PDF sont les points de conversion critiques |
| **Automatisation** | Playwright (TypeScript) retenu — cohérent avec la stack Next.js/TS de Dotworld |
| **Bugs identifiés** | 14 anomalies documentées (3 Critiques, 7 Majeurs, 3 Mineurs, 1 Cosmétique) |

### Priorités de test identifiées

1. Création & édition de CV (parcours nominal + edge cases)
2. Export PDF (fonctionnalité monétisée clé)
3. Authentification & gestion de compte
4. Tunnel Premium / paiement
5. Générateur IA de contenu
6. Responsive / compatibilité navigateurs

> Pour le détail complet, voir [`docs/01-test-strategy.md`](docs/01-test-strategy.md)