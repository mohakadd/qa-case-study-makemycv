# Partie 1 — Plan d'action & Stratégie de test

## 1. Cartographie fonctionnelle

Exploration réalisée en mode non-authentifié puis authentifié sur `makemycv.com`.

### Fonctionnalités identifiées

| # | Fonctionnalité | Description |
|---|----------------|-------------|
| F1 | **Inscription / Connexion** | Création de compte (email/password), login, mot de passe oublié |
| F2 | **Sélection de template** | Choix parmi les modèles de CV (design, classique, moderne, créatif) |
| F3 | **Création de CV** | 3 méthodes disponibles : (1) **From scratch** — guidé section par section, (2) **Import CV existant** — parsing + amélioration IA du fichier uploadé (PDF/DOCX), (3) **Import LinkedIn** — récupération automatique du profil |
| F3b | **Éditeur de CV** | Saisie et édition des sections : identité, titre, accroche, expériences, formations, compétences, langues, centres d'intérêt |
| F4 | **Assistant IA** | Génération de suggestions de contenu (titre, accroche, missions) via IA |
| F5 | **Personnalisation du design** | Changement couleur principale, police, mise en page, photo de profil |
| F6 | **Prévisualisation temps réel** | Aperçu du CV mis à jour en temps réel lors de la saisie |
| F7 | **Export PDF** | Téléchargement du CV en PDF (limité sans Premium) |
| F8 | **Gestion de compte** | Mes CVs, tableau de bord, modification des informations personnelles |
| F9 | **Tunnel Premium / Paiement** | Souscription à l'offre 7j à 2,90€ puis 27,95€/4 semaines |
| F10 | **Lettre de motivation** | Génération et édition d'une lettre de motivation associée au CV |
| F11 | **Multilingue / Traduction** | Traduction des intitulés de rubriques en plusieurs langues |
| F12 | **Responsive / Mobile** | Accès et usage depuis mobile et tablette |
| F13 | **Import LinkedIn** | Récupération du profil LinkedIn pour pré-remplir l'éditeur — dépendance externe critique |
| F14 | **Support caractères CJK** | Prise en charge des alphabets non-latins lors de l'import et du traitement IA (Chinois, Japonais, Coréen — et par extension arabe, cyrillique, hébreu) |

---

## 2. Matrice de risques

### Méthode de calcul

Le score est calculé par la formule : **Score = Impact métier (1–3) × Probabilité de régression (1–3)**, soit un score de 1 à 9.

#### Grille Impact métier

| Valeur | Label | Définition |
|:---:|-------|-----------|
| 3 | 🔴 Critique | Bloque l'accès au produit ou à sa valeur principale. Perte de revenus directe si défaillant. |
| 2 | 🟠 Majeur | Dégrade significativement l'expérience. Peut entraîner de l'abandon ou des tickets support. |
| 1 | 🟡 Moyen / Mineur | Gêne sans bloquer. L'utilisateur peut contourner ou la fonctionnalité est secondaire. |

#### Grille Probabilité de régression

| Valeur | Label | Définition |
|:---:|-------|-----------|
| 3 | 🟠 Haute | Fonctionnalité complexe, dépendances externes (API tierce, service serveur), modifiée fréquemment ou récemment. |
| 2 | 🟡 Moyenne | Fonctionnalité stable mais touchée indirectement par des changements. Logique métier non triviale. |
| 1 | 🟢 Faible | Fonctionnalité mature, peu modifiée, sans dépendance critique. Risque de régression historiquement bas. |

#### Exemples de calcul

