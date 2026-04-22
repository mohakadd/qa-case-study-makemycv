# Partie 5 — Recommandations & Vision QA

## 1. Recommandations UX issues de l'exploration

Les recommandations ci-dessous s'appuient sur les bugs documentés dans [`03-bug-reports.md`](03-bug-reports.md) et sur les observations d'exploration.

---

### UX-01 — Protéger l'aperçu du CV pour les utilisateurs non Premium

**Observation :** L'aperçu JPEG du CV est servi en clair aux utilisateurs gratuits. Il est récupérable via la console navigateur, puis upscalable avec un outil IA gratuit et convertible en PDF, permettant d'obtenir un CV exploitable sans jamais payer (voir BUG-006).

**Recommandation :** Appliquer un **watermark rendu côté serveur** sur l'aperçu, pas côté client où il serait supprimable. Le watermark doit être intégré à l'image elle-même (texte semi-transparent en diagonale, par exemple *"MakeMyCV.com"*), non retirable après upscaling.

**Impact attendu :** Protection directe du modèle économique. Toute personne avec des notions techniques de base peut actuellement contourner le paywall, la correction ferme cette faille sans dégrader l'expérience des utilisateurs légitimes.

---

### UX-02 — Prioriser le support des caractères non-latins (CJK) sur le pipeline d'import

**Observation :** L'import d'un CV en mandarin produit un contenu corrompu et illisible (voir BUG-009). Le site se positionne comme multilingue mais ne publie pas de liste des langues supportées. Les autres alphabets non-latins (arabe, japonais, coréen, cyrillique, hébreu) sont potentiellement affectés par le même problème d'encodage.

