# 🧪 Guide de Tests Manuels - Éditeur d'Arbre Narratif

Ce guide décrit les tests manuels à effectuer pour valider l'éditeur d'arbre narratif.

## 🚀 Avant de Commencer

1. Ouvrez `challenge-editor.html` dans votre navigateur
2. Ouvrez la console développeur (F12) pour voir d'éventuelles erreurs
3. Gardez ce fichier à côté pour cocher les tests au fur et à mesure

---

## ✅ Checklist des Tests

### 📦 Section 1: Création de Nœuds

#### Test 1.1: Création d'un premier nœud
- [ ] Cliquez sur "➕ Nouveau Challenge"
- [ ] Vérifiez qu'un nœud apparaît sur le canvas à la position (50, 50)
- [ ] Vérifiez que le nœud a une icône ⚔️
- [ ] Vérifiez que le nœud est en vert (nœud de départ)
- [ ] Vérifiez que la sidebar affiche les détails du nœud

**Résultat attendu:** ✓ Nœud créé à (50, 50), bordure verte, sidebar affichée

---

#### Test 1.2: Création de plusieurs nœuds
- [ ] Cliquez sur "➕ Nouveau Challenge" 5 fois
- [ ] Vérifiez que les nœuds sont disposés en grille 3 colonnes
- [ ] Vérifiez les positions attendues:
  - Nœud 1: (50, 50)
  - Nœud 2: (300, 50)
  - Nœud 3: (550, 50)
  - Nœud 4: (50, 250)
  - Nœud 5: (300, 250)
  - Nœud 6: (550, 250)

**Résultat attendu:** ✓ Les nœuds sont bien espacés et ne se chevauchent PAS

**BUG à vérifier:** Les nœuds ne doivent JAMAIS se superposer ou être collés

---

#### Test 1.3: Vérification après déplacement du canvas
- [ ] Créez 2 nœuds
- [ ] Déplacez le canvas (cliquez-glissez sur le fond)
- [ ] Créez un 3ème nœud
- [ ] Vérifiez que le 3ème nœud est à la position (550, 50) et non pas collé aux autres

**Résultat attendu:** ✓ Position indépendante du déplacement du canvas

---

### 🎨 Section 2: Édition de Nœuds