- **Export PDF** : Impact 3 (bloque la valeur principale) × Probabilité 3 (dépend d'un service de rendu PDF côté serveur, sensible aux mises à jour) = **9/9**
- **Auth** : Impact 3 (sans login, zéro accès) × Probabilité 2 (fonctionnalité mature, rarement modifiée) = **6/9**
- **Assistant IA** : Impact 2 (dégrade l'expérience si absent, mais le CV reste créable) × Probabilité 3 (appel LLM externe, prompt sensible aux changements, résultats non déterministes) = **6/9**
- **Multilingue** : Impact 1 (fonctionnalité optionnelle, minorité d'utilisateurs) × Probabilité 1 (logique simple de traduction statique) = **1/9**
- **Import CV (F3 méthode 2)** : Impact 2 (différenciante mais pas bloquante — l'utilisateur peut partir from scratch) × Probabilité 3 (parsing fichiers tiers Word/PDF — encodages variables, structures imprévisibles) = **6/9**
- **Import LinkedIn (F13)** : Impact 2 (différenciante, très attendue) × Probabilité 3 (dépendance OAuth externe — si LinkedIn change son API ou est indisponible, la fonctionnalité tombe entièrement) = **6/9**
- **Support CJK (F14)** : Impact 3 (un produit qui se dit multilingue et corrompt les caractères non-latins perd sa crédibilité sur tous les marchés asiatiques) × Probabilité 3 (problème d'encodage UTF-8 confirmé lors des tests — BUG-011) = **9/9**

---

### Matrice

Classement par **Impact métier × Probabilité de régression**.

| Fonctionnalité | Impact métier | Probabilité bug | Score risque | Priorité |
|----------------|:---:|:---:|:---:|:---:|
| F7 — Export PDF | 🔴 Critique | 🟠 Haute | **9/9** | P0 |
| F9 — Tunnel paiement | 🔴 Critique | 🟠 Haute | **9/9** | P0 |
| F14 — Support CJK | 🔴 Critique | 🟠 Haute | **9/9** | P0 |
| F1 — Auth (inscription/login) | 🔴 Critique | 🟡 Moyenne | **6/9** | P1 |
| F3 — Création de CV (3 méthodes) | 🔴 Critique | 🟡 Moyenne | **6/9** | P1 |
| F4 — Assistant IA | 🟠 Majeur | 🟠 Haute | **6/9** | P1 |
| F13 — Import LinkedIn | 🟠 Majeur | 🟠 Haute | **6/9** | P1 |
| F2 — Sélection template | 🟠 Majeur | 🟡 Moyenne | **4/9** | P2 |
| F6 — Prévisualisation temps réel | 🟠 Majeur | 🟡 Moyenne | **4/9** | P2 |
| F12 — Responsive | 🟠 Majeur | 🟡 Moyenne | **4/9** | P2 |
| F10 — Lettre de motivation | 🟡 Moyen | 🟡 Moyenne | **4/9** | P2 |
| F8 — Gestion de compte | 🟡 Moyen | 🟢 Faible | **3/9** | P3 |
| F5 — Personnalisation design | 🟡 Moyen | 🟢 Faible | **2/9** | P3 |
| F11 — Multilingue | 🟢 Mineur | 🟢 Faible | **1/9** | P4 |

### Justification des P0

- **Export PDF** : C'est *le* point de conversion central du modèle freemium — l'export est réservé aux comptes Premium. Deux risques distincts à tester : (1) le **tunnel de paiement** qui précède l'export doit être sans friction pour ne pas perdre un utilisateur prêt à payer, (2) la **génération PDF elle-même** doit être fiable une fois l'accès débloqué — un PDF corrompu ou mal rendu après paiement est le pire moment pour une défaillance.
- **Tunnel paiement** : Directement lié au chiffre d'affaires. Une erreur bloquante à cette étape = perte de revenus mesurable et immédiate.

---

## 3. Plan de test priorisé

### Parcours à tester avant déploiement (critères de sortie de sprint)

#### 🔴 MUST TEST — Bloquants go/no-go

| Ordre | Parcours | Justification |
|-------|----------|---------------|
| 1 | Création de CV de bout en bout (happy path) | Valide le cœur de valeur du produit |
| 2 | Export PDF d'un CV complété | Fonctionnalité principale monétisée |
| 3 | Inscription d'un nouvel utilisateur | Porte d'entrée de tout le produit |
| 4 | Connexion / Déconnexion | Accès aux données utilisateur |
| 5 | Souscription Premium (flow paiement) | Revenue-critical |

#### 🟠 SHOULD TEST — Importants mais pas bloquants

| Ordre | Parcours |
|-------|----------|
| 6 | Génération de contenu IA |
| 7 | Changement de template sur CV existant |
| 8 | Création d'une lettre de motivation |
| 9 | Gestion multi-CVs (création, suppression, duplication) |

#### 🟡 NICE TO TEST — Si temps disponible

| Ordre | Parcours |
|-------|----------|
| 10 | Traduction des rubriques (multilingue) |
| 11 | Compatibilité responsive (mobile/tablette) |
| 12 | Mot de passe oublié |

---

## 4. Stratégie d'environnement

### Navigateurs

| Navigateur | Version | Priorité | Justification |
|------------|---------|----------|---------------|
| Chrome | Latest | P0 | ~65% de part de marché desktop mondiale — dominant sur tous les marchés cibles |
| Safari | Latest | P0 | ~19% desktop mondial + **moteur exclusif sur iOS** (WebKit imposé par Apple) — critique pour tout marché anglophone et européen |
| Firefox | Latest | P1 | ~4% global mais jusqu'à ~12% en Allemagne et Europe du Nord — à réévaluer selon les marchés actifs |
| Edge | Latest | P2 | Préinstallé Windows, usage B2B croissant (~5% global) — pertinent pour les recruteurs |
| Chrome Mobile | Latest | P1 | Premier navigateur mobile mondial sur Android |
| Safari Mobile | Latest | P1 | 100% des utilisateurs iPhone/iPad — moteur WebKit avec comportements CSS distincts de Chrome |

### Devices & résolutions

| Type | Résolution | Priorité |
|------|-----------|----------|
| Desktop large | 1920×1080 | P0 |
| Desktop standard | 1366×768 | P0 |
| Laptop | 1280×800 | P1 |
| Tablet (iPad) | 768×1024 | P1 |
| Mobile L (iPhone 14) | 390×844 | P0 |
| Mobile S | 375×667 | P2 |

### Environnements de test

MakeMyCV étant déployé sur **Vercel**, la stratégie d'environnement tire parti des fonctionnalités natives de la plateforme :

| Environnement | URL | Quand | Tests exécutés |
|---------------|-----|-------|----------------|
| **Preview (PR)** | URL unique générée par Vercel à chaque PR | À chaque Pull Request | Suite E2E Chromium — feedback avant merge |
| **Staging** | URL staging dédiée | Avant déploiement prod | Suite complète multi-navigateurs |
| **Production (canary)** | `makemycv.com` | Pendant la fenêtre 20% (3h) | Smoke tests toutes les 30 min |
| **Local** | `localhost` | En développement | Scripts en cours d'écriture |

**Points d'attention spécifiques à Vercel :**

- **Preview Deployments** : chaque PR génère automatiquement un environnement isolé avec sa propre URL. Vercel expose l'URL de chaque preview via une variable d'environnement dans la pipeline GitHub Actions (`VERCEL_PREVIEW_URL`) — ce qui permet de cibler automatiquement le bon environnement et de tester chaque feature branch avant même qu'elle touche le staging.
- **Cold start des Serverless Functions** : si les APIs tournent en fonctions serverless, la première requête après inactivité peut prendre 300ms à 1s de plus. Les timeouts des tests Playwright sont configurés en conséquence pour éviter des faux échecs.
- **Rollback instantané** : en cas d'échec des smoke tests post-canary, Vercel permet un rollback en un clic vers le déploiement précédent. Le rollback corrige le code immédiatement, mais ne rollback pas la base de données — les utilisateurs qui ont interagi pendant la fenêtre canary ont déjà des données écrites. Détecter un problème le plus tôt possible dans les 3h limite le nombre d'utilisateurs impactés et évite des états de données difficiles à corriger.

### Données de test

- Compte de test dédié `qa_smoke@makemycv.com` avec abonnement Premium actif (pour tester l'export PDF sans friction)
- Jeu de données fixtures : CV complet FR/EN, CV vide, CV avec photo, CV sans photo
- Cartes de test Stripe pour le tunnel paiement

### Hors scope

- **Tests de charge / performance** : simuler des centaines d'utilisateurs simultanés nécessite un environnement isolé dédié, séparé de la production et du staging partagé
- **Tests de sécurité approfondis** : tests de type injection, contrôle d'accès entre comptes, exposition de données sensibles — nécessitent des outils spécialisés et un périmètre d'intervention défini avec l'équipe
- **Tests d'accessibilité complets** : vérification de l'utilisabilité pour les personnes en situation de handicap (navigation clavier, lecteurs d'écran, contrastes) — chantier à planifier en Phase 2
