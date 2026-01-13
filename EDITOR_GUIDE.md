# 🎨 Guide de l'Éditeur de Cartes - Last Dunes

## 🆕 Nouvelles Fonctionnalités

L'éditeur dispose maintenant de **4 onglets** pour créer des cartes complètes:

1. **Terrain** 🧱💧 - Dessiner des murs et de l'eau
2. **Objets** 🪑🔥 - Placer des objets décoratifs
3. **Challenges** ⚔️ - Configurer les défis du jeu
4. **Config** ⚙️ - Paramètres généraux

---

## 📐 Onglet 1: Terrain

### Outils Disponibles

| Outil | Icône | Raccourci | Description |
|-------|-------|-----------|-------------|
| **Mur** | 🧱 | - | Bloque le passage du joueur |
| **Eau** | 💧 | - | Bloque le passage du joueur |
| **Gomme** | 🗑️ | - | Efface terrain et objets |

### Utilisation

1. **Cliquez** sur un outil (Mur / Eau / Gomme)
2. **Cliquez** sur la carte pour placer/effacer
3. **Mode Pinceau** ☑️: Cochez pour dessiner en glissant la souris

#### Mode Pinceau

- ☐ **Désactivé**: Un clic = une case
- ☑️ **Activé**: Clic + glisser = tracé continu

### Statistiques

L'éditeur affiche en temps réel:
- Nombre de murs
- Nombre de cases d'eau
- Boutons pour effacer tout

### Exemple de Donjon

```
🧱🧱🧱🧱🧱🧱🧱
🧱      🧱
🧱  💧💧  🧱
🧱  💧💧  🧱
🧱      🧱
🧱🧱🧱🧱🧱🧱🧱
```

---

## 🪑 Onglet 2: Objets

### Bibliothèque d'Objets (18 emojis)

#### Mobilier & Décoration
- 🚪 **Porte** - Entrée/sortie
- 🪑 **Chaise** - Mobilier
- 🛏️ **Lit** - Repos
- 🔥 **Cheminée** - Feu
- 🪟 **Fenêtre** - Ouverture

#### Éclairage
- 🪔 **Lampe** - Source de lumière
- 🕯️ **Bougie** - Lumière faible

#### Contenu & Objets
- 📦 **Coffre** - Contenant
- 📜 **Parchemin** - Document
- 📚 **Livres** - Bibliothèque
- 🗝️ **Clé** - Objet important

#### Trésors & Armes
- ⚔️ **Épée** - Arme
- 🛡️ **Bouclier** - Protection

#### Décoration Antique
- ⚱️ **Urne** - Vase funéraire
- 🏺 **Vase** - Poterie
- ⛓️ **Chaînes** - Prison
- 🦴 **Os** - Macabre
- 🪜 **Échelle** - Accès vertical

### Utilisation

1. **Cliquez** sur un emoji dans la bibliothèque
2. **Cliquez** sur la carte pour le placer
3. L'objet **remplace** tout objet déjà présent à cet emplacement

### Emoji Personnalisé

Vous pouvez utiliser **n'importe quel emoji**:

1. Entrez l'emoji dans le champ "Ou entrez un emoji"
2. Cliquez sur "Utiliser"
3. Placez-le sur la carte

**Exemples d'emojis utiles**:
- 🎭 🎪 🎨 🎯 🎲 🃏 (Jeux)
- 🏛️ ⛩️ 🗼 🏰 🏟️ (Bâtiments)
- 🌳 🌲 🌴 🌿 ☘️ (Nature)
- 💀 👻 🧟 🧛 🧙 (Personnages)
- 💎 💰 🏆 👑 (Trésors)

---

## ⚔️ Onglet 3: Challenges

Même fonctionnement qu'avant, mais dans un onglet séparé.

### Créer un Challenge

1. Remplir le formulaire:
   - **Nom**: Ex: "Le Gardien"
   - **Type**: Challenge / Interaction / Boss
   - **Icône**: Sélectionner ou entrer un emoji
   - **Couleur**: Couleur de surbrillance
   - **Rayon**: Distance d'activation (0-5)
   - **Dialogue**: Texte affiché

2. Cliquer sur "➕ Placer au prochain clic"
3. Cliquer sur la carte

