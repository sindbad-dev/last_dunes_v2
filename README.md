# 🏜️ Last Dunes

**Last Dunes** est un jeu narratif inspiré des livres dont vous êtes le héros. Le joueur contrôle un personnage dans une vue isométrique et doit accomplir des challenges en choisissant stratégiquement ses cartes de réussite ou d'échec.

## 🎮 Concept du Jeu

### Mécaniques Principales

- **Challenges** : Actions à accomplir (franchir une porte gardée, sauter un précipice, etc.)
- **Cartes de Choix** : 4 cartes disponibles pour chaque challenge
  - ✅ Réussite Triomphale (+2 catastrophe)
  - ✅ Réussite de Justesse (+1 catastrophe)
  - ❌ Échec de Justesse (0 catastrophe)
  - ❌ Échec Catastrophique (0 catastrophe)
- **Jauge de Catastrophe** : 3 niveaux maximum. Si la jauge atteint 3, le prochain challenge est automatiquement un échec catastrophique
- **Objectif** : Réussir plus de la moitié des challenges du niveau

### Narration Dynamique

Les choix du joueur créent une narration unique. L'arbre de décisions évolue en fonction des succès et échecs, créant des embranchements et des conséquences qui altèrent le monde du jeu.

---

## 📁 Structure du Projet

```
last_dunes_v2/
├── index.html                      # Jeu principal
├── challenge-editor.html           # Éditeur d'arbre narratif
├── niveau-editor.html              # Éditeur de niveau (carte + challenges)
├── README.md                       # Ce fichier
│
├── js/
│   ├── main.js                     # Point d'entrée du jeu
│   ├── mapEngine.js                # Moteur de carte et collisions
│   ├── gameLogic.js                # Logique de jeu (catastrophe, etc.)
│   └── uiManager.js                # Interface utilisateur
│
├── data/
│   ├── level-complete.json         # ✅ Format moderne (carte + arbre narratif)
│   ├── level1.json                 # Mécaniques de jeu
│   └── challenges.json             # ⚠️ Ancien format (fallback)
│
├── assets/
│   └── *.png, *.jpg                # Images de cartes
│
└── documentation/
    └── *.md                        # Fichiers obsolètes et archives
```

---

## 🚀 Démarrage Rapide

### 1. Lancer un Serveur Web Local

Le jeu nécessite un serveur web (pas de `file://`).

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# PHP
php -S localhost:8000

