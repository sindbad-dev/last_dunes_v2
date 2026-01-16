# 🎮 Guide d'Intégration - Last Dunes

## Introduction

Ce guide explique comment intégrer votre niveau créé avec les éditeurs dans le jeu Last Dunes. Le système charge automatiquement `level-complete.json` si présent, avec fallback intelligent sur les anciens formats.

---

## 📋 Table des Matières

1. [Workflow Complet](#workflow-complet)
2. [Placement du Fichier](#placement-du-fichier)
3. [Système de Chargement](#système-de-chargement)
4. [Vérification](#vérification)
5. [Débogage](#débogage)
6. [Multi-Niveaux](#multi-niveaux)

---

## 1. Workflow Complet

### Vue d'Ensemble

```
1. CRÉATION              2. PLACEMENT            3. INTÉGRATION
   challenge-editor        niveau-editor           Jeu principal
        ↓                      ↓                        ↓
narrative-tree.json    level-complete.json       Chargement auto
```

---

### Étape 1 : Créer l'Arbre Narratif 🌳

**Fichier** : `challenge-editor.html`

**Actions** :
1. Créez vos challenges (➕ Nouveau Challenge)
2. Pour chaque challenge :
   - **Propriétés** : Nom, icône, couleur, type
   - **Dialogue** : Texte de prévisualisation
   - **4 Outcomes** : Triumph, Narrow, Fail Narrow, Fail Catastrophic
   - **Points de Vie** : -10 à +10 pour chaque outcome
   - **Carte Récompense** : Optionnelle
3. Reliez les challenges via les points de connexion dorés
4. **💾 Exporter JSON** → Sauvegardez `narrative-tree.json`

**Raccourcis Utiles** :
- `Flèche Droite/Bas` : Challenge suivant
- `Flèche Gauche/Haut` : Challenge précédent
- `Suppr` : Supprimer le challenge sélectionné

---

### Étape 2 : Placer sur la Carte 🗺️

**Fichier** : `niveau-editor.html`

**Actions** :

#### Onglet Carte
1. **Charger l'image** : Upload ou URL d'une image PNG/JPG
2. **Configurer la grille** :
   - Taille des cellules (ex: 40px)
   - Position de départ du joueur (x, y)

#### Onglet Terrain (Optionnel)
1. **Murs** : Obstacles infranchissables
2. **Eau** : Zones aquatiques
3. **Objets** : Éléments décoratifs (arbres, rochers, etc.)

#### Onglet Challenges
1. **📥 Importer Arbre Narratif** → Sélectionnez `narrative-tree.json`
2. La **Bibliothèque de Challenges** apparaît avec :
   - Icône, nom, type de chaque challenge
   - Nombre d'outcomes
   - Statut de placement (✓ placé ou ✗ non placé)
3. Pour chaque challenge :
   - Cliquez sur **Placer** dans la bibliothèque
   - Cliquez sur la carte à l'endroit désiré
   - Le challenge apparaît avec son icône et rayon
4. **💾 Exporter Niveau Complet** → Sauvegardez `level-complete.json`

---

### Étape 3 : Intégrer dans le Jeu 🎯

**Actions** :

1. **Placez le fichier** dans le dossier `data/`
   ```bash
   cp ~/Downloads/level-complete.json data/
   ```

2. **C'est tout !** Le jeu charge automatiquement le fichier

3. **Testez** :
   ```bash
   # Lancez un serveur web
   python3 -m http.server 8000

   # Ouvrez votre navigateur
   # http://localhost:8000
   ```

4. **Vérifiez la console** (F12) :
   ```
   📦 Utilisation de level-complete.json (format complet avec arbre narratif)
   🗺️ Carte chargée: assets/level1.png
   🌳 X challenges enrichis avec l'arbre narratif
   ✅ Jeu démarré avec succès!
   ```

---

## 2. Placement du Fichier

### Structure Attendue

```
last_dunes_v2/
├── index.html
├── data/
│   ├── level-complete.json    ← PLACEZ VOTRE FICHIER ICI
│   ├── level1.json             (mécaniques de jeu)
│   └── challenges.json         (ancien format, fallback)
└── assets/
    └── level1.png              (votre image de carte)
```

### Nom du Fichier

**Important** : Le nom doit être **exactement** :
```
level-complete.json
```

**Pas** :
- ❌ `level_complete.json` (underscore)
- ❌ `levelcomplete.json` (pas de tiret)
- ❌ `Level-Complete.json` (majuscule)

### Chemin Complet

Le fichier doit être accessible à :
```
data/level-complete.json
```

---

## 3. Système de Chargement

### Priorité de Chargement

`js/main.js` charge les fichiers dans cet ordre :

| Priorité | Fichier | Format | Usage |
|----------|---------|--------|-------|
| **1** | `data/level-complete.json` | Moderne | Carte + Arbre narratif complet |
| **2** | `data/challenges.json` | Ancien | Challenges seuls (fallback) |
| **3** | `data/level1.json` | Legacy | Fallback final |

### Enrichissement Automatique

Si `level-complete.json` contient un `narrativeTree`, le système :
1. ✅ Charge les challenges positionnés
2. ✅ Trouve chaque nœud correspondant dans l'arbre narratif
3. ✅ Enrichit automatiquement avec :
   - Nom du challenge
   - Icône et couleur
   - Dialogue de prévisualisation
   - Carte récompense
4. ✅ Place les challenges enrichis sur la carte

### Code d'Enrichissement

Le code suivant (dans `main.js:10-43`) gère l'enrichissement :

```javascript
function enrichChallengesWithNarrative(challenges, narrativeTree) {
    return challenges.map(challenge => {
        const node = narrativeTree.nodes.find(n => n.id === challenge.id);
        return {
            ...challenge,
            name: node.name,
            icon: node.icon,
            color: node.color,
            description: node.dialogue,
            rewardCard: node.rewardCard
        };
    });
}
```

**Vous n'avez rien à faire**, c'est automatique ! 🎉

---

## 4. Vérification

### Checklist de Validation

#### Avant le Chargement
- [ ] Le fichier `level-complete.json` existe dans `data/`
- [ ] Le nom est exact (tiret, pas underscore)
- [ ] Le JSON est valide (testez avec `jq` ou jsonlint.com)
- [ ] L'image de carte existe dans `assets/`

#### Vérifications Console (F12)

Ouvrez la console et vérifiez ces messages :

**✅ Chargement Réussi**
```javascript
Fichiers chargés: {
  levelComplete: "✅",  ← Doit être ✅
  challenges: "✅",
  level1: "✅"
}
📦 Utilisation de level-complete.json (format complet avec arbre narratif)
🗺️ Carte chargée: assets/level1.png
🔄 Enrichissement de 2 challenges avec l'arbre narratif
✅ Challenge enrichi: Le Gobelin (node_0)
✅ Challenge enrichi: Le Gardien (node_1)
🌳 2 challenges enrichis avec l'arbre narratif
✅ 2 challenges chargés depuis level-complete.json
📍 Source: level-complete.json
✅ Jeu démarré avec succès!
```

**❌ Fichier Non Trouvé**
```javascript
Fichiers chargés: {
  levelComplete: "❌",  ← Fichier absent
  challenges: "✅",
  level1: "✅"
}
📦 Utilisation de challenges.json (ancien format)
```

→ **Action** : Vérifiez que `data/level-complete.json` existe

---

### Commandes de Test

```bash
# Vérifier que le fichier existe
test -f data/level-complete.json && echo "✅ Fichier existe" || echo "❌ Fichier absent"

# Valider le JSON
cat data/level-complete.json | jq . > /dev/null && echo "✅ JSON valide" || echo "❌ JSON invalide"

# Vérifier la structure
cat data/level-complete.json | jq 'has("mapFile", "gridSize", "startPos", "challenges", "narrativeTree")'

# Doit afficher: true

# Compter les challenges
echo "Challenges: $(cat data/level-complete.json | jq '.challenges | length')"
echo "Nœuds: $(cat data/level-complete.json | jq '.narrativeTree.nodes | length')"

# Ces deux nombres doivent correspondre !
```

---

## 5. Débogage

### Problème 1 : Le fichier ne se charge pas

**Symptôme** :
```
Fichiers chargés: { levelComplete: "❌" }
```

**Causes possibles** :
1. Le fichier n'existe pas dans `data/`
2. Le nom du fichier est incorrect
3. Les permissions sont incorrectes

**Solutions** :
```bash
# 1. Vérifiez l'emplacement
ls -la data/level-complete.json

# 2. Vérifiez les permissions
chmod 644 data/level-complete.json

# 3. Vérifiez que vous êtes au bon endroit
pwd
# Doit afficher: /home/user/last_dunes_v2
```

---

### Problème 2 : JSON invalide

**Symptôme** :
```
❌ Erreur lors du chargement: SyntaxError: Unexpected token
```

**Solutions** :
```bash
# Validez avec jq
cat data/level-complete.json | jq .

# Si erreur, corrigez ou réexportez depuis niveau-editor.html

# Ou utilisez jsonlint.com
```

---

### Problème 3 : Les challenges ne s'enrichissent pas

**Symptôme** :
```
⚠️ Pas d'arbre narratif fourni, utilisation des challenges bruts
```

**Cause** : La propriété `narrativeTree` est absente ou vide

**Solution** :
1. Vérifiez que vous avez exporté depuis **niveau-editor.html** (pas challenge-editor)
2. Vérifiez que vous avez importé l'arbre narratif dans niveau-editor **avant** d'exporter
3. Ouvrez le JSON et vérifiez :
```bash
cat data/level-complete.json | jq '.narrativeTree'
# Ne doit pas afficher "null"
```

---

### Problème 4 : Erreur CORS

**Symptôme** :
```
Access to fetch at 'file://...' has been blocked by CORS policy
```

**Cause** : Vous avez ouvert le HTML directement (`file://`)

**Solution** : **TOUJOURS** utiliser un serveur web local
```bash
python3 -m http.server 8000
# Puis ouvrez http://localhost:8000
```

---

### Problème 5 : Les challenges ne s'affichent pas

**Causes possibles** :
1. Les coordonnées sont hors de la grille
2. Le `triggerRadius` est trop petit
3. Les IDs ne correspondent pas entre challenges et nœuds

**Solutions** :
```bash
# Vérifiez les coordonnées
cat data/level-complete.json | jq '.challenges[] | {id, coordinates}'

# Vérifiez les IDs
cat data/level-complete.json | jq '.challenges[].id' | sort > /tmp/challenges_ids.txt
cat data/level-complete.json | jq '.narrativeTree.nodes[].id' | sort > /tmp/nodes_ids.txt
diff /tmp/challenges_ids.txt /tmp/nodes_ids.txt
# Si différent, il y a un problème de correspondance
```

---

## 6. Multi-Niveaux

### Organisation pour Plusieurs Niveaux

Si vous voulez plusieurs niveaux :

```
data/
├── level1-complete.json
├── level2-complete.json
├── level3-complete.json
└── level1.json          (mécaniques communes)
```

### Méthode 1 : Changement Manuel

Copiez le niveau à jouer :
```bash
cp data/level2-complete.json data/level-complete.json
```

---

### Méthode 2 : Sélection par URL

Modifiez `js/main.js` pour accepter un paramètre :

```javascript
// Récupérer le niveau depuis l'URL
const params = new URLSearchParams(window.location.search);
const levelNumber = params.get('level') || '1';
const levelFile = `data/level${levelNumber}-complete.json`;

// Charger le niveau spécifique
fetch(levelFile)
    .then(r => r.ok ? r.json() : null)
    .catch(() => null)
```

**Usage** :
```
http://localhost:8000?level=1  → Charge level1-complete.json
http://localhost:8000?level=2  → Charge level2-complete.json
http://localhost:8000?level=3  → Charge level3-complete.json
```

---

### Méthode 3 : Menu de Sélection

Créez `menu.html` :

```html
<!DOCTYPE html>
<html>
<head>
    <title>Last Dunes - Sélection de Niveau</title>
</head>
<body>
    <h1>Choisissez votre Niveau</h1>
    <button onclick="location.href='index.html?level=1'">
        Niveau 1 - Le Désert
    </button>
    <button onclick="location.href='index.html?level=2'">
        Niveau 2 - Les Catacombes
    </button>
    <button onclick="location.href='index.html?level=3'">
        Niveau 3 - Le Boss Final
    </button>
</body>
</html>
```

---

## 7. Structure du Fichier

### Format Complet

```json
{
  "mapFile": "assets/level1.png",
  "gridSize": 40,
  "startPos": {
    "x": 16,
    "y": 25
  },
  "walls": [
    {"x": 10, "y": 5}
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
      "id": "node_0",
      "coordinates": {"x": 14, "y": 18},
      "triggerRadius": 1,
      "outcomes": {
        "success_triumph": {
          "text": "Vous triomphez !",
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
        "id": "node_0",
        "name": "Le Gobelin",
        "type": "challenge",
        "icon": "👺",
        "color": "#00ff00",
        "dialogue": "Un gobelin bloque votre chemin.",
        "isStart": true,
        "x": 50,
        "y": 50,
        "outcomes": {...},
        "rewardCard": {
          "name": "épée_gobelin",
          "label": "Épée du Gobelin",
          "description": "Une épée rouillée",
          "icon": "⚔️",
          "cost": 1,
          "outcomeType": "success",
          "outcomeText": "Vous frappez !",
          "healthChange": 0,
          "uses": 3
        }
      }
    ],
    "connections": [
      {
        "from": "node_0",
        "fromOutcome": "success_triumph",
        "to": "node_1"
      }
    ]
  }
}
```

---

## 8. Résumé

### Ce Qui Est Automatique ✅

- **Chargement** : `level-complete.json` est chargé automatiquement s'il existe
- **Enrichissement** : Les challenges sont enrichis avec l'arbre narratif
- **Fallback** : Si absent, le jeu charge `challenges.json` ou `level1.json`
- **Logs** : Tout est tracé dans la console pour le débogage

### Ce Que Vous Devez Faire ✅

1. **Créer** votre arbre narratif dans `challenge-editor.html`
2. **Placer** vos challenges dans `niveau-editor.html`
3. **Copier** `level-complete.json` dans `data/`
4. **Tester** avec un serveur web local

### Points Clés 🎯

- ✅ Le fichier **doit** s'appeler `level-complete.json` (avec tiret)
- ✅ Le fichier **doit** être dans `data/`
- ✅ Vous **devez** utiliser un serveur web (pas `file://`)
- ✅ La console (F12) est votre amie pour le débogage

---

## 🔗 Ressources

- **README principal** : Vue d'ensemble du projet
- **DEBOGAGE_RAPIDE.md** : Solutions aux problèmes courants
- **SELECTION_CHALLENGE_GUIDE.md** : Guide de l'éditeur de challenges
- **NOUVELLES_FONCTIONNALITES.md** : Système de PV et récompenses

---

**Bon développement ! 🎮🏜️**