### Liste des Challenges

Tous les challenges placés sont listés avec:
- Position
- Type et rayon
- Bouton supprimer

---

## ⚙️ Onglet 4: Config

### Carte du Niveau

- **Upload PNG**: Charger depuis votre ordinateur
- **URL**: Charger depuis un chemin (ex: `assets/ma_carte.png`)

### Configuration

- **Taille de grille**: 10-100px (40px recommandé)
- **Position de départ**: Coordonnées X, Y du spawn

### Export / Import

#### Exporter

- **📥 Télécharger JSON**: Sauvegarde `challenges.json`
- **📋 Copier JSON**: Copie dans le presse-papier

#### Importer

- Cliquez sur "Choisir un fichier"
- Sélectionnez un fichier `challenges.json`
- Tout est chargé automatiquement

---

## 🎮 Workflow Complet

### Créer une Carte de A à Z

#### Étape 1: Base de la Carte (Config)
```
1. Onglet "Config"
2. Charger une image PNG (ou travailler sans)
3. Régler la taille de grille (40px par défaut)
4. Définir la position de départ
```

#### Étape 2: Dessiner le Terrain
```
1. Onglet "Terrain"
2. Sélectionner "Mur" 🧱
3. Activer "Mode Pinceau"
4. Dessiner les contours du donjon
5. Sélectionner "Eau" 💧
6. Dessiner les rivières/lacs
```

#### Étape 3: Placer les Objets
```
1. Onglet "Objets"
2. Cliquer sur "Porte" 🚪
3. Placer aux entrées
4. Cliquer sur "Coffre" 📦
5. Placer dans les salles
6. Ajouter cheminées, meubles, etc.
```

#### Étape 4: Ajouter les Challenges
```
1. Onglet "Challenges"
2. Configurer le premier challenge
3. Placer sur la carte
4. Répéter pour chaque challenge
```

#### Étape 5: Exporter
```
1. Onglet "Config"
2. Cliquer "📥 Télécharger JSON"
3. Sauvegarder comme "data/challenges.json"
```

#### Étape 6: Tester
```
1. Lancer python3 server.py
2. Ouvrir http://localhost:8000
3. Jouer et vérifier tout fonctionne
```

---

## 🎯 Exemples de Cartes

### Donjon Simple

```
Position de départ: (1, 1)
Murs: Contour complet
Eau: Puits central
Objets:
  - 🚪 Porte en (5, 0)
  - 🔥 Cheminée en (1, 1)
  - 📦 Coffre en (8, 8)
Challenges:
  - ⚔️ Gardien en (5, 5)
```

### Château Fort

```
Position de départ: (10, 18)
Murs: 4 tours + remparts
Eau: Douves autour
Objets:
  - 👑 Trône salle du roi
  - 🛏️ Lits chambres
  - 📚 Bibliothèque
  - 🪔 Torches murales
Challenges:
  - 💀 Boss salle du trône
```

### Forêt Enchantée

```
Position de départ: (0, 10)
Murs: Aucun (forêt ouverte)
Eau: Rivière traversante
Objets:
  - 🌳 Arbres partout
  - 🪵 Cabane en bois
  - 🔥 Feu de camp
Challenges:
  - 🐺 Loups dans forêt
  - 🧙 Sorcier à la cabane
```

---

## 🔥 Astuces Pro

### Dessiner Vite

1. **Activer "Mode Pinceau"** pour tracer des lignes
2. **Murs**: Dessiner d'abord le contour, puis remplir
3. **Eau**: Faire des formes organiques avec le pinceau
4. **Gomme**: Corriger rapidement les erreurs

### Placer Stratégiquement

#### Murs 🧱
- **Créer des couloirs**: Murs parallèles
- **Salles fermées**: Encadrer complètement
- **Labyrinthes**: Chemins tortueux

#### Eau 💧
- **Douves**: Autour d'un château
- **Rivières**: Traversent la carte
- **Lacs**: Zones circulaires
- **Ponts**: Laisser 1-2 cases de passage

#### Objets
- **Cohérence**: Cheminée + chaises = salon
- **Guidage**: Objets indiquent la direction
- **Ambiance**: Os + chaînes = prison

### Organisation

