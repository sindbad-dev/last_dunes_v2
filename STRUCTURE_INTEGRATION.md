# 🔗 Structure du Projet - Liaison Niveau & Challenges

Ce document explique la nouvelle architecture intégrée qui lie les éditeurs de niveau et d'arbre narratif.

---

## 📊 Vue d'Ensemble de l'Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     WORKFLOW COMPLET                          │
└─────────────────────────────────────────────────────────────┘

    1. challenge-editor.html               2. niveau-editor.html
    ┌──────────────────────┐              ┌──────────────────────┐
    │ Créer arbre narratif │              │  Import arbre        │
    │ - Nœuds/Challenges   │─────JSON────▶│  Placement sur carte │
    │ - Connexions         │              │  Export combiné      │
    │ - Outcomes           │              │                      │
    └──────────────────────┘              └──────────────────────┘
              │                                      │
              │                                      │
              ▼                                      ▼
    narrative-tree.json                    level-complete.json
    ┌──────────────────┐                  ┌────────────────────┐
    │ {                │                  │ {                  │
    │   nodes: [...]   │                  │   terrain: {...}   │
    │   connections:[] │                  │   challenges: [...] │
    │ }                │                  │   narrativeTree:{} │
    └──────────────────┘                  └────────────────────┘
```

---

## 📁 Structure des Fichiers JSON

### 1. **narrative-tree.json** (Sortie de challenge-editor.html)

Structure pure de l'arbre de décisions :

```json
{
  "nodes": [
    {
      "id": "node_1",
      "name": "Le Gobelin",
      "type": "challenge",
      "icon": "👺",
      "color": "#00ff00",
      "dialogue": "Un gobelin vicieux bloque votre chemin...",
      "isStart": true,
      "x": 50,
      "y": 50,
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

**Points clés :**
- `x`, `y` : Positions dans l'éditeur d'arbre (pas sur la carte du jeu)
- `outcomes` : Toutes les conséquences narratives
- `connections` : Enchaînements entre challenges

---

### 2. **level-complete.json** (Sortie de niveau-editor.html)

Niveau complet avec terrain ET challenges placés :

```json
{
  "mapFile": "assets/level1.png",
  "gridSize": 40,
  "startPos": {
    "x": 16,
    "y": 25
  },
  "walls": [
    { "x": 5, "y": 10 },
    { "x": 6, "y": 10 }
  ],
  "water": [
    { "x": 8, "y": 12 }
  ],
  "objects": [
    { "x": 10, "y": 15, "emoji": "🚪" }
  ],
  "challenges": [
    {
      "id": "node_1",
      "name": "Le Gobelin",
      "type": "challenge",
      "coordinates": {
        "x": 14,
        "y": 18
      },
      "triggerRadius": 1,
      "icon": "👺",
      "color": "#00ff00",
      "description": "Un gobelin vicieux bloque votre chemin...",
      "dialogue_preview": "Un gobelin vicieux bloque votre chemin...",
      "outcomes": {
        "success_triumph": {
          "text": "Vous terrassez le gobelin avec brio !",
          "cost": 2,
          "type": "success"
        },
        ...
      }
    }
  ],
  "narrativeTree": {
    "nodes": [...],
    "connections": [...]
  }
}
```

**Points clés :**
- `challenges[].coordinates` : Position RÉELLE sur la carte du jeu
- `challenges[].triggerRadius` : Rayon de déclenchement sur la carte
- `narrativeTree` : Arbre complet embarqué pour référence

---

## 🔄 Workflow Recommandé

### Étape 1 : Créer l'Arbre Narratif

```bash
# Ouvrez l'éditeur d'arbre narratif
open challenge-editor.html
```

**Actions :**
1. Créez tous vos challenges (➕ Nouveau Challenge)
2. Définissez les propriétés (nom, type, icône, dialogue)
3. Écrivez les 4 outcomes pour chaque challenge
4. Créez les connexions entre challenges
5. **Exportez** : `💾 Exporter JSON` → `narrative-tree.json`

---

### Étape 2 : Créer le Niveau et Placer les Challenges

```bash
# Ouvrez l'éditeur de niveau
open niveau-editor.html
```

**Actions :**
1. **Onglet Terrain** :
   - Dessinez murs et eau
   - Configurez la carte de fond

2. **Onglet Objets** :
   - Placez les objets décoratifs

3. **Onglet Challenges** :
   - Cliquez sur `📂 Charger Arbre Narratif`
   - Sélectionnez `narrative-tree.json`
   - ✅ **Bibliothèque de Challenges** apparaît
   - Cliquez sur un challenge dans la bibliothèque
   - Cliquez sur la carte pour le placer
   - Répétez pour tous les challenges

4. **Onglet Config** :
   - Configurez position de départ
   - **Exportez** : `📥 Télécharger JSON` → `level-complete.json`

---

### Étape 3 : Utiliser dans le Jeu

```javascript
// js/main.js ou équivalent
fetch('data/level-complete.json')
  .then(res => res.json())
  .then(levelData => {
    // levelData.walls, levelData.water, levelData.objects
    // levelData.challenges (avec coordonnées et outcomes)
    // levelData.narrativeTree (pour navigation narrative)

    mapEngine.loadLevel(levelData);
  });
```

---

## 🎯 Informations Contextuelles

### Dans l'Onglet Challenges du Niveau-Editor

Quand vous importez un arbre narratif, vous voyez :

```
┌─────────────────────────────────────────────┐
│ 📚 Bibliothèque de Challenges               │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ 👺 Le Gobelin          [CHALLENGE]      │ │
│ │ Un gobelin vicieux bloque votre chemin  │ │
│ │ 4 conséquences définies                 │ │
│ │ ✓ Placé sur la carte                    │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 🌉 Le Pont Fragile    [INTERACTION]     │ │
│ │ Un pont fragile traverse un gouffre...  │ │
│ │ 4 conséquences définies                 │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Informations affichées :**
- ✅ Icône et nom du challenge
- ✅ Type (challenge, interaction, boss)
- ✅ Dialogue de prévisualisation
- ✅ Nombre de conséquences (outcomes)
- ✅ État de placement (placé ou non)

---

### Challenges Placés sur la Carte

```
┌─────────────────────────────────────────────┐
│ 📍 Challenges Placés (3)                    │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ 👺 Le Gobelin          [CHALLENGE]      │ │
│ │ 📍 Position: (14, 18)                   │ │
│ │ 🎯 Rayon: 1                             │ │
│ │ [🗑️ Supprimer]                          │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Informations contextuelles :**
- Position exacte sur la grille
- Rayon de déclenchement
- Bouton de suppression
- Toutes les propriétés narratives préservées

---

## 🔍 Visualisation sur la Carte

Quand vous placez un challenge sur la carte :

```
┌───────────────────────────────────────┐
│                                       │
│     ░░░░░░                           │
│     ░🧱🧱🧱                          │
│     ░🧱   🧱      [👺]  ← Challenge  │
│     ░🧱🧱🧱       [   ]  ← Rayon     │
│     ░░░░░░                           │
│                                       │
└───────────────────────────────────────┘
```

**Rendu visuel :**
- ✅ Fond coloré (couleur du challenge)
- ✅ Icône centrée
- ✅ Bordure épaisse (couleur du challenge)
- ✅ Zone de déclenchement semi-transparente

---

## 🔗 Liaison des Données

### Correspondance ID

```
narrative-tree.json          level-complete.json
─────────────────            ───────────────────
node_1 (ID éditeur)    →     node_1 (originalId)
                             placed_123456 (ID placé)
```

**Pourquoi deux IDs ?**
- `originalId` : Référence au nœud de l'arbre narratif
- `id` : ID unique du placement sur la carte
- Permet de placer plusieurs fois le même challenge

---

### Préservation des Données

Toutes les données narratives sont **préservées** lors du placement :
- ✅ Outcomes (4 conséquences)
- ✅ Connexions narratives
- ✅ Dialogue
- ✅ Type et propriétés

**Nouvelles données ajoutées :**
- ✅ `coordinates` : Position sur la carte
- ✅ `triggerRadius` : Rayon de déclenchement

---

## 🚀 Avantages de cette Architecture

### 1. Séparation des Préoccupations
- **challenge-editor.html** : Narration et storytelling
- **niveau-editor.html** : Design de niveau et placement spatial

### 2. Réutilisabilité
- Un arbre narratif peut être utilisé dans plusieurs niveaux
- Les challenges peuvent être réorganisés sans perdre leur contenu

### 3. Itération Rapide
- Modifiez la narration sans toucher au niveau
- Réagencez le niveau sans perdre les propriétés narratives

### 4. Export Complet
- Un seul fichier `level-complete.json` contient TOUT
- Terrain, objets, challenges, ET arbre narratif

### 5. Validation
- Import validé (structure vérifiée)
- Feedback visuel en temps réel
- Prévention des erreurs (placement multiple)

---

## 📝 Exemple Complet

### 1. Créer l'Arbre (challenge-editor.html)

```
Nœud 1: "Entrée du Donjon" (interaction)
    ├─ success_triumph → Nœud 2
    └─ fail_narrow → Nœud 4

Nœud 2: "Gobelin" (challenge)
    ├─ success_triumph → Nœud 3
    └─ fail_catastrophic → Game Over

Nœud 3: "Trésor" (interaction)
    └─ success_triumph → Victory

Nœud 4: "Piège" (challenge)
    └─ fail_catastrophic → Game Over
```

**Export** : `narrative-tree.json` (3 nœuds, 5 connexions)

---

### 2. Créer le Niveau (niveau-editor.html)

**Import** : `narrative-tree.json`

**Placements :**
- Entrée du Donjon → (5, 5)
- Gobelin → (10, 10)
- Trésor → (15, 10)
- Piège → (10, 15)

**Export** : `level-complete.json`

---

### 3. Structure Finale

```json
{
  "mapFile": "assets/dungeon.png",
  "challenges": [
    {
      "id": "node_1",
      "name": "Entrée du Donjon",
      "coordinates": { "x": 5, "y": 5 },
      "outcomes": { ... }
    },
    {
      "id": "node_2",
      "name": "Gobelin",
      "coordinates": { "x": 10, "y": 10 },
      "outcomes": { ... }
    },
    ...
  ],
  "narrativeTree": {
    "nodes": [ ... ],
    "connections": [
      { "from": "node_1", "fromOutcome": "success_triumph", "to": "node_2" },
      ...
    ]
  }
}
```

**Le jeu peut maintenant :**
- Afficher le niveau avec les challenges aux bonnes positions
- Déclencher les challenges selon le rayon
- Naviguer dans l'arbre selon les choix
- Appliquer les conséquences (outcomes)

---

## 🔧 Maintenance et Modification

### Modifier la Narration Sans Toucher au Niveau

1. Ouvrez `challenge-editor.html`
2. Importez `narrative-tree.json`
3. Modifiez les dialogues et outcomes
4. Exportez `narrative-tree-v2.json`
5. Dans `niveau-editor.html`, importez le nouvel arbre
6. Les challenges déjà placés gardent leurs positions
7. Exportez `level-complete-v2.json`

### Modifier le Niveau Sans Toucher à la Narration

1. Ouvrez `niveau-editor.html`
2. Importez `level-complete.json`
3. Modifiez le terrain, objets
4. Déplacez les challenges
5. Exportez `level-complete-v2.json`
6. Toutes les propriétés narratives sont préservées

---

## 🎓 Bonnes Pratiques

1. **Nommage Cohérent**
   - `narrative-tree-chapter1.json`
   - `level1-complete.json`

2. **Versionnage**
   - Gardez des backups des arbres narratifs
   - Versionnez les niveaux complets

3. **Workflow Itératif**
   - Créez l'arbre narratif d'abord
   - Testez les enchaînements dans l'éditeur
   - Placez ensuite sur le niveau

4. **Validation**
   - Vérifiez que tous les challenges sont placés
   - Testez les rayons de déclenchement
   - Validez les connexions narratives

---

## 📚 Fichiers de Référence

- `challenge-editor.html` : Éditeur d'arbre narratif
- `niveau-editor.html` : Éditeur de niveau (avec onglet Challenges)
- `EDITEURS_README.md` : Guide des éditeurs
- `TESTS_MANUELS.md` : Tests manuels
- `challenge-editor-test.html` : Tests automatisés

---

## 🆘 Dépannage

### L'import d'arbre narratif échoue
- Vérifiez la structure JSON (nodes et connections)
- Assurez-vous que c'est bien un export de challenge-editor.html

### Les challenges ne s'affichent pas sur la carte
- Vérifiez que vous êtes dans l'onglet Challenges
- Assurez-vous d'avoir importé un arbre narratif

### Le challenge ne se place pas
- Cliquez d'abord sur le challenge dans la bibliothèque
- Puis cliquez sur la carte
- Vérifiez que vous êtes dans les limites (0-19, 0-19)

### L'export ne contient pas les challenges
- Vérifiez que vous avez placé des challenges
- Utilisez "Télécharger JSON" dans l'onglet Config

---

## ✅ Validation Finale

Un niveau est complet quand :
- [ ] Arbre narratif créé et exporté
- [ ] Arbre importé dans niveau-editor
- [ ] Tous les challenges placés sur la carte
- [ ] Terrain et objets configurés
- [ ] Export `level-complete.json` effectué
- [ ] JSON contient `challenges` ET `narrativeTree`

---

Bon game design ! 🎮
