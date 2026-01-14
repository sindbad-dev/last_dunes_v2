# 🗺️ Guide de Configuration - Last Dunes

Ce guide explique comment personnaliser votre jeu Last Dunes en ajoutant votre propre carte et en plaçant des challenges.

## 📋 Table des Matières

1. [Ajouter une Carte PNG](#1-ajouter-une-carte-png)
2. [Utiliser l'Éditeur Visuel](#2-utiliser-léditeur-visuel)
3. [Configuration Manuelle (challenges.json)](#3-configuration-manuelle-challengesjson)
4. [Structure du Fichier JSON](#4-structure-du-fichier-json)
5. [Types de Challenges](#5-types-de-challenges)

---

## 1. Ajouter une Carte PNG

### Étape 1: Préparer votre Image

- **Format**: PNG, JPG ou JPEG
- **Dimensions recommandées**: 800x800 pixels (pour s'adapter au canvas)
- **Résolution**: 72-150 DPI suffit pour un jeu web

### Étape 2: Placer l'Image

Copiez votre fichier image dans le dossier `assets/`:

```
/last_dunes_v2
  /assets
    ├── ma_carte.png       <- Votre carte ici
    ├── level1.png
    └── ...
```

### Étape 3: Référencer l'Image

Dans `data/challenges.json`, modifiez la propriété `mapFile`:

```json
{
  "mapFile": "assets/ma_carte.png",
  ...
}
```

---

## 2. Utiliser l'Éditeur Visuel

L'éditeur visuel (`editor.html`) vous permet de placer des challenges visuellement sur votre carte.

### Lancer l'Éditeur

1. Lancez le serveur de développement:
   ```bash
   python3 server.py
   ```

2. Ouvrez dans votre navigateur:
   ```
   http://localhost:8000/editor.html
   ```

### Workflow de l'Éditeur

#### A. Charger votre Carte

**Option 1: Upload de fichier**
- Cliquez sur "Choisir un fichier" dans la section "Carte du Niveau"
- Sélectionnez votre PNG

**Option 2: URL**
- Entrez le chemin de l'image: `assets/ma_carte.png`
- Cliquez sur "Charger URL"

#### B. Configurer la Grille

- **Taille de grille**: Définit la taille des cases en pixels (40px par défaut)
  - Plus petit = plus de précision
  - Plus grand = placement plus rapide

- **Position de départ**: Coordonnées (X, Y) où l'avatar apparaît au début du jeu

#### C. Placer des Challenges

1. **Remplir le formulaire "Nouveau Challenge"**:
   - **Nom**: Nom du challenge (ex: "Le Gardien")
   - **Type**: Challenge, Interaction ou Boss
   - **Icône**: Cliquez sur un emoji ou entrez-en un nouveau
   - **Couleur**: Couleur de surbrillance sur la carte
   - **Rayon de déclenchement**: Nombre de cases autour pour activer le challenge
   - **Dialogue**: Texte affiché quand le challenge apparaît

2. **Placer le Challenge**:
   - Cliquez sur "➕ Placer au prochain clic"
   - Cliquez sur la carte à l'endroit souhaité

3. **Gérer les Challenges**:
   - Tous les challenges placés apparaissent dans "Challenges Placés"
   - Cliquez sur "🗑️ Supprimer" pour retirer un challenge

#### D. Exporter la Configuration

Quand vous avez terminé:

1. **Télécharger le JSON**:
   - Cliquez sur "📥 Télécharger JSON"
   - Sauvegardez le fichier comme `data/challenges.json`

2. **Ou copier dans le presse-papier**:
   - Cliquez sur "📋 Copier JSON"
   - Collez le contenu dans `data/challenges.json`

---

## 3. Configuration Manuelle (challenges.json)

Si vous préférez éditer le fichier JSON manuellement, voici comment procéder.

### Exemple Complet

```json
{
  "mapFile": "assets/ma_carte.png",
  "gridSize": 40,
  "startPos": {"x": 16, "y": 25},
  "challenges": [
    {
      "id": "challenge_unique_1",
      "name": "Le Gardien",
      "type": "challenge",
      "coordinates": {"x": 10, "y": 15},
      "triggerRadius": 1,
      "icon": "⚔️",
      "color": "#ff00ff",
      "description": "Un gardien bloque le passage.",
      "dialogue_preview": "Le gardien vous fixe du regard...",
      "outcomes": {
        "success_narrow": "Vous esquivez et passez.",
        "success_triumph": "Vous le terrassez d'un coup!",
        "fail_narrow": "Vous êtes blessé mais passez.",
        "fail_catastrophic": "Le gardien donne l'alarme!"
      }
    }
  ]
}
```

---

## 4. Structure du Fichier JSON

### Propriétés Racine

| Propriété | Type | Description |
|-----------|------|-------------|
| `mapFile` | string | Chemin vers l'image PNG de la carte |
| `gridSize` | number | Taille d'une case en pixels (40 recommandé) |
| `startPos` | object | Position de départ `{x: number, y: number}` |
| `challenges` | array | Liste des challenges (voir ci-dessous) |

### Propriétés d'un Challenge

| Propriété | Type | Requis | Description |
|-----------|------|--------|-------------|
| `id` | string | ✅ | Identifiant unique (ex: "gate_guard") |
| `name` | string | ✅ | Nom affiché (ex: "Le Gardien") |
| `type` | string | ✅ | Type: "challenge", "interaction", ou "boss" |
| `coordinates` | object | ✅ | Position `{x: number, y: number}` |
| `triggerRadius` | number | ✅ | Rayon d'activation (0-5, généralement 1) |
| `icon` | string | ⚠️ | Emoji affiché sur la carte (défaut: "?") |
| `color` | string | ⚠️ | Couleur hex (défaut: "#ff00ff") |
| `description` | string | ⚠️ | Description longue (pas affichée dans le jeu) |
| `dialogue_preview` | string | ✅ | Texte affiché dans la bulle de dialogue |
| `outcomes` | object | ✅ | Résultats des 4 cartes (voir ci-dessous) |

### Propriétés `outcomes`

Chaque challenge doit avoir 4 résultats possibles:

```json
"outcomes": {
  "success_narrow": "Texte si réussite de justesse (+1 Catastrophe)",
  "success_triumph": "Texte si réussite triomphale (+2 Catastrophe)",
  "fail_narrow": "Texte si échec de justesse (0 Catastrophe)",
  "fail_catastrophic": "Texte si échec catastrophique (forcé si jauge pleine)"
}
```

---

## 5. Types de Challenges

### Challenge (`"type": "challenge"`)

Un obstacle standard à surmonter.

**Exemple**: Gardien, Piège, Énigme

**Icônes suggérées**: ⚔️ 🛡️ 🔒 ⚡

**Couleur suggérée**: `#ff00ff` (magenta)

### Interaction (`"type": "interaction"`)

Un élément du monde avec lequel on peut interagir.

**Exemple**: Puits, Coffre, Levier, PNJ

**Icônes suggérées**: 🪣 📦 🗝️ 💬 🚪

**Couleur suggérée**: `#00ffff` (cyan)

### Boss (`"type": "boss"`)

Un ennemi majeur ou un défi final.

**Exemple**: Nécromancien, Dragon, Boss de fin

**Icônes suggérées**: 💀 🐉 👑 🔥

**Couleur suggérée**: `#ff0000` (rouge)

---

## 📍 Calculer les Coordonnées

### Méthode 1: Avec l'Éditeur (Recommandé)

Utilisez `editor.html` - les coordonnées s'affichent quand vous survolez la carte.

### Méthode 2: Manuellement

La carte est divisée en une grille de **20x20 cases** (800px ÷ 40px).

- **X** va de `0` (gauche) à `19` (droite)
- **Y** va de `0` (haut) à `19` (bas)

**Exemple**:
- Centre de la carte: `{x: 10, y: 10}`
- Coin haut-gauche: `{x: 0, y: 0}`
- Coin bas-droit: `{x: 19, y: 19}`

---

## 🎨 Icônes et Emojis Recommandés

### Combats et Dangers
⚔️ 🗡️ 🛡️ ⚡ 💥 🔥 ☠️ 💀 👻 🧟

### Objets et Interactions
🗝️ 🚪 📜 📦 🪣 💎 💰 🏺 ⚱️ 🕯️

### Personnages
👤 🧙 🧛 🧌 👑 🦴 🧠

### Environnement
🌳 🪨 💧 🌊 ⛰️ 🏰 🗿

---

## 🔧 Dépannage

### L'image ne s'affiche pas

1. Vérifiez que le chemin dans `mapFile` est correct
2. Vérifiez que l'image est bien dans le dossier `assets/`
3. Assurez-vous d'utiliser un serveur HTTP (pas file://)
4. Ouvrez la console (F12) pour voir les erreurs

### Les challenges ne s'affichent pas

1. Vérifiez que `challenges.json` est bien formaté (utilisez un validateur JSON)
2. Vérifiez que les coordonnées sont dans la grille (0-19)
3. Ouvrez la console pour voir les erreurs JavaScript

### Les icônes ne s'affichent pas

Les emojis peuvent ne pas s'afficher selon votre système d'exploitation. Utilisez des emojis simples (⚔️ 💀 🗝️) plutôt que complexes.

---

## 📚 Exemples de Cartes

### Donjon Classique
- Taille de grille: 40px
- Challenges: Gardiens, Pièges, Boss final
- Icônes: ⚔️ 🗡️ 💀

### Exploration Urbaine
- Taille de grille: 40px
- Challenges: PNJs, Événements, Quêtes
- Icônes: 💬 📜 🗝️

### Aventure Naturelle
- Taille de grille: 50px (carte plus grande)
- Challenges: Animaux, Obstacles naturels
- Icônes: 🐺 🌳 ⛰️

---

## ✅ Checklist de Configuration

- [ ] Image PNG de la carte dans `assets/`
- [ ] `mapFile` mis à jour dans `challenges.json`
- [ ] `gridSize` approprié (40 recommandé)
- [ ] `startPos` définie
- [ ] Au moins 1 challenge placé
- [ ] Chaque challenge a:
  - [ ] Un `id` unique
  - [ ] Des `coordinates` valides
  - [ ] Un `dialogue_preview`
  - [ ] Les 4 `outcomes` définis
- [ ] Fichier JSON validé (pas d'erreurs de syntaxe)
- [ ] Testé dans `editor.html`
- [ ] Testé dans le jeu (`index.html`)

---

**Astuce**: Commencez simple avec 3-5 challenges, puis ajoutez-en progressivement une fois que le système fonctionne!