**Recommandation :**
1. **Court terme :** publier une liste claire des langues supportées par l'import sur la landing page, pour fixer les attentes utilisateur.
2. **Moyen terme :** corriger le pipeline de parsing (symptôme classique d'une conversion UTF-8 / Latin-1 incorrecte) et étendre les tests d'import à un panel multilingue (chinois, japonais, arabe, russe, hébreu).
3. **Long terme :** intégrer la validation d'encodage dans la CI, chaque déploiement doit vérifier qu'un CV mandarin de référence est correctement importé.

**Impact attendu :** Crédibilité restaurée sur les marchés non-latins. Une entreprise qui se positionne à l'international et corrompt les CVs non-latins perd sa légitimité sur tous ces marchés simultanément.

---

### UX-03 — Clarifier le tarif et la logique de sortie de Headshot Pro

**Observation :** La fonctionnalité Headshot Pro présente deux problèmes cumulés : le tarif (39,90€ pour 30 portraits, supérieur à l'abonnement Premium CV à 27,95€/4 semaines) n'est révélé qu'après l'upload des photos (BUG-011), et aucun bouton de sortie n'est disponible une fois entré dans le tunnel (BUG-012).

**Recommandation :**
- Afficher le prix et le badge « Premium » **dès le bouton d'entrée** dans la fonctionnalité
- Ajouter un bouton « Annuler » ou « Retour » clairement visible dans toutes les étapes du tunnel
- Évaluer si l'intégration de Headshot dans l'offre Premium existante, ou à un tarif additionnel plus accessible, améliorerait le taux de conversion

**Note :** La révision du pricing dépasse le périmètre strict du QA et relève d'une décision produit. Elle est mentionnée ici car directement liée aux bugs observés lors des tests.

**Impact attendu :** Réduction des plaintes et demandes de remboursement, amélioration de la confiance utilisateur, déblocage de la conversion sur une fonctionnalité actuellement perçue comme un piège.

---

### UX-04 — Ajouter un sélecteur de langue dans l'interface

**Observation :** Aucun sélecteur de langue n'est accessible dans l'UI (voir BUG-004). Le seul moyen de changer la langue est de modifier manuellement le segment de langue dans l'URL, une manipulation inaccessible à l'utilisateur standard.

**Recommandation :** Ajouter un sélecteur de langue visible dans le header de `app.makemycv.com` ainsi que dans les paramètres du compte. Mémoriser le choix côté utilisateur pour les sessions suivantes.

**Impact attendu :** Fonctionnalité attendue par défaut sur un produit international.

---

### UX-05 — Rendre l'auto-save visible dans l'éditeur

**Observation :** L'éditeur sauvegarde automatiquement les modifications, mais aucun indicateur visuel ne le confirme à l'utilisateur. Cette absence de feedback génère de l'anxiété, particulièrement sur des sessions longues.

**Recommandation :** Ajouter un indicateur d'état discret dans la barre d'en-tête de l'éditeur :
- *« Sauvegarde en cours… »* (pendant l'appel API)
- *« Sauvegardé il y a X secondes »* (confirmation post-save)
- *« Erreur de sauvegarde — réessayez »* (en cas de problème réseau)

**Impact attendu :** Réduction de l'anxiété utilisateur et du taux d'abandon en cours d'édition.

---

### UX-06 — Revoir l'authentification : magic link exclusif problématique

**Observation :** La connexion par « Email + mot de passe » classique n'est pas disponible. L'utilisateur est contraint de passer par un magic link envoyé par email.

**Risques identifiés :**
- **Expérience utilisateur :** rupture du parcours, surtout sur mobile. Si l'email tombe dans les spams, l'utilisateur est bloqué. Le taux de friction à la reconnexion est élevé.
- **QA / Automatisation :** les tests E2E dépendent d'un service de messagerie externe, ce qui augmente la latence et le risque d'instabilité, comme observé lors de l'automatisation via ProtonMail, bloquée par les protections anti-bot du fournisseur.

**Recommandation :**
1. **UX :** proposer l'authentification via adresse mail + mot de passe.
2. **QA :** mettre en place un endpoint d'authentification dédié aux environnements de test (accessible uniquement en staging, protégé par un secret CI) pour bypasser le magic link lors des runs E2E automatisés.

**Impact attendu :** Meilleure rétention sur les reconnexions et stabilité des tests automatisés sans dépendre d'un service de messagerie externe.

---

### UX-07 — Encadrer l'utilisation de l'IA pour les utilisateurs non authentifiés

**Observation :** Il est possible d'uploader un CV et de déclencher le traitement IA sans créer de compte. Cette approche est efficace pour la conversion, l'utilisateur expérimente la valeur avant de s'inscrire.

**Risque identifié :** Si le traitement IA s'appuie sur un modèle externe (OpenAI, Anthropic…), chaque import consomme des tokens facturés. Sans authentification, il n'y a pas de rate limiting par utilisateur, un script automatisé peut déclencher des milliers d'appels LLM avec un impact direct sur la facture API.

**Recommandation :** Mettre en place un rate limiting par IP pour les utilisateurs non authentifiés (ex : 2-3 imports gratuits par IP avant de demander une inscription). Vérifier également que les fichiers uploadés sans compte sont supprimés après un délai défini (ex : 24h).

**Impact attendu :** Maîtrise des coûts API et réduction de la surface d'attaque sur l'endpoint d'import, sans dégrader l'expérience.

---

## 2. Vision QA — Stratégie à 3 mois

### Mois 1 — Fondations (semaines 1–4)

**Objectif : Établir les bases et stopper l'hémorragie de bugs non détectés.**

- Documenter les **cas de test manuels**
- Définir la **Definition of Done QA** avec les PMs : aucune feature ne passe en prod sans cas de test validés et aucun bug Critique ou Majeur ouvert
- Mettre en place le **référentiel de bugs** avec les niveaux de sévérité, les SLAs de correction et les templates de rapport
- Installer Playwright et créer le **socle de tests E2E** sur les parcours P0 de MakeMyCV (création CV, exports, paiement, auth)
- Intégrer la suite de smoke tests dans la **pipeline CI/CD** (GitHub Actions) calée sur la fenêtre canary de 9h
- Premier **audit de régression manuel**

### Mois 2 — Extension (semaines 5–8)

**Objectif : Couvrir l'ensemble des produits et étendre l'automatisation.**

- Étendre la couverture E2E aux **autres produits SaaS** de Dotworld (priorisation par criticité revenue)
- Mettre en place les **tests d'API** (Playwright request context) pour les endpoints critiques
- Créer le **dashboard de qualité** visible par toute l'équipe : taux de couverture, bugs ouverts par priorité
- Mettre en place les **tests de régression visuelle** (comparaison de captures d'écran) pour détecter les régressions CSS/layout
- Former les **équipes de développement** aux bonnes pratiques QA

### Mois 3 — Optimisation (semaines 9–12)

**Objectif : Rendre la qualité systémique et mesurable.**

- Mettre en place les **tests de performance de base**
- Définir et implémenter les **tests de sécurité basiques**
- Mettre en place les **tests contractuels** entre front et back pour sécuriser les évolutions d'API
- Bilan du trimestre et **roadmap QA S2**

---

## 3. Métriques de qualité à mettre en place

### Métriques de couverture

| Métrique | Définition | Cible 3 mois |
|---------|-----------|-------------|
| **Taux de couverture E2E** | % des parcours critiques (P0+P1) couverts par des tests automatisés | 80% |
| **Taux de couverture API** | % des endpoints documentés avec un test automatisé | 60% |
| **Taux de couverture manuelle** | % des features avec des cas de test documentés | 100% |

### Métriques de stabilité

| Métrique | Définition | Cible |
|---------|-----------|-------|
| **Taux de régression** | % de bugs de régression / total bugs par sprint | < 15% |
| **Flakiness rate** | % de tests automatisés instables | < 5% |
| **Taux de passage CI** | % de pipelines CI qui passent au premier run | > 90% |

### Métriques de réactivité

| Métrique | Définition | Cible |
|---------|-----------|-------|
| **MTTR** (Mean Time To Resolve) | Délai moyen de correction par sévérité | Critique : < 4h / Majeur : < 24h / Mineur : < 1 sprint |
| **Taux d'échappement** | % de bugs découverts en prod vs en QA | < 10% |
| **Lead time QA** | Délai moyen entre la fin du dev et la validation QA | < 1 jour ouvré |

### Métriques de processus

| Métrique | Définition |
|---------|-----------|
| **Bugs par feature** | Nombre de bugs ouverts / feature livrée, indicateur de qualité du développement |
| **Reopened bugs rate** | % de bugs rouverts après correction, indicateur de qualité des fixes |
| **Test debt** | Nombre de features sans couverture de test documentée |

### Outils de suivi suggérés

- **Jira** : suivi des bugs avec labels de sévérité et cycle de vie
- **Playwright HTML Reporter** en artefact GitHub Actions : résultats de chaque run CI
- **Confluence** : documentation des cas de test et de la stratégie QA
- **Grafana/Pormetheus ou Datadog** : dashboards de qualité en temps réel couplés au monitoring production