# Node.js (npx)
npx http-server -p 8000
```

### 2. Ouvrir le Jeu

Ouvrez votre navigateur : **http://localhost:8000**

---

## 🛠️ Éditeurs

### 🌳 Éditeur d'Arbre Narratif (`challenge-editor.html`)

**Usage** : Créer les challenges et l'arbre de décisions narratif

**Fonctionnalités** :
- ✅ Création de challenges (nœuds)
- ✅ Configuration des 4 outcomes (triumph, narrow, fail narrow, fail catastrophic)
- ✅ Gestion des points de vie par outcome (-10 à +10)
- ✅ Cartes récompenses personnalisées
- ✅ Connexions entre challenges (arbre de décision)
- ✅ Sélection rapide et navigation au clavier
- ✅ Export JSON : `narrative-tree.json`

**Accès** : http://localhost:8000/challenge-editor.html

**Raccourcis Clavier** :
- `Flèche Droite/Bas` : Challenge suivant
- `Flèche Gauche/Haut` : Challenge précédent
- `Suppr/Backspace` : Supprimer (avec confirmation)
- `Échap` : Désélectionner

---

### 🗺️ Éditeur de Niveau (`niveau-editor.html`)

**Usage** : Placer les challenges sur la carte et exporter le niveau complet

**Fonctionnalités** :
- ✅ Import d'arbre narratif (`narrative-tree.json`)
- ✅ Chargement d'image de carte (PNG/JPG)
- ✅ Placement visuel des challenges
- ✅ Configuration de la grille et position de départ
- ✅ Ajout de terrain (murs, eau, objets)
- ✅ Bibliothèque de challenges avec infos contextuelles
- ✅ Export JSON : `level-complete.json`

**Accès** : http://localhost:8000/niveau-editor.html

**Workflow** :
1. **Onglet Carte** : Charger l'image, configurer grille
2. **Onglet Terrain** : Placer murs, eau, objets (optionnel)
3. **Onglet Challenges** : Importer l'arbre narratif, placer les challenges
4. **Exporter** : Télécharger `level-complete.json`

---

## 📖 Workflow Complet

### Étape 1 : Créer l'Arbre Narratif 🌳

1. Ouvrez `challenge-editor.html`
2. Créez vos challenges (nœuds)
   - Nom, icône, couleur
   - Type (challenge, interaction, boss)
   - Dialogue de prévisualisation
   - 4 outcomes avec textes et points de vie
   - Carte récompense optionnelle
3. Reliez les challenges entre eux
4. **Exportez** → `narrative-tree.json`

---

### Étape 2 : Placer sur la Carte 🗺️

1. Ouvrez `niveau-editor.html`
2. **Onglet Carte**
   - Chargez votre image de carte
   - Configurez la grille (taille, position de départ)
3. **Onglet Challenges**
   - Importez `narrative-tree.json`
   - Placez chaque challenge sur la carte (clic)
4. **Exportez** → `level-complete.json`

---

### Étape 3 : Intégrer dans le Jeu 🎮

1. Placez `level-complete.json` dans le dossier `data/`
   ```bash
   cp ~/Downloads/level-complete.json data/
   ```

2. Le jeu charge automatiquement le fichier (priorité haute)

3. Testez dans votre navigateur
   ```
   http://localhost:8000
   ```

4. Vérifiez la console (F12) pour les logs de chargement
   ```
   📦 Utilisation de level-complete.json (format complet avec arbre narratif)
   🗺️ Carte chargée: assets/level1.png
   🌳 X challenges enrichis avec l'arbre narratif
   ✅ Jeu démarré avec succès!
   ```

---

## 🔧 Configuration

### Format des Fichiers

#### `level-complete.json` (Format Moderne)

Fichier complet exporté depuis `niveau-editor.html` :

```json
{
  "mapFile": "assets/level1.png",
  "gridSize": 40,
  "startPos": {"x": 16, "y": 25},
  "walls": [...],
  "water": [...],
  "objects": [...],
  "challenges": [
    {
      "id": "node_0",
      "coordinates": {"x": 14, "y": 18},
      "triggerRadius": 1,
      "outcomes": {...}
    }
  ],
  "narrativeTree": {
    "nodes": [...],
    "connections": [...]
  }
}
```

**Priorité** : Ce format est chargé en premier par `main.js`

---

#### `level1.json` (Mécaniques de Jeu)

Définit les mécaniques de jeu (catastrophe, cartes) :

```json
{
  "levelInfo": {...},
  "mechanics": {
    "catastropheMax": 3,
    "cards": {...}
  },
  "challenges": [...]
}
```

**Note** : Les mécaniques sont toujours chargées depuis ce fichier, même si le niveau vient de `level-complete.json`

---

## 📚 Documentation

### Guides Principaux (Racine)

| Fichier | Description |
|---------|-------------|
| `INTEGRATION_GUIDE.md` | **Guide complet** d'intégration de `level-complete.json` |
| `DEBOGAGE_RAPIDE.md` | Solutions rapides aux problèmes courants |
| `SELECTION_CHALLENGE_GUIDE.md` | Guide du système de sélection dans l'éditeur |
| `NOUVELLES_FONCTIONNALITES.md` | Gestion PV et cartes récompenses |
| `EDITEURS_README.md` | Documentation des deux éditeurs |
| `STRUCTURE_INTEGRATION.md` | Architecture du système intégré |

### Documentation Archive (`documentation/`)

Fichiers obsolètes conservés pour référence :
- `readme.md` - Ancien README basique
- `README_NOUVEAU.md` - Ancien README (mentionne `editor.html`)
- `EDITOR_GUIDE.md` - Guide de l'ancien éditeur unifié
- `editor.html` - Ancien éditeur unifié (obsolète)
- `test.html` - Ancien fichier de test
- `challenge-editor-test.html` - Tests automatisés (archivé)
- Autres fichiers de test et instructions

---

## 🐛 Débogage

### Problème : Le jeu ne charge pas `level-complete.json`

**Solution** :

1. Vérifiez que le fichier existe :
   ```bash
   ls -la data/level-complete.json
   ```

2. Vérifiez que le JSON est valide :
   ```bash
   cat data/level-complete.json | jq .
   ```

3. Ouvrez la console (F12) et vérifiez les logs :
   ```
   Fichiers chargés: {
     levelComplete: "✅",  ← Doit être ✅
     challenges: "✅",
     level1: "✅"
   }
   ```

4. Si `levelComplete` est ❌, le fichier n'est pas trouvé ou le nom est incorrect

**Consultez** : `DEBOGAGE_RAPIDE.md` pour plus de détails

---

### Problème : Les challenges ne s'affichent pas

**Causes possibles** :
- Coordonnées hors de la grille
- `triggerRadius` trop petit
- L'arbre narratif n'a pas été enrichi

**Solution** :
```bash
# Vérifiez les coordonnées
cat data/level-complete.json | jq '.challenges[] | {id, coordinates}'

