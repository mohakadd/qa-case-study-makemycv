<div align="center">
  <img src="docs/screens/makemycv.svg" width="400">
</div>

# QA Case Study — MakeMyCV.com

> Étude de cas technique pour le poste de QA Engineer Senior chez Dotworld (Mars 2026).

---

## Présentation

MakeMyCV est une application web SaaS permettant aux utilisateurs de créer, personnaliser et télécharger leur CV en ligne, avec assistance IA, templates recruteur-approuvés, génération de lettre de motivation et export PDF ou Word.

---

## Organisation du repo

```
qa-case-study-makemycv/
├── README.md                       # Ce fichier — vue d'ensemble & getting started
├── docs/
│   ├── screens/                    # Captures d'écran et GIFs des bugs
│   ├── 01-test-strategy.md         # Cartographie, matrice de risques, plan de test, environnements
│   ├── 02-test-cases.md            # 12 cas de test détaillés sur 3 parcours critiques
│   ├── 03-bug-reports.md           # 12 bugs identifiés (3 Critiques, 6 Majeurs, 3 Mineurs)
│   ├── 04-automation.md            # Framework, architecture POM, CI/CD
│   └── 05-recommendations.md       # Recommandations UX, vision QA 3 mois, métriques
├── tests/
│   ├── e2e/
│   │   ├── auth.test.ts            # Tests d'authentification (magic link)
│   │   └── cv-creation.test.ts     # Parcours de création de CV via import
│   ├── api/
│   │   └── cv.api.test.ts          # Tests API (health check, sécurité, validation schéma)
│   ├── pages/                      # Page Object Models
│   │   ├── HomePage.ts
│   │   ├── LoginPage.ts
│   │   ├── CvEditorPage.ts
│   │   └── ProtonMailPage.ts
│   └── fixtures/
│       ├── test-accounts.json      # Comptes de test (gratuit, premium)
│       ├── cv-data.json            # Jeux de données CV
│       ├── payment.json            # Cartes Stripe de test
│       ├── CvComplet.pdf           # CV de référence pour les tests d'import
│       └── CvComplet.docx
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── .github/
    └── workflows/
        └── tests.yml               # Pipeline GitHub Actions
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

### Variables d'environnement

Créer un fichier `.env` à la racine :

```env
BASE_URL=https://app.makemycv.com
MAIL_PROVIDER_URL=https://account.proton.me/login
TEST_PASSWORD=votre_mot_de_passe_proton
```

### Exécuter les tests

```bash
# Smoke tests uniquement (parcours critiques)
npm run test:smoke

# Tous les tests
npx playwright test

# Tests E2E sur Chromium uniquement
npm run test:chromium

# Tests sur mobile
npm run test:mobile

# Interface graphique Playwright (recommandé pour explorer)
npm run test:ui

# Mode headed (navigateur visible)
npm run test:headed

# Ouvrir le dernier rapport HTML
npm run test:report
```

---

## Synthèse de l'approche

### Méthode d'exploration

L'exploration a suivi une approche **session-based testing** : sessions courtes et ciblées sur la landing page `makemycv.com` et sur l'application `app.makemycv.com`, couvrant les 3 méthodes de création de CV (From scratch, Import CV, Import LinkedIn), le tunnel de conversion Premium, la fonctionnalité Headshot Pro, et la gestion des langues non-latines (CJK).

### Constats clés

| Dimension | Observation |
|-----------|-------------|
| **Périmètre** | 14 grandes fonctionnalités identifiées sur 2 domaines (`makemycv.com` + `app.makemycv.com`) |
| **Risques critiques** | Export PDF, tunnel paiement, support caractères non-latins (CJK) — tous 9/9 sur la matrice de risque |
| **Automatisation** | Playwright TypeScript — couverture E2E + API, retenu pour WebKit natif et parallélisme sans surcoût |
| **Bugs identifiés** | 12 anomalies documentées — **3 Critiques**, 6 Majeurs, 3 Mineurs |
| **Faille notable** | Contournement du modèle économique via récupération de l'aperçu JPEG en console (BUG-006) |

### Priorités de test identifiées

Le détail complet avec grille de notation et exemples de calcul est dans [`docs/01-test-strategy.md`](docs/01-test-strategy.md).

1. **Export PDF** — point de conversion central du modèle freemium
2. **Tunnel paiement** — impact direct sur le chiffre d'affaires
3. **Support CJK** — crédibilité internationale du produit
4. **Création de CV** (3 méthodes) — cœur de valeur
5. **Authentification** — porte d'entrée du produit

### Bugs bloquants identifiés (recommandation go/no-go)

- **BUG-006** — Faille modèle économique : l'aperçu JPEG du CV est récupérable en console sans compte Premium et contournable via upscaling IA
- **BUG-009** — Import CV mandarin : caractères restitués corrompus (problème d'encodage UTF-8)
- **BUG-011** — Headshot Pro : tarif de 39,90€ révélé seulement après l'upload des photos