1. **Tracer les murs en premier** (structure)
2. **Ajouter l'eau ensuite** (obstacles)
3. **Placer les objets décoratifs** (ambiance)
4. **Finir par les challenges** (gameplay)

---

## 🐛 Résolution de Problèmes

### Les objets ne s'affichent pas dans le jeu

**Vérifiez**:
1. `challenges.json` contient la propriété `objects`
2. Le serveur HTTP est lancé
3. La console (F12) n'affiche pas d'erreurs

### Les collisions ne fonctionnent pas

**Vérifiez**:
1. Les murs/eau sont dans `walls` et `water`
2. `mapEngine.js` est à jour
3. La fonction `loadTerrain()` est appelée

### L'éditeur est lent

**Solutions**:
1. Réduire la taille de l'image de fond
2. Ne pas dessiner trop de murs (>500)
3. Fermer les autres onglets du navigateur

### Mode Pinceau ne fonctionne pas

**Vérifiez**:
1. La case "Mode Pinceau" est cochée ☑️
2. Vous maintenez le clic enfoncé
3. Vous ne sortez pas du canvas

---

## 📊 Limites Techniques

### Carte
- Taille: 800x800 pixels (canvas)
- Grille: 20x20 cases (avec gridSize=40)
- Format image: PNG, JPG, JPEG

### Éléments
- **Murs**: Illimité (recommandé <500)
- **Eau**: Illimité (recommandé <300)
- **Objets**: Illimité (recommandé <100)
- **Challenges**: Illimité (recommandé <20)

### Performance

| Éléments | Performance |
|----------|-------------|
| 0-100 | ✅ Excellent |
| 100-500 | ✅ Bon |
| 500-1000 | ⚠️ Moyen |
| 1000+ | ❌ Lent |

---

## 🎨 Exemples Visuels

### Donjon Classique

```
🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱
🧱🪔            🚪🧱
🧱          ⚔️  🧱
🧱    💧💧    🧱
🧱    💧💧    🧱
🧱  🪑  🔥  📦  🧱
🧱              🧱
🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱
```

### Trône du Boss

```
🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱
🧱🪔    🚪    🪔🧱
🧱              🧱
🧱  ⛓️        ⛓️  🧱
🧱      👑      🧱
🧱      💀      🧱
🧱  🦴        🦴  🧱
🧱              🧱
🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱
```

### Salle de Trésor

```
🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱
🧱🚪            🧱
🧱  💎  💰  💎  🧱
🧱              🧱
🧱  📦  🏆  📦  🧱
🧱              🧱
🧱  💎  💰  💎  🧱
🧱        💀    🧱
🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱
```

---

## ✅ Checklist de Carte Complète

### Avant l'Export

- [ ] Carte de fond chargée (optionnel)
- [ ] Taille de grille configurée
- [ ] Position de départ définie
- [ ] Position de départ accessible (pas sur un mur)
- [ ] Murs tracés sans trous non voulus
- [ ] Eau placée logiquement
- [ ] Objets décoratifs ajoutés
- [ ] Au moins 1 challenge placé
- [ ] Tous les challenges ont des outcomes
- [ ] Testé dans l'éditeur (rendu visuel OK)

### Après l'Export

- [ ] Fichier `challenges.json` sauvegardé dans `data/`
- [ ] Testé dans le jeu (`http://localhost:8000`)
- [ ] Avatar peut se déplacer
- [ ] Collisions murs/eau fonctionnent
- [ ] Objets visibles
- [ ] Challenges déclenchables

---

## 🚀 Aller Plus Loin

### Combiner Plusieurs Techniques

**Labyrinthe**:
- Murs pour les parois
- Eau pour des fosses mortelles
- Torches pour guider

**Château**:
- Murs pour les fortifications
- Objets pour décorer les salles
- Eau pour les douves

**Grotte**:
- Pas de murs (grotte ouverte)
- Eau pour rivière souterraine
- Os et chaînes pour ambiance

### Créer des Énigmes Visuelles

- Placer des indices avec objets (🗝️ → 🚪)
- Créer des chemins cachés (fausses portes)
- Utiliser la couleur des challenges pour indiquer difficulté

---

**Bon design!** 🎨🗺️
