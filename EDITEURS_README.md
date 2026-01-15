# 🗺️ Guide des Éditeurs - Last Dunes

Ce projet propose deux éditeurs séparés pour créer votre aventure narrative :

## 📋 Vue d'ensemble

### 1. **Éditeur de Niveau** (`niveau-editor.html`)
Permet de créer la carte du monde, placer les murs, l'eau et les objets décoratifs.

### 2. **Éditeur d'Arbre Narratif** (`challenge-editor.html`)
Permet de créer les arbres de décisions narratifs avec les challenges et leurs enchaînements.

---

## 🗺️ Éditeur de Niveau

### Ouverture
```bash
# Ouvrez simplement le fichier dans votre navigateur
open niveau-editor.html
```

### Fonctionnalités

#### Onglet "Terrain"
- **🧱 Mur** : Cliquez pour placer/enlever des murs
- **💧 Eau** : Cliquez pour placer/enlever de l'eau
- **🗑️ Gomme** : Efface les éléments (murs, eau, objets)
- **Mode Pinceau** : Activez pour dessiner en cliquant-glissant

#### Onglet "Objets"
- Bibliothèque de 18 objets (portes, coffres, lampes, etc.)
- Placement par simple clic sur la carte
- Possibilité d'ajouter des emojis personnalisés

#### Onglet "Config"
- **Carte de fond** : Importez une image PNG/JPG
- **Taille de grille** : Ajustez de 10 à 100px
- **Position de départ** : Définissez où le joueur commence
- **Export/Import JSON** : Sauvegardez et chargez vos niveaux

### Export
Le JSON exporté contient :
```json
{
  "mapFile": "assets/level1.png",
  "gridSize": 40,
  "startPos": { "x": 16, "y": 25 },
  "walls": [...],
  "water": [...],
  "objects": [...]
}
```

---

## 🌳 Éditeur d'Arbre Narratif

### Ouverture
```bash
# Ouvrez simplement le fichier dans votre navigateur
open challenge-editor.html
```

### Fonctionnalités Principales

#### Création de Nœuds
1. Cliquez sur **"➕ Nouveau Challenge"**
2. Un nœud apparaît sur le canvas
3. Cliquez sur le nœud pour l'éditer dans la sidebar

#### Édition d'un Nœud

**Propriétés du Challenge :**
- **Nom** : Le titre du challenge (ex: "Le Gobelin")
- **Type** : Challenge, Interaction ou Boss
- **Icône** : Emoji représentant le challenge
- **Couleur** : Couleur du nœud (pour organisation visuelle)
- **Dialogue** : Texte de prévisualisation
- **Nœud de départ** : Cochez si c'est le premier challenge

**Cartes et Conséquences :**
Chaque challenge a 4 types de cartes :

1. **✓ Réussite Triomphale** (vert foncé)
   - Coût en catastrophe : 2 (par défaut)
   - Texte de résultat

2. **✓ Réussite de Justesse** (vert clair)
   - Coût en catastrophe : 1 (par défaut)
   - Texte de résultat

3. **✗ Échec de Justesse** (orange)
   - Coût en catastrophe : 0 (par défaut)
   - Texte de résultat

4. **✗ Échec Catastrophique** (rouge)
   - Coût en catastrophe : 0 (par défaut)
   - Texte de résultat

#### Création de Connexions

1. Cliquez sur un **point de connexion** (cercle jaune à droite de chaque carte)
2. Une ligne en pointillés apparaît
3. Cliquez sur un autre point de connexion pour créer la liaison
4. Cela permet d'enchaîner les challenges selon les choix

#### Navigation dans le Canvas

- **Déplacer un nœud** : Cliquez-glissez sur le nœud
- **Déplacer le canvas** : Cliquez-glissez sur le fond
- **Sélectionner** : Cliquez sur un nœud
- **Annuler connexion** : Cliquez dans le vide

### Export

Le JSON exporté contient :
```json
{
  "nodes": [
    {
      "id": "node_1",
      "name": "Le Gobelin",
      "type": "challenge",
      "icon": "👺",
      "color": "#ff00ff",
      "dialogue": "Un gobelin vicieux bloque votre chemin...",
      "isStart": true,
      "x": 100,
      "y": 100,
      "outcomes": {
        "success_triumph": {
          "text": "Vous terrassez le gobelin avec brio !",
          "cost": 2,
          "type": "success"
        },
        "success_narrow": {
          "text": "Vous repoussez le gobelin de justesse.",
          "cost": 1,
          "type": "success"
        },
        "fail_narrow": {
          "text": "Le gobelin vous blesse légèrement.",
          "cost": 0,
          "type": "fail"
        },
        "fail_catastrophic": {
          "text": "Le gobelin vous terrasse !",
          "cost": 0,
          "type": "fail"
        }
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
```

