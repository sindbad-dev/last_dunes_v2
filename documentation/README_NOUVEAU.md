# 🎮 Last Dunes - Prototype avec Éditeur de Niveaux

## 🆕 Nouvelles Fonctionnalités

### 1. 🗺️ Support des Cartes PNG Personnalisées

Vous pouvez maintenant utiliser **vos propres images PNG** comme carte de niveau!

**Formats supportés**: PNG, JPG, JPEG
**Dimensions recommandées**: 800x800 pixels

### 2. 📝 Fichier de Configuration Séparé

Les challenges sont maintenant dans un fichier séparé: `data/challenges.json`

**Avantages**:
- Modification facile des challenges sans toucher au code
- Support des icônes emoji personnalisées
- Couleurs personnalisables pour chaque type de challenge
- Configuration claire de la grille et des positions

### 3. 🎨 Éditeur Visuel de Niveaux

Un éditeur graphique complet pour créer vos niveaux sans écrire de JSON!

**Fonctionnalités**:
- ✅ Chargement d'images PNG par upload ou URL
- ✅ Placement visuel des challenges par clic
- ✅ Aperçu en temps réel
- ✅ Sélection d'icônes emoji
- ✅ Personnalisation des couleurs
- ✅ Export JSON automatique
- ✅ Import/Export de configurations

**Accès**: `http://localhost:8000/editor.html`

---

## 🚀 Démarrage Rapide

### 1. Lancer le Serveur

```bash
# Windows
START_SERVER.bat

# Linux/Mac
./start_server.sh

# Ou manuellement
python3 server.py
```

### 2. Ouvrir le Jeu

Navigateur: `http://localhost:8000`

### 3. Créer votre Premier Niveau (Optionnel)

1. Ouvrez l'éditeur: `http://localhost:8000/editor.html`
2. Chargez votre image PNG
3. Placez des challenges en cliquant
4. Téléchargez le JSON généré
5. Sauvegardez-le comme `data/challenges.json`
6. Relancez le jeu!

---

## 📁 Structure du Projet

```
/last_dunes_v2
├── index.html              # Jeu principal
├── editor.html             # ⭐ NOUVEAU: Éditeur de niveaux
├── test.html               # Page de diagnostic
├── server.py               # Serveur HTTP
├── START_SERVER.bat        # Script Windows
├── start_server.sh         # Script Linux/Mac
│
├── /assets                 # Images de cartes
│   ├── level1.svg          # ⭐ NOUVEAU: Exemple SVG
│   └── [vos PNG ici]       # Vos cartes personnalisées
│
├── /css
│   └── style.css           # Styles (canvas supporté)
│
├── /data
│   ├── challenges.json     # ⭐ NOUVEAU: Config des challenges
│   └── level1.json         # Mécaniques de jeu (cartes, etc.)
│
├── /js
│   ├── main.js             # ⭐ MODIFIÉ: Charge challenges.json
│   ├── mapEngine.js        # ⭐ MODIFIÉ: Affiche icônes et couleurs
│   ├── gameLogic.js        # Logique de jeu
│   └── uiManager.js        # Interface utilisateur
│
└── GUIDE_CONFIGURATION.md  # ⭐ NOUVEAU: Guide complet
```

---

## 📖 Guides Disponibles

| Fichier | Description |
|---------|-------------|
| **GUIDE_CONFIGURATION.md** | Guide complet pour personnaliser le jeu |
| **COMMENT_LANCER.md** | Instructions de lancement |
| **TEST_INSTRUCTIONS.md** | Critères de validation du prototype |
| **README_NOUVEAU.md** | Ce fichier (nouvelles fonctionnalités) |

---

## 🎨 Personnalisation

### Option 1: Éditeur Visuel (Recommandé)

1. Ouvrez `http://localhost:8000/editor.html`
2. Suivez les instructions à l'écran
3. Exportez votre configuration

### Option 2: Édition Manuelle

Modifiez directement `data/challenges.json`:

```json
{
  "mapFile": "assets/ma_carte.png",
  "gridSize": 40,
  "startPos": {"x": 16, "y": 25},
  "challenges": [
    {
      "id": "mon_challenge",
      "name": "Le Gardien",
      "type": "challenge",
      "coordinates": {"x": 10, "y": 15},
      "triggerRadius": 1,
      "icon": "⚔️",
      "color": "#ff00ff",
      "dialogue_preview": "Un gardien vous bloque le passage...",
      "outcomes": {
        "success_narrow": "Vous passez de justesse.",
        "success_triumph": "Vous triomphez!",
        "fail_narrow": "Vous échouez mais survivez.",
        "fail_catastrophic": "Échec total."
      }
    }
  ]
}
```

Voir **GUIDE_CONFIGURATION.md** pour plus de détails.

---

## 🎮 Nouvelles Fonctionnalités Visuelles

### Icônes Emoji sur la Carte

Les challenges affichent maintenant des **emojis** au lieu de simples carrés:

- ⚔️ Challenges de combat
- 🪣 Interactions (puits, objets)
- 💀 Boss
- 🗝️ Objets clés
- Et beaucoup d'autres!

### Couleurs Personnalisées

Chaque challenge peut avoir sa propre couleur:

