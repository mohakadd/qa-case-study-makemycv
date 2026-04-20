# Partie 2 — Cas de test détaillés

> **Parcours couverts :**
> 1. Inscription d'un nouvel utilisateur
> 2. Création et édition d'un CV (parcours nominal)
> 3. Export PDF

---

## Parcours 1 — Inscription d'un nouvel utilisateur

---

### TC-001 — Inscription réussie avec des données valides

| Champ | Détail |
|-------|--------|
| **ID** | TC-001 |
| **Titre** | Inscription réussie avec email et mot de passe valides |
| **Préconditions** | L'utilisateur n'est pas connecté. L'email `test_qa_new@example.com` n'existe pas en base. |
| **Étapes** | 1. Accéder à `makemycv.com` <br> 2. Cliquer sur « S'inscrire » / « Créer un compte » <br> 3. Renseigner Email : `test_qa_new@example.com` <br> 4. Renseigner Mot de passe : `Test@1234!` <br> 5. Confirmer le mot de passe : `Test@1234!` <br> 6. Valider le formulaire |
| **Résultat attendu** | L'utilisateur est redirigé vers le dashboard ou l'éditeur. Un email de confirmation peut être envoyé. Aucun message d'erreur. |
| **Résultat obtenu** | ✅ Redirigé vers le sélecteur de templates |
| **Statut** | ✅ Pass |
| **Sévérité** | Critique |

---

### TC-002 — Inscription avec un email déjà utilisé

| Champ | Détail |
|-------|--------|
| **ID** | TC-002 |
| **Titre** | Inscription refusée si l'email est déjà enregistré |
| **Préconditions** | L'email `qa_existing@example.com` existe déjà en base. L'utilisateur n'est pas connecté. |
| **Étapes** | 1. Accéder au formulaire d'inscription <br> 2. Renseigner Email : `qa_existing@example.com` <br> 3. Renseigner Mot de passe valide <br> 4. Valider le formulaire |
| **Résultat attendu** | Un message d'erreur clair est affiché : *"Cette adresse email est déjà utilisée"*. L'utilisateur reste sur le formulaire. |
| **Résultat obtenu** | ✅ Message d'erreur affiché, pas de création de compte doublon |
| **Statut** | ✅ Pass |
| **Sévérité** | Critique |

---

### TC-003 — Inscription avec un mot de passe trop court

| Champ | Détail |
|-------|--------|
| **ID** | TC-003 |
| **Titre** | Validation du mot de passe — rejet si trop court |
| **Préconditions** | L'utilisateur n'est pas connecté. |
| **Étapes** | 1. Accéder au formulaire d'inscription <br> 2. Renseigner un email valide et unique <br> 3. Renseigner Mot de passe : `abc` (3 caractères) <br> 4. Tenter de valider |
| **Résultat attendu** | Le formulaire est bloqué avec un message indiquant les règles de mot de passe (longueur minimale, caractères requis). |
| **Résultat obtenu** | ✅ Message de validation inline affiché avant soumission |
| **Statut** | ✅ Pass |
| **Sévérité** | Majeur |

---

### TC-004 — Inscription avec un email au format invalide

| Champ | Détail |
|-------|--------|
| **ID** | TC-004 |
| **Titre** | Validation de format email — rejet si format incorrect |
| **Préconditions** | L'utilisateur n'est pas connecté. |
| **Étapes** | 1. Accéder au formulaire d'inscription <br> 2. Renseigner Email : `notanemail` <br> 3. Renseigner un mot de passe valide <br> 4. Tenter de valider |
| **Résultat attendu** | Message d'erreur : *"Veuillez entrer une adresse email valide"*. La soumission est bloquée. |
| **Résultat obtenu** | ✅ Validation HTML5 native active, soumission bloquée |
| **Statut** | ✅ Pass |
| **Sévérité** | Majeur |

---

## Parcours 2 — Création et édition de CV

> **Note :** MakeMyCV propose 3 méthodes de création : (1) **From scratch**, (2) **Import CV** (PDF/DOCX), (3) **Import LinkedIn**. Les cas de test ci-dessous couvrent principalement la méthode **Importer mon CV** (TC-006, TC-007, TC-011) ainsi que le parcours nominal from scratch (TC-005) et le responsive (TC-008). L'import LinkedIn constitue un parcours critique à part entière — son profil de risque (dépendance externe) justifie une suite de tests dédiée en priorité P1.

---

### TC-005 — Création d'un CV complet depuis zéro — méthode « From scratch » (happy path)

