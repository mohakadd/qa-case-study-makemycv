# QA Case Study — MakeMyCV.com

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
│   ├── 01-test-strategy.md      # Cartographie fonctionnelle, matrice de risques, plan de test
│   ├── 02-test-cases.md         # Cas de test détaillés (10 cas manuels)
│   ├── 03-bug-reports.md        # Bugs identifiés durant l'exploration
│   ├── 04-automation.md         # Stratégie d'automatisation, architecture, CI/CD
│   └── 05-recommendations.md    # Recommandations UX, vision QA 3 mois, métriques
├── tests/
│   └── e2e/
│       ├── cv-creation.spec.ts  # Scénario E2E critique : création de CV complet
│       └── auth.spec.ts         # Tests d'authentification (inscription / connexion)
├── package.json
└── .github/
    └── workflows/
        └── tests.yml            # Pipeline GitHub Actions
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
npx playwright test tests/e2e/cv-creation.spec.ts

# Rapport HTML
npx playwright show-report
```

### Variables d'environnement

Créer un fichier `.env` à la racine :

```env
BASE_URL=https://makemycv.com
TEST_EMAIL=qa_test@example.com
TEST_PASSWORD=TestPassword123!
```

---

## Synthèse de l'approche

### Méthode d'exploration

L'exploration du produit a suivi une approche **session-based testing** : 3 sessions de 30 minutes chacune ciblant respectivement (1) le parcours de création de CV, (2) les fonctionnalités IA et la personnalisation, (3) le tunnel de conversion Premium et la gestion de compte.

### Constats clés

| Dimension | Observation |
|-----------|-------------|
| **Périmètre** | Application mature avec ~10 fonctionnalités majeures identifiées |
| **Risque principal** | Le tunnel de paiement et l'export PDF sont les points de conversion critiques |
| **Automatisation** | Playwright (TypeScript) retenu — cohérent avec la stack Next.js/TS de Dotworld |
| **Bugs identifiés** | 6 anomalies documentées (1 Critique, 2 Majeurs, 2 Mineurs, 1 Cosmétique) |

### Priorités de test identifiées

1. Création & édition de CV (parcours nominal + edge cases)
2. Export PDF (fonctionnalité monétisée clé)
3. Authentification & gestion de compte
4. Tunnel Premium / paiement
5. Générateur IA de contenu
6. Responsive / compatibilité navigateurs

> Pour le détail complet, voir [`docs/01-test-strategy.md`](docs/01-test-strategy.md)