- **Magenta** (#ff00ff): Challenges standard
- **Cyan** (#00ffff): Interactions
- **Rouge** (#ff0000): Boss
- **Personnalisé**: Votre choix!

---

## 🔧 Améliorations Techniques

### Support PNG/JPG Complet

- ✅ Chargement d'images locales
- ✅ Chargement par URL
- ✅ Fallback sur grille si image manquante
- ✅ Gestion d'erreurs améliorée

### Système de Configuration Flexible

- ✅ Fichier `challenges.json` séparé
- ✅ Fallback sur `level1.json` si absent
- ✅ Validation JSON avec messages d'erreur clairs
- ✅ Console de debug détaillée

### Éditeur de Niveaux

- ✅ Interface WYSIWYG complète
- ✅ Affichage de la grille avec coordonnées
- ✅ Position souris en temps réel
- ✅ Gestion des challenges (ajout/suppression)
- ✅ Export JSON en un clic
- ✅ Import de configurations existantes

---

## 📍 Exemples de Cartes

### Carte Exemple Fournie

Un fichier SVG exemple est fourni: `assets/level1.svg`

**Pour l'utiliser**:
1. Convertir le SVG en PNG (avec un outil en ligne ou Inkscape)
2. Placer le PNG dans `assets/`
3. Référencer dans `challenges.json`

**Ou**: Ouvrez le SVG dans un éditeur et modifiez-le directement!

### Créer votre Propre Carte

**Option A: Logiciels de Dessin**
- GIMP (gratuit)
- Photoshop
- Paint.NET
- Krita

**Option B: Pixel Art**
- Aseprite
- Piskel
- Pixilart

**Option C: Générateurs**
- Dungeon Scrawl (générateur de donjons)
- Dungeondraft
- Inkarnate

**Dimensions**: 800x800 pixels minimum
**Format**: PNG ou JPG

---

## 🎯 Workflow Complet

### Créer un Niveau de A à Z

1. **Créer la Carte**
   - Dessinez votre carte (800x800px)
   - Sauvegardez en PNG
   - Placez dans `assets/`

2. **Placer les Challenges**
   - Lancez `editor.html`
   - Chargez votre PNG
   - Cliquez pour placer des challenges
   - Configurez les propriétés

3. **Exporter la Configuration**
   - Cliquez "Télécharger JSON"
   - Sauvegardez comme `data/challenges.json`

4. **Personnaliser les Textes**
   - Ouvrez `data/challenges.json`
   - Modifiez les dialogues et résultats
   - Sauvegardez

5. **Tester**
   - Lancez le jeu (`index.html`)
   - Jouez et vérifiez tout
   - Ajustez si nécessaire

---

## 🐛 Dépannage

### La carte ne s'affiche pas

**Vérifiez**:
1. Le chemin dans `mapFile` est correct
2. L'image est bien dans `assets/`
3. Vous utilisez un serveur HTTP (pas `file://`)
4. La console (F12) pour voir les erreurs

### Les challenges ne sont pas visibles

**Vérifiez**:
1. `challenges.json` est valide (utilisez JSONLint)
2. Les coordonnées sont entre 0-19
3. La console pour voir les erreurs

### L'éditeur ne fonctionne pas

**Vérifiez**:
1. Vous utilisez un serveur HTTP
2. Votre navigateur est à jour
3. JavaScript est activé
4. La console pour voir les erreurs

---

## 📊 Compatibilité

### Format de Fichier

Le jeu charge **deux fichiers**:
- `data/challenges.json`: Carte et challenges (**nouveau**)
- `data/level1.json`: Mécaniques de jeu (existant)

Si `challenges.json` n'existe pas, le jeu utilise `level1.json` pour tout (mode classique).

### Rétrocompatibilité

✅ Les anciens fichiers `level1.json` fonctionnent toujours
✅ Vous pouvez utiliser l'ancien système ou le nouveau
✅ Transition progressive possible

---

## 🎓 Ressources

### Icônes Emoji Recommandées

**Combat**: ⚔️ 🗡️ 🛡️ ⚡ 💥
**Dangers**: 🔥 ☠️ 💀 👻 🧟
**Objets**: 🗝️ 📜 💎 💰 🏺
**Lieux**: 🚪 🪣 🕯️ 🗿 ⛰️
**Personnages**: 👤 🧙 🧛 👑 🦴

### Palettes de Couleurs

**Challenges**: #ff00ff, #cc00cc, #ff66ff
**Interactions**: #00ffff, #00cccc, #66ffff
**Boss**: #ff0000, #cc0000, #ff6666
**Secrets**: #ffff00, #cccc00, #ffff66

---

## ✅ Checklist de Validation

### Avant de Partager votre Niveau

- [ ] L'image PNG est dans `assets/`
- [ ] `challenges.json` est valide (JSON)
- [ ] Au moins 1 challenge placé
- [ ] Tous les challenges ont les 4 outcomes
- [ ] La position de départ est accessible
- [ ] Testé dans l'éditeur
- [ ] Testé dans le jeu
- [ ] Tous les challenges sont jouables
- [ ] La jauge de catastrophe fonctionne
- [ ] L'écran Yggdrasil s'affiche

---

## 🙏 Contribution

Pour signaler un bug ou suggérer une fonctionnalité:
- Ouvrez une issue sur GitHub
- Décrivez le problème clairement
- Fournissez des captures d'écran si possible

---

## 🎉 Bon Jeu!

Vous avez maintenant tous les outils pour créer vos propres aventures dans Last Dunes!

**N'hésitez pas à**:
- Expérimenter avec différentes cartes
- Créer des challenges créatifs
- Partager vos créations
- Personnaliser le système

**Amusez-vous bien!** 🏜️
