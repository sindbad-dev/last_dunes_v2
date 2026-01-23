# 🧪 Instructions de Test - Images dans les Challenges

## Fichiers de test créés

### 1. **assets/gobelin-test.svg**
- Image SVG de test avec le gobelin 👺
- Dimensions: 750x500px (grande taille pour excellente lisibilité)
- Effets: Dégradés, lueur, bordures dorées multiples
- Style: Thème sombre avec visuels améliorés

### 2. **test-image.html**
- Page de test dédiée pour vérifier le chargement des images
- Accessible à: `http://localhost:8000/test-image.html`
- Tests inclus:
  - ✓ Chargement de gobelin-test.svg
  - ✓ Chargement de level1.svg
  - ✓ Simulation visuelle du challenge dans le jeu

### 3. **Modifications du jeu**
- `data/level-complete.json` : Le premier challenge utilise maintenant `assets/gobelin-test.svg`
- `js/main.js` : Ajout du support de la propriété `image` dans l'enrichissement des challenges

## Comment tester

### Test 1: Page de test dédiée
```bash
# Démarrer le serveur
python3 server.py

# Ouvrir dans le navigateur
http://localhost:8000/test-image.html
```

**Résultat attendu:**
- ✓ Les 3 images doivent s'afficher correctement
- ✓ Le message "Image chargée avec succès !" s'affiche en vert
- ✓ La simulation du challenge montre l'image correctement positionnée

### Test 2: Jeu complet
```bash
# Démarrer le serveur (si pas déjà fait)
python3 server.py

# Ouvrir le jeu
http://localhost:8000/index.html
```

**Résultat attendu:**
1. Le jeu se charge normalement
2. Quand vous rencontrez le premier challenge "Le Gobelin" 👺
3. L'image `gobelin-test.svg` doit apparaître:
   - **Sous** la bulle de dialogue
   - Avec des bordures dorées subtiles et effets visuels
   - **Taille maximale de 750px de large et 500px de haut (grande et très lisible)**
   - Proportions préservées (object-fit: contain)
   - Image centrée avec un bon contraste

### Test 3: Éditeur de challenges
```bash
# Ouvrir l'éditeur
http://localhost:8000/challenge-editor.html
```

**Résultat attendu:**
1. Créer ou sélectionner un challenge
2. Dans la section "Image du challenge"
3. Sélectionner "Fichier local (assets/)"
4. Entrer: `gobelin-test.svg`
5. Sauvegarder
6. L'image doit être sauvegardée comme `assets/gobelin-test.svg` dans le JSON

## Structure des fichiers

```
last_dunes_v2/
├── assets/
│   ├── gobelin-test.svg     ← Nouvelle image de test
│   └── level1.svg            ← Existante
├── data/
│   └── level-complete.json   ← Mis à jour avec image locale
├── js/
│   └── main.js               ← Mis à jour pour supporter les images
└── test-image.html           ← Page de test
```

## Vérifications techniques

### Dans level-complete.json
```json
{
  "id": "node_0",
  "name": "Le Gobelin",
  "image": "assets/gobelin-test.svg",  ← Chemin local
  ...
}
```

### Dans main.js (ligne 44)
```javascript
image: node.image || challenge.image,  ← Propriété ajoutée
```

### Dans uiManager.js (lignes 500-507)
```javascript
if (challengeData.image) {
    imageContainer.innerHTML = `<img src="${challengeData.image}" alt="${challengeData.name}">`;
    imageContainer.style.display = 'flex';
} else {
    imageContainer.innerHTML = '';
    imageContainer.style.display = 'none';
}
```

## Dépannage

### L'image ne s'affiche pas
1. Vérifier que le serveur est démarré: `python3 server.py`
2. Vérifier que le fichier existe: `ls -la assets/gobelin-test.svg`
3. Ouvrir la console du navigateur (F12) pour voir les erreurs
4. Vérifier le chemin dans le JSON: doit être `assets/gobelin-test.svg` (pas `./assets/` ou `/assets/`)

### Erreur 404
- Le serveur SimpleHTTPRequestHandler sert tous les fichiers depuis la racine
- Le chemin doit être relatif: `assets/filename.svg` ✓
- Pas de slash initial: `/assets/filename.svg` ✗

## Types d'images supportés

- ✓ SVG (vectoriel, recommandé)
- ✓ PNG (raster, bonne qualité)
- ✓ JPG/JPEG (raster, photos)
- ✓ GIF (raster, animations)
- ✓ WebP (moderne, performant)

## Recommandations

- **Dimensions recommandées:** 750x500px (ratio 3:2) pour une excellente lisibilité
- **Dimensions maximales affichées:** 750px largeur × 500px hauteur
- **Format recommandé:** SVG pour les illustrations, PNG pour les images avec transparence
- **Taille de fichier:** < 500 KB pour des temps de chargement rapides
- **Nom de fichier:** utiliser des noms descriptifs en minuscules sans espaces
- **Conseil:** Les images plus grandes sont automatiquement redimensionnées en préservant les proportions

## Résultat final

Si tous les tests passent, vous devriez voir:
1. ✅ L'image se charge dans test-image.html
2. ✅ L'image apparaît dans le jeu sous la description
3. ✅ L'éditeur permet d'ajouter facilement des images locales
4. ✅ Les proportions sont bien respectées
5. ✅ L'interface reste cohérente et élégante