| Champ | Détail |
|-------|--------|
| **ID** | TC-005 |
| **Titre** | Création d'un CV complet depuis la sélection de template jusqu'à la prévisualisation |
| **Préconditions** | L'utilisateur est connecté. Aucun CV existant (ou création d'un nouveau). |
| **Étapes** | 1. Cliquer sur « Créer un CV » puis « Nouveau CV » et choisir « En partant de zéro » <br> 2. Renseigner les informations d'identité : Prénom `Jean`, Nom de famille `Dupont`, Intitulédu poste `Développeur Full Stack`, Photo, Téléphone `0601020304`, E-mail `jean.dupont@example.com`, Code postal `75000`, Ville `Paris` <br> 3. Vérifier et ajouter une section Expérience : Entreprise `DotWorld`, Poste `QA Senior`, `01/2022 - 12/2023`, Description `Garant de la qualité logicielle et de l'expérience utilisateur.` <br> 4. Ajouter une section Formation : `Master Informatique, Université Paris, 2021` <br> 5. Ajouter 3 Compétences : `JavaScript`, `React`, `Node.js` <br> 6. Vérifier la prévisualisation en temps réel |
| **Résultat attendu** | Chaque modification se reflète instantanément dans le panneau de prévisualisation. Le CV est sauvegardé automatiquement. Aucune perte de donnée entre les sections. |
| **Résultat obtenu** | ✅ Mise à jour temps réel fonctionnelle, auto-save actif |
| **Statut** | ✅ Pass |
| **Sévérité** | Critique |

---

### TC-006 — Ajout d'une section avec tous les champs vides

| Champ | Détail |
|-------|--------|
| **ID** | TC-006 |
| **Titre** | Validation formulaire — ajout d'expérience sans aucun champ renseigné |
| **Préconditions** | L'utilisateur a accédé à l'éditeur via la méthode « Importer mon CV ». Un CV valide a été importé. L'utilisateur est dans la section Expériences. |
| **Étapes** | 1. Cliquer sur « + Ajouter une expérience » <br> 2. Ne renseigner pas tous les champs <br> 3. Cliquer sur « Enregistrer » ou tenter de passer à l'étape suivante |
| **Résultat attendu** | La section n'est pas ajoutée. Un message de validation guide l'utilisateur sur les champs requis. |
| **Résultat obtenu** | ⚠️ La section vide est ajoutée seulement avec `Intitulé du poste` dans le CV sans avertissement — voir BUG-003 |
| **Statut** | ❌ Fail |
| **Sévérité** | Majeur |

---

### TC-007 — Saisie d'une date de fin antérieure à la date de début

| Champ | Détail |
|-------|--------|
| **ID** | TC-007 |
| **Titre** | Validation de cohérence des dates dans une expérience |
| **Préconditions** | L'utilisateur a accédé à l'éditeur via la méthode « Importer mon CV ». L'utilisateur est en train d'ajouter ou de modifier une expérience professionnelle. |
| **Étapes** | 1. Dans le formulaire d'ajout d'expérience <br> 2. Renseigner Date de début : `06/2023` <br> 3. Renseigner Date de fin : `01/2022` (antérieure) <br> 4. Tenter d'enregistrer |
| **Résultat attendu** | Un message d'erreur signale l'incohérence : *"La date de fin doit être postérieure à la date de début"*. La sauvegarde est bloquée. |
| **Résultat obtenu** | ⚠️ Aucune validation côté client — les dates incohérentes sont acceptées et affichées dans le CV — voir BUG-007|
| **Statut** | ❌ Fail |
| **Sévérité** | Mineur |

---

### TC-008 — Comportement responsive de l'éditeur sur mobile (390×844)

| Champ | Détail |
|-------|--------|
| **ID** | TC-008 |
| **Titre** | Accessibilité et utilisabilité de l'éditeur sur smartphone (iPhone 14) |
| **Préconditions** | Navigateur Chrome Mobile, viewport 390×844. L'utilisateur est connecté. |
| **Étapes** | 1. Accéder à `makemycv.com` depuis Chrome avec viewport 390×844 <br> 2. Se connecter <br> 3. Ouvrir un CV existant ou en créer un <br> 4. Tenter de renseigner un champ Expérience <br> 5. Vérifier que le formulaire est scrollable et que le clavier virtuel ne masque pas les champs actifs |
| **Résultat attendu** | L'éditeur est utilisable sur mobile. Les champs sont accessibles. Le clavier virtuel ne masque pas le champ actif. Le layout s'adapte sans overflow horizontal. |
| **Résultat obtenu** | ✅ La navigation mobile est assurée par un menu footer fonctionnel. Les sections sont accessibles, aucun overflow horizontal détecté. L'éditeur est utilisable sur mobile. |
| **Statut** | ✅ Pass |
| **Sévérité** | Majeur |

---

## Parcours 3 — Export PDF

---

### TC-009 — Export PDF d'un CV complet par un utilisateur Premium

| Champ | Détail |
|-------|--------|
| **ID** | TC-009 |
| **Titre** | Téléchargement PDF réussi pour un compte Premium |
| **Préconditions** | L'utilisateur est connecté avec un compte Premium actif. Le CV contient au moins identité + 1 expérience + 1 formation. |
| **Étapes** | 1. Ouvrir un CV complété dans l'éditeur <br> 2. Cliquer sur le bouton « Télécharger » ou « Exporter en PDF » <br> 3. Vérifier que le téléchargement se déclenche <br> 4. Ouvrir le fichier PDF téléchargé <br> 5. Contrôler que le contenu correspond exactement au CV édité (nom, expériences, mise en page) |
| **Résultat attendu** | Un fichier `cv-jean-dupont.pdf` est téléchargé. Le PDF est fidèle à la prévisualisation, lisible, sans troncature de texte ni débordement. Toutes les sections saisies sont présentes. |
| **Résultat obtenu** | ✅ PDF généré et fidèle à la prévisualisation |
| **Statut** | ✅ Pass |
| **Sévérité** | Critique |

---

### TC-010 — Tentative d'export PDF sans compte Premium

| Champ | Détail |
|-------|--------|
| **ID** | TC-010 |
| **Titre** | Le téléchargement PDF est bloqué pour un compte gratuit et redirige vers l'offre Premium |
| **Préconditions** | L'utilisateur est connecté avec un compte **gratuit**. Un CV est créé et complété. |
| **Étapes** | 1. Ouvrir le CV dans l'éditeur <br> 2. Cliquer sur le bouton « Télécharger » <br> 3. Observer le comportement |
| **Résultat attendu** | L'export est bloqué. Une modale ou une page de paywall s'affiche, présentant l'offre Premium (2,90€ / 7 jours). L'utilisateur n'obtient pas le PDF sans payer. |
| **Résultat obtenu** | ✅ Modale Premium affichée, pas de téléchargement possible |
| **Statut** | ✅ Pass |
| **Sévérité** | Critique |

---

---

### TC-011 — Saisie d'un texte très long dans le champ description d'une expérience

> Rattaché au **Parcours 2 — Création et édition de CV** (edge case sur le contenu saisi)

| Champ | Détail |
|-------|--------|
| **ID** | TC-011 |
| **Titre** | Comportement de l'éditeur et du PDF avec une description d'expérience de +2000 caractères |
| **Préconditions** | L'utilisateur a accédé à l'éditeur via la méthode « Importer mon CV ». L'utilisateur est connecté et dans la section Expériences. |
| **Étapes** | 1. Ajouter une expérience et renseigner les champs titre et entreprise <br> 2. Dans le champ Description, coller un texte de 2000+ caractères <br> 3. Observer la prévisualisation en temps réel <br> 4. Exporter le CV en PDF <br> 5. Ouvrir le PDF et vérifier la mise en page |
| **Résultat attendu** | La prévisualisation gère le débordement proprement (extension sur 2 pages ou troncature avec indication). Le PDF exporté ne présente pas de texte coupé, de chevauchement ou de mise en page cassée. |
| **Résultat obtenu** | ⚠️ La prévisualisation étend le CV sur 2 pages sans avertissement. Le PDF exporte les 2 pages mais la coupure de page tombe parfois au milieu d'une ligne de texte. |
| **Statut** | ⚠️ À investiguer |
| **Sévérité** | Mineur |

---

---

### TC-012 — Import d'un CV rédigé en caractères CJK (mandarin)

> Rattaché au **Parcours 2 — Création via Import CV** (cas d'erreur — encodage caractères non-latins) — lié à BUG-009

| Champ | Détail |
|-------|--------|
| **ID** | TC-012 |
| **Titre** | Import d'un CV en mandarin — vérification de la préservation des caractères CJK |
| **Préconditions** | L'utilisateur a accédé à `app.makemycv.com`. Un fichier CV rédigé en mandarin est disponible (PDF ou DOCX). |
| **Étapes** | 1. Choisir la méthode « Importer mon CV » <br> 2. Importer un fichier CV rédigé en mandarin <br> 3. Laisser l'IA traiter le fichier <br> 4. Observer le contenu restitué dans l'éditeur <br> 5. Vérifier que les caractères chinois sont lisibles dans la prévisualisation <br> 6. Exporter le CV en PDF et vérifier les caractères dans le fichier généré |
| **Résultat attendu** | Les caractères mandarin sont préservés et lisibles dans l'éditeur et dans le PDF exporté. Aucun caractère corrompu ou illisible. |
| **Résultat obtenu** | ❌ Le contenu mandarin est restitué en caractères corrompus et illisibles (ex : `Ø§oöå`, `#)+IA -1,8Ã¤`). Le CV généré est inexploitable. |
| **Statut** | ❌ Fail |
| **Sévérité** | Critique |

---

## Récapitulatif

| ID | Titre (résumé) | Statut | Sévérité |
|----|----------------|--------|----------|
| TC-001 | Inscription valide | ✅ Pass | Critique |
| TC-002 | Inscription email existant | ✅ Pass | Critique |
| TC-003 | Mot de passe trop court | ✅ Pass | Majeur |
| TC-004 | Email format invalide | ✅ Pass | Majeur |
| TC-005 | Création CV happy path | ✅ Pass | Critique |
| TC-006 | Ajout expérience sans champs | ❌ Fail | Majeur |
| TC-007 | Dates incohérentes | ❌ Fail | Mineur |
| TC-008 | Responsive éditeur mobile | ✅ Pass | Majeur |
| TC-009 | Export PDF Premium | ✅ Pass | Critique |
| TC-010 | Export PDF compte gratuit | ✅ Pass | Critique |
| TC-011 | Texte très long dans description | ⚠️ À investiguer | Mineur |
| TC-012 | Import CV en mandarin — caractères CJK | ❌ Fail | Critique |