# Vérifiez l'enrichissement dans la console
# Vous devriez voir : "🌳 X challenges enrichis avec l'arbre narratif"
```

---

### Problème : Erreur CORS

**Cause** : Vous avez ouvert le HTML directement (`file://`)

**Solution** : **TOUJOURS** utiliser un serveur web local
```bash
python3 -m http.server 8000
```

---

## ✅ Checklist de Validation

Avant de jouer à votre niveau :

### Création
- [ ] Arbre narratif créé dans `challenge-editor.html`
- [ ] Tous les challenges ont 4 outcomes configurés
- [ ] Les connexions entre challenges sont établies
- [ ] Exporté : `narrative-tree.json`

### Placement
- [ ] Arbre narratif importé dans `niveau-editor.html`
- [ ] Carte chargée et grille configurée
- [ ] Tous les challenges placés sur la carte
- [ ] Exporté : `level-complete.json`

### Intégration
- [ ] `level-complete.json` placé dans `data/`
- [ ] Serveur web local lancé (pas `file://`)
- [ ] Console ouverte (F12)
- [ ] Log "Utilisation de level-complete.json" visible

### Jeu
- [ ] Le jeu démarre sans erreur
- [ ] La carte s'affiche correctement
- [ ] Les challenges sont positionnés correctement
- [ ] Les dialogues s'affichent
- [ ] Les outcomes fonctionnent
- [ ] Les points de vie changent
- [ ] Les cartes récompenses apparaissent

---

## 🎯 Système de Priorité des Fichiers

`main.js` charge les fichiers dans cet ordre :

1. **`data/level-complete.json`** ← **Priorité 1** (format moderne)
2. **`data/challenges.json`** ← Fallback (ancien format)
3. **`data/level1.json`** ← Fallback final

Si `level-complete.json` existe, il est automatiquement chargé et enrichi avec l'arbre narratif.

---

## 🤝 Contribution

Ce projet est un prototype. Les éditeurs permettent de créer des niveaux sans toucher au code.

**Workflow recommandé** :
1. Créer des challenges dans l'éditeur d'arbre narratif
2. Les placer visuellement dans l'éditeur de niveau
3. Exporter et tester immédiatement

---

## 📜 Licence

Projet prototype pour validation de mécaniques de jeu.

---

## 🔗 Liens Rapides

- **Jeu** : http://localhost:8000
- **Éditeur d'Arbre Narratif** : http://localhost:8000/challenge-editor.html
- **Éditeur de Niveau** : http://localhost:8000/niveau-editor.html

---

## 📞 Support

En cas de problème :

1. Consultez `DEBOGAGE_RAPIDE.md`
2. Vérifiez la console du navigateur (F12)
3. Validez votre JSON avec `jq` ou jsonlint.com
4. Assurez-vous d'utiliser un serveur web local

---

**Bon jeu ! 🎮🏜️**
