# 🎮 Guide d'Intégration - Level Complete JSON

## Introduction

Ce guide explique comment intégrer le fichier `level-complete.json` exporté depuis l'éditeur de niveau dans votre jeu Last Dunes. Vous apprendrez où placer le fichier, comment modifier le code pour le charger, et comment organiser vos niveaux.

---

## 📋 Table des Matières

1. [Workflow Complet](#workflow-complet)
2. [Structure du Fichier Exporté](#structure-du-fichier-exporté)
3. [Organisation des Fichiers](#organisation-des-fichiers)
4. [Intégration dans le Jeu](#intégration-dans-le-jeu)
5. [Code d'Exemple](#code-dexemple)
6. [Méthodes d'Intégration](#méthodes-dintégration)
7. [Gestion Multi-Niveaux](#gestion-multi-niveaux)
8. [Débogage](#débogage)

---

## 1. Workflow Complet

### Étape 1 : Créer l'Arbre Narratif 🌳

**Fichier** : `challenge-editor.html`

1. Ouvrez `challenge-editor.html` dans votre navigateur
2. Créez vos challenges (nœuds)
3. Configurez pour chaque challenge :
   - Nom, icône, couleur
   - Type (challenge, interaction, boss)
   - Dialogue de prévisualisation
   - 4 outcomes (triumph, narrow, fail narrow, fail catastrophic)
   - Points de vie pour chaque outcome
   - Carte récompense optionnelle
4. Reliez les challenges entre eux via les points de connexion
5. Cliquez sur **💾 Exporter JSON**
6. Sauvegardez le fichier : `narrative-tree.json`

**Résultat** : Fichier `narrative-tree.json` contenant l'arbre de décision complet

---

### Étape 2 : Placer les Challenges sur la Carte 🗺️

**Fichier** : `niveau-editor.html`

1. Ouvrez `niveau-editor.html` dans votre navigateur
2. Allez dans l'onglet **Carte**
   - Chargez votre image de carte (PNG/JPG)
   - Configurez la grille (taille, position de départ)
3. Allez dans l'onglet **Terrain** (optionnel)
   - Placez les murs
   - Placez les zones d'eau
   - Placez les objets décoratifs
4. Allez dans l'onglet **Challenges**
   - Cliquez sur **📥 Importer Arbre Narratif**
   - Sélectionnez votre fichier `narrative-tree.json`
   - Vous voyez maintenant la **Bibliothèque de Challenges**
5. Pour chaque challenge :
   - Cliquez sur **Placer** dans la bibliothèque
   - Cliquez sur la carte pour positionner le challenge
   - Le challenge apparaît avec son icône, couleur et rayon de déclenchement
6. Cliquez sur **💾 Exporter Niveau Complet**
7. Sauvegardez le fichier : `level-complete.json`

**Résultat** : Fichier `level-complete.json` contenant carte + challenges + arbre narratif

---

### Étape 3 : Intégrer dans le Jeu 🎯

**Fichier** : `data/level-complete.json` (à placer)

1. Placez `level-complete.json` dans le dossier `data/`
2. Modifiez `js/main.js` pour charger ce fichier
3. Testez le niveau dans le jeu

---

## 2. Structure du Fichier Exporté

### Structure Complète de `level-complete.json`

```json
{
  "mapFile": "assets/level1.png",
  "gridSize": 40,
  "startPos": {
    "x": 16,
    "y": 25
  },
  "walls": [
    {"x": 10, "y": 5},
    {"x": 11, "y": 5}
  ],
  "water": [
    {"x": 8, "y": 12}
  ],
  "objects": [
    {
      "x": 15,
      "y": 10,
      "icon": "🌴",
      "color": "#00ff00"
    }
  ],
  "challenges": [
    {
      "id": "node_1",
      "coordinates": {
        "x": 14,
        "y": 18
      },
      "triggerRadius": 1,
      "outcomes": {
        "success_triumph": {
          "text": "Vous triomphez brillamment !",
          "cost": 2,
          "type": "success",
          "healthChange": 0
        },
        "success_narrow": {
          "text": "Vous réussissez de justesse.",
          "cost": 1,
          "type": "success",
          "healthChange": 0
        },
        "fail_narrow": {
          "text": "Vous échouez mais survivez.",
          "cost": 0,
          "type": "fail",
          "healthChange": -1
        },
        "fail_catastrophic": {
          "text": "Échec catastrophique !",
          "cost": 0,
          "type": "fail",
          "healthChange": -2
        }
      }
    }
  ],
  "narrativeTree": {
    "nodes": [
      {
        "id": "node_1",
        "name": "Le Gobelin",
        "type": "challenge",
        "icon": "👺",
        "color": "#00ff00",
        "dialogue": "Un gobelin vicieux bloque votre chemin.",
        "isStart": true,
        "x": 50,
        "y": 50,
        "outcomes": {
          "success_triumph": {
            "text": "Vous triomphez brillamment !",
            "cost": 2,
            "type": "success",
            "healthChange": 0
          },
          "success_narrow": {
            "text": "Vous réussissez de justesse.",
            "cost": 1,
            "type": "success",
            "healthChange": 0
          },
          "fail_narrow": {
            "text": "Vous échouez mais survivez.",
            "cost": 0,
            "type": "fail",
            "healthChange": -1
          },
          "fail_catastrophic": {
            "text": "Échec catastrophique !",
            "cost": 0,
            "type": "fail",
            "healthChange": -2
          }
        },
        "rewardCard": {
          "name": "épée_du_gobelin",
          "label": "Épée du Gobelin",
          "description": "Une épée rouillée mais tranchante",
          "icon": "⚔️",
          "cost": 1,
          "outcomeType": "success",
          "outcomeText": "Vous frappez avec l'épée du gobelin !",
          "healthChange": 0,
          "uses": 3
        }
      }
    ],
    "connections": [
      {
        "from": "node_1",
        "fromOutcome": "success_triumph",
        "to": "node_2"
      }
    ]
  }
}
```

### Sections Principales

| Section | Description |
|---------|-------------|
| `mapFile` | Chemin vers l'image de la carte |
| `gridSize` | Taille des cellules de la grille |
| `startPos` | Position de départ du joueur (x, y) |
| `walls` | Tableau des murs (obstacles) |
| `water` | Tableau des zones d'eau |
| `objects` | Tableau des objets décoratifs |
| `challenges` | Challenges positionnés avec coordonnées et outcomes |
| `narrativeTree` | Arbre narratif complet avec nœuds et connexions |

---

## 3. Organisation des Fichiers

### Structure Recommandée

```
last_dunes_v2/
├── index.html
├── challenge-editor.html
├── niveau-editor.html
├── js/
│   ├── main.js
│   ├── mapEngine.js
│   ├── gameLogic.js
│   └── uiManager.js
├── data/
│   ├── level-complete.json      ← Placez votre fichier exporté ici
│   ├── level1-complete.json     ← Alternative: nommez par niveau
│   ├── level2-complete.json
│   └── level3-complete.json
├── assets/
│   ├── level1.png
│   ├── level2.png
│   └── ...
└── documentation/
    ├── INTEGRATION_GUIDE.md
    ├── STRUCTURE_INTEGRATION.md
    └── ...
```

### Convention de Nommage

**Option 1 : Un seul niveau actif**
```
data/level-complete.json
```

**Option 2 : Multi-niveaux**
```
data/level1-complete.json
data/level2-complete.json
data/level3-complete.json
```

**Option 3 : Par thème**
```
data/desert-level.json
data/cave-level.json
data/boss-level.json
```

---

## 4. Intégration dans le Jeu

### Méthode 1 : Remplacer challenges.json (Simple)

Cette méthode est la plus simple si vous avez un seul niveau.

**Étapes** :
1. Placez `level-complete.json` dans le dossier `data/`
2. Renommez-le en `challenges.json` (remplace l'ancien)
3. Aucune modification de code nécessaire

**Avantage** : Aucun changement de code
**Inconvénient** : Un seul niveau à la fois

---

### Méthode 2 : Charger level-complete.json (Recommandé)

Modifiez `js/main.js` pour charger le nouveau fichier.

**Fichier** : `js/main.js`

**Avant** :
```javascript
Promise.all([
    fetch('data/challenges.json').then(r => r.ok ? r.json() : null),
    fetch('data/level1.json').then(r => r.json())
])
```

**Après** :
```javascript
Promise.all([
    fetch('data/level-complete.json').then(r => r.ok ? r.json() : null),
    fetch('data/level1.json').then(r => r.json())
])
```

---

### Méthode 3 : Système Multi-Niveaux (Avancé)

Pour charger différents niveaux dynamiquement.

**Fichier** : `js/main.js`

```javascript
// Récupérer le niveau à charger depuis l'URL ou une variable
const currentLevel = new URLSearchParams(window.location.search).get('level') || '1';
const levelFile = `data/level${currentLevel}-complete.json`;

Promise.all([
    fetch(levelFile).then(r => r.ok ? r.json() : null),
    fetch('data/level1.json').then(r => r.json())
])
.then(([levelData, gameData]) => {
    console.log(`✅ Niveau ${currentLevel} chargé:`, levelData);

    if (levelData) {
        // Charger le niveau complet
        loadCompleteLevel(levelData, gameData);
    } else {
        throw new Error(`Impossible de charger le niveau ${currentLevel}`);
    }
})
.catch(error => {
    console.error("Erreur lors du chargement:", error);
    alert("Erreur: " + error.message);
});

function loadCompleteLevel(levelData, gameData) {
    // Configuration du niveau
    const levelInfo = {
        name: "Niveau Personnalisé",
        mapFile: levelData.mapFile,
        gridSize: levelData.gridSize,
        startPos: levelData.startPos
    };

    // Charger la carte
    engine.loadMap(levelInfo);

    // Charger le terrain
    engine.loadTerrain(levelData.walls, levelData.water, levelData.objects);

    // Enrichir les challenges avec les données narratives
    const enrichedChallenges = enrichChallengesWithNarrative(
        levelData.challenges,
        levelData.narrativeTree
    );

    // Placer les challenges
    engine.placeInteractables(enrichedChallenges);

    console.log(`✅ ${enrichedChallenges.length} challenges chargés`);

    // Initialiser la logique de jeu
    logic.init(gameData);
    ui.init(gameData.mechanics.cards);

    // Démarrer le jeu
    engine.onPlayerMove((pos) => {
        const challenge = engine.checkCollision(pos);
        if (challenge && !challenge.visited) {
            challenge.visited = true;
            ui.triggerChallenge(challenge, logic);
        }
    });

    engine.start();
    console.log("✅ Jeu démarré avec succès!");
}
```

---

## 5. Code d'Exemple

### Fonction d'Enrichissement des Challenges

Cette fonction combine les challenges positionnés avec leurs données narratives complètes.

```javascript
/**
 * Enrichit les challenges avec les données de l'arbre narratif
 * @param {Array} challenges - Challenges avec coordonnées
 * @param {Object} narrativeTree - Arbre narratif complet
 * @returns {Array} Challenges enrichis
 */
function enrichChallengesWithNarrative(challenges, narrativeTree) {
    if (!narrativeTree || !narrativeTree.nodes) {
        console.warn("⚠️ Pas d'arbre narratif fourni");
        return challenges;
    }

    return challenges.map(challenge => {
        // Trouver le nœud narratif correspondant
        const node = narrativeTree.nodes.find(n => n.id === challenge.id);

        if (!node) {
            console.warn(`⚠️ Nœud narratif non trouvé pour ${challenge.id}`);
            return challenge;
        }

        // Enrichir le challenge avec les données narratives
        return {
            ...challenge,
            name: node.name,
            type: node.type,
            icon: node.icon,
            color: node.color,
            description: node.dialogue,
            dialogue_preview: node.dialogue,
            isStart: node.isStart || false,
            rewardCard: node.rewardCard || null,
            // Fusionner les outcomes
            outcomes: {
                success_triumph: challenge.outcomes.success_triumph.text,
                success_narrow: challenge.outcomes.success_narrow.text,
                fail_narrow: challenge.outcomes.fail_narrow.text,
                fail_catastrophic: challenge.outcomes.fail_catastrophic.text
            },
            // Ajouter les données de santé
            healthChanges: {
                success_triumph: challenge.outcomes.success_triumph.healthChange,
                success_narrow: challenge.outcomes.success_narrow.healthChange,
                fail_narrow: challenge.outcomes.fail_narrow.healthChange,
                fail_catastrophic: challenge.outcomes.fail_catastrophic.healthChange
            },
            // Conserver les coûts de catastrophe
            costs: {
                success_triumph: challenge.outcomes.success_triumph.cost,
                success_narrow: challenge.outcomes.success_narrow.cost,
                fail_narrow: challenge.outcomes.fail_narrow.cost,
                fail_catastrophic: challenge.outcomes.fail_catastrophic.cost
            }
        };
    });
}
```

### Fonction de Navigation entre Niveaux

```javascript
/**
 * Charge un niveau spécifique
 * @param {number} levelNumber - Numéro du niveau à charger
 */
function loadLevel(levelNumber) {
    const levelFile = `data/level${levelNumber}-complete.json`;

    fetch(levelFile)
        .then(r => {
            if (!r.ok) throw new Error(`Niveau ${levelNumber} introuvable`);
            return r.json();
        })
        .then(levelData => {
            console.log(`✅ Chargement du niveau ${levelNumber}`);
            // Réinitialiser le jeu
            engine.reset();
            logic.reset();
            // Charger le nouveau niveau
            loadCompleteLevel(levelData);
        })
        .catch(error => {
            console.error(`❌ Erreur niveau ${levelNumber}:`, error);
            alert(`Impossible de charger le niveau ${levelNumber}`);
        });
}

// Utilisation
// Dans votre HTML ou après la fin d'un niveau
document.getElementById('btn-next-level').addEventListener('click', () => {
    const nextLevel = parseInt(currentLevel) + 1;
    loadLevel(nextLevel);
});
```

---

## 6. Méthodes d'Intégration

### Comparaison des Méthodes

| Méthode | Difficulté | Flexibilité | Usage Recommandé |
|---------|-----------|-------------|------------------|
| **Remplacer challenges.json** | ⭐ Facile | ⭐ Limitée | Prototype, un seul niveau |
| **Charger level-complete.json** | ⭐⭐ Moyenne | ⭐⭐ Bonne | Production, niveau unique |
| **Système multi-niveaux** | ⭐⭐⭐ Avancée | ⭐⭐⭐ Excellente | Jeu complet, plusieurs niveaux |

---

## 7. Gestion Multi-Niveaux

### Structure URL pour Sélection de Niveau

```
index.html?level=1  → Charge level1-complete.json
index.html?level=2  → Charge level2-complete.json
index.html?level=3  → Charge level3-complete.json
```

### Menu de Sélection de Niveau (Exemple HTML)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Last Dunes - Sélection de Niveau</title>
</head>
<body>
    <h1>Sélectionnez un Niveau</h1>
    <div class="level-selector">
        <button onclick="window.location.href='game.html?level=1'">
            Niveau 1 - Le Désert
        </button>
        <button onclick="window.location.href='game.html?level=2'">
            Niveau 2 - Les Catacombes
        </button>
        <button onclick="window.location.href='game.html?level=3'">
            Niveau 3 - Le Boss Final
        </button>
    </div>
</body>
</html>
```

### Configuration de Niveaux (Fichier JSON)

Créez `data/levels-config.json` :

```json
{
  "levels": [
    {
      "id": 1,
      "name": "Le Désert Maudit",
      "file": "level1-complete.json",
      "difficulty": "Facile",
      "unlocked": true
    },
    {
      "id": 2,
      "name": "Les Catacombes",
      "file": "level2-complete.json",
      "difficulty": "Moyen",
      "unlocked": false
    },
    {
      "id": 3,
      "name": "Le Nécromancien",
      "file": "level3-complete.json",
      "difficulty": "Difficile",
      "unlocked": false
    }
  ]
}
```

Chargez cette configuration :

```javascript
fetch('data/levels-config.json')
    .then(r => r.json())
    .then(config => {
        const currentLevelConfig = config.levels.find(l => l.id === currentLevel);
        fetch(`data/${currentLevelConfig.file}`)
            .then(r => r.json())
            .then(levelData => loadCompleteLevel(levelData));
    });
```

---

## 8. Débogage

### Vérifications Essentielles

#### 1. Vérifier le Fichier Exporté

```bash
# Vérifiez que le fichier existe
ls -la data/level-complete.json

# Vérifiez la validité du JSON
cat data/level-complete.json | jq .
```

#### 2. Console du Navigateur

Ouvrez la console (F12) et vérifiez :

```javascript
// Le fichier est-il chargé ?
console.log("Level data:", levelData);

// Les challenges sont-ils présents ?
console.log("Challenges:", levelData.challenges);

// L'arbre narratif est-il présent ?
console.log("Narrative tree:", levelData.narrativeTree);
```

#### 3. Erreurs Courantes

| Erreur | Cause | Solution |
|--------|-------|----------|
| `404 Not Found` | Fichier mal placé | Vérifiez le chemin `data/level-complete.json` |
| `Unexpected token` | JSON invalide | Validez avec jsonlint.com |
| `challenges is undefined` | Structure incorrecte | Vérifiez la propriété `challenges` existe |
| `CORS error` | Ouvert en file:// | Utilisez un serveur web local |

#### 4. Serveur Web Local

Pour tester localement sans erreurs CORS :

```bash
# Méthode 1 : Python 3
python3 -m http.server 8000

# Méthode 2 : PHP
php -S localhost:8000

# Méthode 3 : Node.js (avec http-server)
npx http-server -p 8000

# Puis ouvrez : http://localhost:8000
```

#### 5. Validation de la Structure

```javascript
function validateLevelData(data) {
    const required = ['mapFile', 'gridSize', 'startPos', 'challenges', 'narrativeTree'];
    const missing = required.filter(key => !data[key]);

    if (missing.length > 0) {
        console.error(`❌ Propriétés manquantes: ${missing.join(', ')}`);
        return false;
    }

    if (!data.challenges || data.challenges.length === 0) {
        console.warn('⚠️ Aucun challenge défini');
    }

    if (!data.narrativeTree.nodes || data.narrativeTree.nodes.length === 0) {
        console.warn('⚠️ Arbre narratif vide');
    }

    console.log('✅ Structure valide');
    return true;
}

// Utilisation
fetch('data/level-complete.json')
    .then(r => r.json())
    .then(data => {
        if (validateLevelData(data)) {
            loadCompleteLevel(data);
        }
    });
```

---

## 9. Checklist d'Intégration

### Avant de Commencer
- [ ] J'ai créé mon arbre narratif dans `challenge-editor.html`
- [ ] J'ai exporté `narrative-tree.json`
- [ ] J'ai importé l'arbre dans `niveau-editor.html`
- [ ] J'ai placé tous les challenges sur la carte
- [ ] J'ai exporté `level-complete.json`

### Placement des Fichiers
- [ ] J'ai créé le dossier `data/` s'il n'existe pas
- [ ] J'ai placé `level-complete.json` dans `data/`
- [ ] L'image de la carte est dans `assets/`
- [ ] Le chemin `mapFile` dans le JSON correspond au fichier image

### Modification du Code
- [ ] J'ai modifié `js/main.js` pour charger le bon fichier
- [ ] J'ai ajouté la fonction `enrichChallengesWithNarrative` si nécessaire
- [ ] J'ai testé que le fichier se charge sans erreur

### Test du Jeu
- [ ] J'ai lancé un serveur web local
- [ ] Le jeu démarre sans erreur dans la console
- [ ] La carte s'affiche correctement
- [ ] Les challenges sont positionnés correctement
- [ ] Les dialogues s'affichent correctement
- [ ] Les outcomes fonctionnent
- [ ] Les points de vie changent correctement
- [ ] Les cartes récompenses apparaissent

---

## 10. Résumé Visuel

```
┌─────────────────────────────────────────────────────────────┐
│                     WORKFLOW COMPLET                        │
└─────────────────────────────────────────────────────────────┘

1. CRÉATION
   challenge-editor.html
   └─→ Export: narrative-tree.json

2. PLACEMENT
   niveau-editor.html
   ├─→ Import: narrative-tree.json
   └─→ Export: level-complete.json

3. INTÉGRATION
   level-complete.json
   └─→ Placer dans: data/

4. CHARGEMENT
   js/main.js
   ├─→ fetch('data/level-complete.json')
   └─→ loadCompleteLevel()

5. JEU
   index.html
   └─→ Le niveau se charge avec tous les challenges
```

---

## 11. Exemples Complets

### Exemple 1 : Intégration Simple (Un Niveau)

**Étape 1** : Placez le fichier
```bash
cp level-complete.json data/
```

**Étape 2** : Modifiez `js/main.js`
```javascript
// Ligne 9 : Changez le nom du fichier
fetch('data/level-complete.json').then(r => r.ok ? r.json() : null),
```

**Étape 3** : Testez
```bash
python3 -m http.server 8000
# Ouvrez http://localhost:8000
```

---

### Exemple 2 : Trois Niveaux

**Étape 1** : Créez vos niveaux
- Niveau 1 → `data/level1-complete.json`
- Niveau 2 → `data/level2-complete.json`
- Niveau 3 → `data/level3-complete.json`

**Étape 2** : Créez `js/level-loader.js`
```javascript
class LevelLoader {
    constructor() {
        this.currentLevel = 1;
    }

    async loadLevel(levelNumber) {
        try {
            const response = await fetch(`data/level${levelNumber}-complete.json`);
            if (!response.ok) throw new Error(`Niveau ${levelNumber} introuvable`);

            const levelData = await response.json();
            console.log(`✅ Niveau ${levelNumber} chargé`);

            this.currentLevel = levelNumber;
            return levelData;
        } catch (error) {
            console.error(`❌ Erreur chargement niveau ${levelNumber}:`, error);
            throw error;
        }
    }

    nextLevel() {
        return this.loadLevel(this.currentLevel + 1);
    }

    restart() {
        return this.loadLevel(this.currentLevel);
    }
}

// Utilisation
const levelLoader = new LevelLoader();
levelLoader.loadLevel(1).then(data => loadCompleteLevel(data));
```

**Étape 3** : Ajoutez dans `index.html`
```html
<script src="js/level-loader.js"></script>
```

---

## Conclusion

Vous avez maintenant toutes les informations pour intégrer votre fichier `level-complete.json` dans le jeu. Le fichier contient à la fois la carte, les challenges positionnés, et l'arbre narratif complet.

**Points Clés** :
- ✅ Placez le fichier dans `data/`
- ✅ Modifiez `js/main.js` pour le charger
- ✅ Utilisez un serveur web local pour tester
- ✅ Validez la structure avec la console

**Prochaines Étapes** :
1. Testez avec un niveau simple
2. Ajoutez plus de challenges
3. Créez plusieurs niveaux
4. Implémentez la navigation entre niveaux

Bon courage pour votre intégration ! 🎮
