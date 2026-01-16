# 🧪 Guide des Tests - Last Dunes

## Introduction

Ce guide documente la suite de tests complète pour Last Dunes. Les tests couvrent toute la chaîne de développement : de la création d'arbre narratif jusqu'au chargement dans le jeu.

---

## 📋 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Tests Bash (Automatisés)](#tests-bash-automatisés)
3. [Tests HTML (Navigateur)](#tests-html-navigateur)
4. [Résultats Attendus](#résultats-attendus)
5. [Dépannage](#dépannage)

---

## 1. Vue d'Ensemble

### Fichiers de Test

| Fichier | Type | Description |
|---------|------|-------------|
| `run-tests.sh` | Bash | Tests automatisés (JSON, fichiers, structure) |
| `test-suite.html` | HTML | Suite de tests interactive dans le navigateur |

### Couverture des Tests

La suite de tests valide :
- ✅ **Challenge Editor** : Création de nœuds, outcomes, health changes, reward cards
- ✅ **Niveau Editor** : Import arbre narratif, placement challenges, export level-complete.json
- ✅ **Intégration JSON** : Validation fichiers, correspondance IDs, structure
- ✅ **Main.js** : Chargement prioritaire, enrichissement, fallbacks

---

## 2. Tests Bash (Automatisés)

### Exécution

```bash
# Depuis la racine du projet
bash run-tests.sh

# Ou si exécutable
chmod +x run-tests.sh
./run-tests.sh
```

### Tests Effectués (21 tests)

#### Tests des Fichiers JSON (10 tests)

1. ✅ Fichier `level-complete.json` existe
2. ✅ Validation JSON de `level-complete.json`
3. ✅ Propriétés obligatoires présentes (`mapFile`, `gridSize`, `startPos`, `challenges`, `narrativeTree`)
4. ✅ `narrativeTree` contient des nœuds
5. ✅ `challenges` présents
6. ✅ Correspondance IDs challenges ↔ nœuds
7. ✅ Fichier `challenges.json` existe (fallback)
8. ✅ Validation JSON de `challenges.json`
9. ✅ Fichier `level1.json` existe
10. ✅ Mécaniques présentes (`catastropheMax`, `healthMax`, `cards`)

#### Tests de Structure (5 tests)

11. ✅ Tous les challenges ont 4 outcomes
12. ✅ Toutes les coordonnées sont valides
13. ✅ Tous les `triggerRadius` sont valides (≥ 1)
14. ✅ Tous les nœuds ont un nom
15. ✅ Tous les nœuds ont une icône

#### Tests des Fichiers HTML (6 tests)

16. ✅ Fichier `index.html` existe
17. ✅ Fichier `challenge-editor.html` existe
18. ✅ Fichier `niveau-editor.html` existe
19. ✅ Fichier `js/main.js` existe
20. ✅ `main.js` contient `enrichChallengesWithNarrative`
21. ✅ `main.js` charge `level-complete.json`

### Sortie Exemple

```
=========================================
🧪 SUITE DE TESTS - LAST DUNES
=========================================

=== TESTS DES FICHIERS JSON ===

[TEST] Fichier level-complete.json existe...
[✓] level-complete.json trouvé
[TEST] Validation JSON de level-complete.json...
[✓] JSON valide
...

=========================================
📊 RÉSUMÉ DES TESTS
=========================================
Total:    21
Réussis:  21
Échoués:  0
=========================================
🎉 TOUS LES TESTS ONT RÉUSSI !
```

---

## 3. Tests HTML (Navigateur)

### Exécution

1. **Lancez un serveur web local** :
   ```bash
   python3 -m http.server 8000
   ```

2. **Ouvrez dans votre navigateur** :
   ```
   http://localhost:8000/test-suite.html
   ```

3. **Cliquez sur** "▶️ Exécuter Tous les Tests"

### Interface

L'interface de test affiche :
- **Résumé** : Total, Réussis, Échoués
- **Logs d'Exécution** : Historique détaillé
- **4 Sections de Tests** :
  - 🌳 Challenge Editor
  - 🗺️ Niveau Editor
  - 🔗 Intégration JSON
  - ⚙️ Main.js

### Tests Effectués

#### 🌳 Tests Challenge Editor (6 tests)

1. **Création d'un nœud** : Valide la structure d'un nœud avec tous les champs
2. **Validation des health changes** : Vérifie limites (-10 à +10)
3. **Création d'une carte récompense** : Valide structure complète
4. **Export JSON narrative tree** : Teste l'export et la validation
5. **Connexions entre nœuds** : Valide format des connexions
6. **Validation outcomes** : Vérifie les 4 outcomes obligatoires

#### 🗺️ Tests Niveau Editor (5 tests)

1. **Import d'arbre narratif** : Vérifie format et nœuds
2. **Placement de challenge sur carte** : Valide coordonnées et triggerRadius
3. **Configuration de la grille** : Teste mapFile, gridSize, startPos
4. **Ajout de terrain** : Valide murs, eau, objets
5. **Export level-complete.json** : Teste structure complète

#### 🔗 Tests d'Intégration JSON (6 tests)

1. **Vérification fichier level-complete.json** : Fetch et chargement
2. **Validation structure level-complete.json** : Propriétés requises
3. **Validation narrativeTree** : Présence et format
4. **Correspondance IDs challenges ↔ nœuds** : Validation croisée
5. **Validation challenges.json (fallback)** : Fichier de secours
6. **Validation level1.json (mécaniques)** : Cards et mécaniques

#### ⚙️ Tests Main.js (6 tests)

1. **Fonction enrichChallengesWithNarrative existe** : Définition
2. **Enrichissement avec arbre narratif** : Fusion données
3. **Chargement avec priorité level-complete.json** : Priorité 1
4. **Fallback sur challenges.json** : Priorité 2
5. **Validation enrichissement sans arbre narratif** : Retour brut
6. **Chargement mécaniques depuis level1.json** : Cartes valides

### Boutons de Contrôle

- **▶️ Exécuter Tous les Tests** : Lance tous les tests
- **🌳 Tests Challenge Editor** : Lance seulement les tests de challenge-editor
- **🗺️ Tests Niveau Editor** : Lance seulement les tests de niveau-editor
- **🔗 Tests Intégration** : Lance seulement les tests d'intégration
- **⚙️ Tests Main.js** : Lance seulement les tests de main.js

---

## 4. Résultats Attendus

### État Nominal (Tous les Tests Passent)

```
✅ 21/21 tests passent (bash)
✅ 23/23 tests passent (HTML)
```

### Interprétation des Résultats

#### Tests Réussis ✅
```
[✓] Test réussi
```
→ Le composant fonctionne correctement

#### Tests Échoués ❌
```
[✗] Test échoué: <raison>
```
→ Un problème a été détecté, voir les logs pour détails

### Scénarios Courants

#### Scénario 1 : level-complete.json absent

**Symptôme** :
```
[✗] level-complete.json absent
```

**Solution** :
1. Créez votre arbre narratif dans `challenge-editor.html`
2. Importez dans `niveau-editor.html`
3. Placez les challenges
4. Exportez → `level-complete.json`
5. Copiez dans `data/`

---

#### Scénario 2 : IDs ne correspondent pas

**Symptôme** :
```
[✗] IDs ne correspondent pas
Challenge IDs: node_0 node_1
Node IDs: node_0 node_2
```

**Solution** :
1. Vérifiez que vous avez importé le bon arbre narratif
2. Réexportez depuis `niveau-editor.html`
3. Assurez-vous que tous les challenges placés correspondent aux nœuds

---

#### Scénario 3 : Outcomes manquants

**Symptôme** :
```
[✗] Certains challenges n'ont pas 4 outcomes
```

**Solution** :
1. Ouvrez `challenge-editor.html`
2. Sélectionnez chaque challenge
3. Vérifiez que les 4 outcomes sont remplis
4. Réexportez l'arbre narratif

---

## 5. Dépannage

### Problème : Tests bash ne s'exécutent pas

**Symptôme** :
```
bash: ./run-tests.sh: Permission denied
```

**Solution** :
```bash
chmod +x run-tests.sh
./run-tests.sh
```

---

### Problème : jq command not found

**Symptôme** :
```
bash: jq: command not found
```

**Solution** :
```bash
# Ubuntu/Debian
sudo apt-get install jq

# MacOS
brew install jq

# Fedora
sudo dnf install jq
```

---

### Problème : Tests HTML ne chargent pas

**Symptôme** :
- Page blanche
- Erreur CORS

**Solution** :
1. Assurez-vous d'utiliser un serveur web :
   ```bash
   python3 -m http.server 8000
   ```

2. Ouvrez : `http://localhost:8000/test-suite.html` (pas `file://`)

---

### Problème : Fichiers JSON invalides

**Symptôme** :
```
[✗] JSON invalide
```

**Solution** :
```bash
# Valider manuellement
cat data/level-complete.json | jq .

# Si erreur, réexporter depuis niveau-editor.html
```

---

## 6. Workflow de Test Recommandé

### 1. Après Création d'Arbre Narratif

```bash
# Vérifiez que l'export est valide
cat narrative-tree.json | jq .
```

### 2. Après Placement sur Carte

```bash
# Vérifiez que l'export est valide
cat level-complete.json | jq .
```

### 3. Après Copie dans data/

```bash
# Lancez les tests automatisés
bash run-tests.sh
```

### 4. Avant de Jouer

```bash
# Tests complets
bash run-tests.sh

# Si tous passent, lancez le jeu
python3 -m http.server 8000
```

---

## 7. Commandes Utiles

### Validation JSON Rapide

```bash
# Valider level-complete.json
jq . data/level-complete.json > /dev/null && echo "✓ Valide" || echo "✗ Invalide"

# Compter les challenges
jq '.challenges | length' data/level-complete.json

# Compter les nœuds
jq '.narrativeTree.nodes | length' data/level-complete.json

# Lister les IDs des challenges
jq '.challenges[].id' data/level-complete.json

# Lister les IDs des nœuds
jq '.narrativeTree.nodes[].id' data/level-complete.json
```

### Vérification Rapide des Fichiers

```bash
# Vérifier que tous les fichiers existent
test -f data/level-complete.json && \
test -f data/challenges.json && \
test -f data/level1.json && \
test -f index.html && \
test -f challenge-editor.html && \
test -f niveau-editor.html && \
echo "✓ Tous les fichiers présents" || echo "✗ Fichiers manquants"
```

---

## 8. Automatisation CI/CD

Si vous utilisez un système CI/CD, ajoutez ce script :

```yaml
# .github/workflows/test.yml
name: Tests Last Dunes

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install jq
        run: sudo apt-get install -y jq
      - name: Run tests
        run: bash run-tests.sh
```

---

## 9. Checklist de Test

Avant de distribuer votre niveau :

- [ ] Tests bash passent (21/21)
- [ ] Tests HTML passent (23/23)
- [ ] `level-complete.json` est valide
- [ ] IDs challenges ↔ nœuds correspondent
- [ ] Tous les challenges ont 4 outcomes
- [ ] Toutes les coordonnées sont valides
- [ ] Le jeu charge correctement le niveau
- [ ] Les dialogues s'affichent
- [ ] Les points de vie changent correctement
- [ ] Les cartes récompenses apparaissent

---

## 10. Résumé

### Tests Bash
- ✅ Rapides (< 5 secondes)
- ✅ Automatisables (CI/CD)
- ✅ Validation fichiers et structure
- ❌ Ne teste pas l'interface utilisateur

### Tests HTML
- ✅ Interface visuelle claire
- ✅ Tests interactifs
- ✅ Logs détaillés
- ❌ Nécessite un navigateur

### Recommandation

**Utilisez les deux** :
1. Tests bash pour validation rapide
2. Tests HTML pour debugging approfondi

---

## 🔗 Ressources

- **README.md** : Vue d'ensemble du projet
- **INTEGRATION_GUIDE.md** : Guide d'intégration des niveaux
- **DEBOGAGE_RAPIDE.md** : Solutions aux problèmes courants

---

**Bon testing ! 🧪✨**