#### Test 2.1: Modification des propriétés
- [ ] Cliquez sur un nœud pour le sélectionner
- [ ] Dans la sidebar, changez le nom en "Le Gobelin"
- [ ] Changez le type en "Boss"
- [ ] Changez l'icône en 👺
- [ ] Changez la couleur en rouge (#ff0000)
- [ ] Ajoutez un dialogue: "Un gobelin féroce vous attaque !"
- [ ] Cliquez sur "💾 Sauvegarder les modifications"
- [ ] Vérifiez que le nœud est mis à jour sur le canvas

**Résultat attendu:** ✓ Toutes les modifications sont visibles sur le nœud

---

#### Test 2.2: Modification des outcomes
- [ ] Sélectionnez un nœud
- [ ] Modifiez le texte de "Réussite Triomphale": "Vous terrassez le gobelin avec brio !"
- [ ] Changez le coût à 3
- [ ] Faites de même pour les 3 autres outcomes
- [ ] Sauvegardez
- [ ] Vérifiez que les badges de coût sont mis à jour

**Résultat attendu:** ✓ Les textes et coûts sont sauvegardés

---

#### Test 2.3: Nœud de départ
- [ ] Créez 3 nœuds
- [ ] Vérifiez que seul le premier a une bordure verte
- [ ] Sélectionnez le 2ème nœud
- [ ] Cochez "Nœud de départ"
- [ ] Sauvegardez
- [ ] Vérifiez que le 1er nœud n'est plus vert et le 2ème est devenu vert

**Résultat attendu:** ✓ Un seul nœud de départ à la fois

---

### 🎯 Section 3: Déplacement de Nœuds

#### Test 3.1: Drag & Drop basique
- [ ] Créez un nœud
- [ ] Cliquez et maintenez sur le nœud
- [ ] Déplacez la souris
- [ ] Relâchez
- [ ] Vérifiez que le nœud a bougé

**Résultat attendu:** ✓ Nœud déplacé en douceur

---

#### Test 3.2: Déplacement de plusieurs nœuds
- [ ] Créez 5 nœuds
- [ ] Déplacez-les pour créer une disposition en cascade
- [ ] Vérifiez qu'aucun nœud ne se superpose

**Résultat attendu:** ✓ Organisation personnalisée possible

---

### 🔗 Section 4: Connexions

#### Test 4.1: Création d'une connexion simple
- [ ] Créez 2 nœuds (A et B)
- [ ] Survolez le nœud A
- [ ] Cliquez sur le point doré à droite de "Réussite Triomphale"
- [ ] Une ligne en pointillés apparaît
- [ ] Cliquez sur un point doré du nœud B
- [ ] Vérifiez qu'une connexion courbe dorée est créée avec une flèche

**Résultat attendu:** ✓ Connexion visuelle créée entre A et B

---

#### Test 4.2: Connexions multiples
- [ ] Créez 3 nœuds (A, B, C)
- [ ] Connectez A → B (success_triumph)
- [ ] Connectez A → C (success_narrow)
- [ ] Connectez B → C (fail_narrow)
- [ ] Vérifiez que les 3 connexions sont visibles
- [ ] Vérifiez que le compteur affiche "Connexions: 3"

**Résultat attendu:** ✓ Plusieurs connexions depuis un même nœud

---

#### Test 4.3: Annulation de connexion
- [ ] Commencez à créer une connexion (cliquez sur un point)
- [ ] Cliquez dans le vide (pas sur un autre point)
- [ ] Vérifiez que la ligne en pointillés disparaît

**Résultat attendu:** ✓ Connexion annulée

---

### 🗑️ Section 5: Suppression

#### Test 5.1: Suppression d'un nœud
- [ ] Créez 3 nœuds
- [ ] Sélectionnez le 2ème
- [ ] Cliquez sur "🗑️ Supprimer ce nœud" dans la sidebar
- [ ] Confirmez la suppression
- [ ] Vérifiez que le nœud disparaît du canvas

**Résultat attendu:** ✓ Nœud supprimé

---

#### Test 5.2: Suppression avec connexions
- [ ] Créez 3 nœuds (A, B, C)
- [ ] Connectez A → B
- [ ] Connectez B → C
- [ ] Supprimez le nœud B
- [ ] Vérifiez que les connexions A → B et B → C disparaissent aussi

**Résultat attendu:** ✓ Connexions supprimées avec le nœud

---

#### Test 5.3: Effacement complet
- [ ] Créez plusieurs nœuds et connexions
- [ ] Cliquez sur "🔥 Tout Effacer"
- [ ] Confirmez
- [ ] Vérifiez que le canvas est vide
- [ ] Vérifiez que les compteurs sont à 0

**Résultat attendu:** ✓ Canvas complètement effacé

---

### 💾 Section 6: Export / Import

#### Test 6.1: Export JSON
- [ ] Créez 3 nœuds avec des propriétés personnalisées
- [ ] Créez 2 connexions
- [ ] Cliquez sur "💾 Exporter JSON"
- [ ] Vérifiez qu'un fichier `narrative-tree.json` est téléchargé
- [ ] Ouvrez le fichier dans un éditeur de texte
- [ ] Vérifiez la structure:
  ```json
  {
    "nodes": [...],
    "connections": [...]
  }
  ```

**Résultat attendu:** ✓ Fichier JSON valide téléchargé

---

#### Test 6.2: Import JSON
- [ ] Effacez tout le canvas
- [ ] Cliquez sur "📥 Importer JSON"
- [ ] Sélectionnez le fichier exporté précédemment
- [ ] Vérifiez que tous les nœuds réapparaissent
- [ ] Vérifiez que toutes les connexions sont restaurées
- [ ] Vérifiez que les propriétés sont identiques

**Résultat attendu:** ✓ Import parfait, identique à avant l'export

---

#### Test 6.3: Import de données de démo
- [ ] Allez sur `challenge-editor-test.html`
- [ ] Cliquez sur "🎨 Créer Données de Démo"
- [ ] Un fichier `demo-narrative-tree.json` est téléchargé
- [ ] Retournez sur `challenge-editor.html`
- [ ] Importez ce fichier
- [ ] Vérifiez que 3 nœuds apparaissent (Gobelin, Pont, Dragon)

**Résultat attendu:** ✓ Démo importée correctement

---

### 🎮 Section 7: Navigation Canvas

#### Test 7.1: Déplacement du canvas
- [ ] Créez quelques nœuds
- [ ] Cliquez et glissez sur le fond (pas sur un nœud)
- [ ] Vérifiez que tout le canvas se déplace
- [ ] Vérifiez que les nœuds et connexions se déplacent ensemble

**Résultat attendu:** ✓ Navigation fluide du canvas

---

#### Test 7.2: Déselection
- [ ] Sélectionnez un nœud (sidebar affichée)
- [ ] Cliquez sur le fond
- [ ] Vérifiez que la sidebar revient à "Aucune sélection"
- [ ] Vérifiez que le nœud n'est plus surligné en or

**Résultat attendu:** ✓ Déselection fonctionne

---

### 🔍 Section 8: Interface Utilisateur

#### Test 8.1: Compteurs
- [ ] Vérifiez que le compteur "Nœuds" s'incrémente à chaque création
- [ ] Vérifiez que le compteur "Connexions" s'incrémente à chaque liaison
- [ ] Supprimez un élément
- [ ] Vérifiez que les compteurs se décrémentent

**Résultat attendu:** ✓ Compteurs précis en temps réel

---

#### Test 8.2: Sélection visuelle
- [ ] Créez plusieurs nœuds
- [ ] Cliquez sur différents nœuds
- [ ] Vérifiez qu'un seul nœud à la fois a une bordure dorée (sélectionné)

**Résultat attendu:** ✓ Feedback visuel clair

---

#### Test 8.3: Points de connexion
- [ ] Survolez un nœud
- [ ] Survolez les points dorés sur le côté droit
- [ ] Vérifiez qu'ils s'agrandissent au survol (effet visuel)

**Résultat attendu:** ✓ Points interactifs

---

### 🐛 Section 9: Tests de Régression (Bugs Connus)

#### Test 9.1: Bug des nœuds collés (CORRIGÉ)
- [ ] Créez 10 nœuds sans rien toucher d'autre
- [ ] Vérifiez visuellement qu'AUCUN nœud n'est superposé
- [ ] Vérifiez qu'ils sont en grille 3 colonnes
- [ ] Positions attendues:
  - Ligne 1: (50,50), (300,50), (550,50)
  - Ligne 2: (50,250), (300,250), (550,250)
  - Ligne 3: (50,450), (300,450), (550,450)
  - Ligne 4: (50,650)

**Résultat attendu:** ✓ BUG CORRIGÉ - Espacement parfait

---

#### Test 9.2: Bug de l'offset canvas (CORRIGÉ)
- [ ] Créez 2 nœuds
- [ ] Déplacez le canvas de 500px vers la droite
- [ ] Créez un 3ème nœud
- [ ] Vérifiez que le nœud est à (550, 50) et non ailleurs

**Résultat attendu:** ✓ BUG CORRIGÉ - Position fixe indépendante du déplacement

---

### 💪 Section 10: Tests de Performance

#### Test 10.1: Beaucoup de nœuds
- [ ] Créez rapidement 30 nœuds (spam sur le bouton)
- [ ] Vérifiez que l'interface reste fluide
- [ ] Déplacez le canvas
- [ ] Vérifiez qu'il n'y a pas de lag

**Résultat attendu:** ✓ Performance acceptable avec 30+ nœuds

---

#### Test 10.2: Beaucoup de connexions
- [ ] Créez 10 nœuds
- [ ] Créez 20 connexions entre eux
- [ ] Vérifiez que toutes les courbes sont visibles
- [ ] Déplacez un nœud
- [ ] Vérifiez que les connexions suivent en temps réel

**Résultat attendu:** ✓ Rendu fluide des connexions

---

### 🎨 Section 11: Scénarios Réels

#### Scénario 11.1: Créer une aventure simple
**Objectif:** Créer un arbre à 3 niveaux

- [ ] Créez le nœud de départ "Entrée du Donjon" (interaction)
- [ ] Créez "Couloir des Pièges" (challenge)
- [ ] Créez "Salle du Trésor" (interaction)
- [ ] Créez "Boss Final" (boss)
- [ ] Connectez: Entrée (success) → Couloir
- [ ] Connectez: Couloir (success) → Salle du Trésor
- [ ] Connectez: Couloir (fail) → Boss Final
- [ ] Personnalisez tous les textes d'outcomes
- [ ] Exportez en JSON

**Résultat attendu:** ✓ Arbre narratif cohérent et exportable

---

#### Scénario 11.2: Arbre avec branches multiples
**Objectif:** Tester la complexité

- [ ] Créez un nœud racine
- [ ] Créez 4 branches (success_triumph, success_narrow, fail_narrow, fail_catastrophic)
- [ ] Pour chaque branche, créez 2 nœuds supplémentaires
- [ ] Organisez visuellement l'arbre
- [ ] Vérifiez que toutes les connexions sont claires

**Résultat attendu:** ✓ Arbre complexe gérable visuellement

---

## 📊 Résumé des Tests

Comptez vos résultats :

- Total de tests : **____ / 47**
- Tests réussis : **____**
- Tests échoués : **____**
- Bugs trouvés : **____**

---

## 🐛 Rapport de Bugs

Si vous trouvez des bugs, notez-les ici :

### Bug 1
- **Description :**
- **Étapes pour reproduire :**
- **Résultat attendu :**
- **Résultat obtenu :**

### Bug 2
- **Description :**
- **Étapes pour reproduire :**
- **Résultat attendu :**
- **Résultat obtenu :**

---

## ✅ Validation Finale

- [ ] Tous les tests critiques passent
- [ ] Les bugs connus sont corrigés
- [ ] L'interface est fluide
- [ ] Export/Import fonctionne
- [ ] Prêt pour la production

**Testé par :** ________________

**Date :** ________________

**Signature :** ________________