---

## 🎮 Intégration avec le Jeu

### Workflow Complet

1. **Créez votre niveau** avec `niveau-editor.html`
   - Dessinez le terrain
   - Placez les objets
   - Exportez `niveau.json`

2. **Créez votre arbre narratif** avec `challenge-editor.html`
   - Ajoutez tous vos challenges
   - Définissez les textes et conséquences
   - Créez les connexions entre challenges
   - Exportez `narrative-tree.json`

3. **Fusionnez les données** (à faire manuellement pour l'instant)
   - Combinez les informations dans un fichier final
   - Ajoutez les coordonnées des challenges depuis `niveau-editor.html`

### Format Final pour le Jeu

Pour l'instant, vous devrez créer un fichier combiné comme `level1.json` :

```json
{
  "mapFile": "assets/level1.png",
  "gridSize": 40,
  "startPos": { "x": 16, "y": 25 },
  "walls": [...],
  "water": [...],
  "objects": [...],
  "challenges": [
    {
      "id": "goblin_encounter",
      "name": "Le Gobelin",
      "type": "challenge",
      "coordinates": { "x": 14, "y": 18 },
      "triggerRadius": 1,
      "icon": "👺",
      "color": "#00ff00",
      "description": "Un gobelin vicieux bloque votre chemin.",
      "dialogue_preview": "Un gobelin armé d'une dague rouillée...",
      "outcomes": {
        "success_narrow": "Vous repoussez le gobelin...",
        "success_triumph": "Vous terrassez le gobelin avec brio !",
        "fail_narrow": "Le gobelin vous blesse...",
        "fail_catastrophic": "Le gobelin vous terrasse !"
      }
    }
  ],
  "cards": {
    "success_narrow": {
      "label": "Réussite de justesse",
      "catastropheCost": 1,
      "outcomeType": "success"
    },
    "success_triumph": {
      "label": "Réussite triomphale",
      "catastropheCost": 2,
      "outcomeType": "success"
    },
    "fail_narrow": {
      "label": "Échec de justesse",
      "catastropheCost": 0,
      "outcomeType": "fail"
    },
    "fail_catastrophic": {
      "label": "Échec catastrophique",
      "catastropheCost": 0,
      "outcomeType": "fail_crit"
    }
  }
}
```

---

## 💡 Conseils d'Utilisation

### Éditeur de Niveau
- Utilisez le **Mode Pinceau** pour tracer rapidement des murs
- Importez une carte PNG pour faciliter le placement des éléments
- Sauvegardez régulièrement avec **Copier JSON**

### Éditeur d'Arbre Narratif
- Commencez par créer tous vos nœuds avant de faire les connexions
- Marquez le **nœud de départ** (challenge initial)
- Utilisez les **couleurs** pour organiser visuellement les types de challenges
- Les **connexions** montrent l'enchaînement après chaque choix de carte
- Vous pouvez créer des **branches multiples** pour des histoires non-linéaires

### Organisation
- Créez des fichiers séparés pour chaque niveau/chapitre
- Nommez clairement vos exports (`niveau1.json`, `chapitre1-narratif.json`)
- Documentez vos arbres de décisions (dessinez un schéma si besoin)

---

## 🔧 Dépannage

### L'éditeur ne s'ouvre pas
- Vérifiez que vous utilisez un navigateur moderne (Chrome, Firefox, Safari)
- Ouvrez la console développeur (F12) pour voir les erreurs

### Les connexions ne se créent pas
- Assurez-vous de cliquer sur les **points jaunes** (connection dots)
- Cliquez d'abord sur le point source, puis sur le point destination

### Le JSON exporté est vide
- Vérifiez que vous avez bien créé des éléments
- Essayez **"Copier JSON"** au lieu de télécharger

---

## 🚀 Prochaines Améliorations

- [ ] Fusion automatique des exports niveau + narratif
- [ ] Placement des challenges directement sur la carte
- [ ] Preview du jeu en temps réel
- [ ] Templates de challenges prédéfinis
- [ ] Validation des arbres de décisions (pas de nœuds orphelins)
- [ ] Zoom et minimap dans l'éditeur d'arbre
- [ ] Undo/Redo

---

## 📝 Support

Pour toute question ou problème, ouvrez une issue sur le dépôt GitHub.

Bon game design ! 🎮
