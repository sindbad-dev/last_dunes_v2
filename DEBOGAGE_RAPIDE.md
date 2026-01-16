# 🔧 Guide de Débogage Rapide - Level Complete

## Problème : main.js ne charge pas level-complete.json

### ✅ Solution Implémentée

Le code de `js/main.js` a été modifié pour :
1. ✅ Charger `level-complete.json` en **priorité**
2. ✅ Fallback sur `challenges.json` si level-complete absent
3. ✅ Fallback final sur `level1.json`
4. ✅ Enrichir automatiquement les challenges avec l'arbre narratif
5. ✅ Afficher des logs détaillés dans la console

---

## 🚀 Comment Tester Maintenant

### Méthode 1 : Utiliser le Fichier Exemple (Rapide)

Un fichier `data/level-complete.json` exemple a été créé pour vous.

**Étapes** :
```bash
# 1. Vérifiez que le fichier existe
ls -la data/level-complete.json

# 2. Lancez un serveur web
python3 -m http.server 8000

# 3. Ouvrez votre navigateur
# http://localhost:8000
```

**Résultat Attendu** :
- Le jeu démarre
- Dans la console (F12), vous voyez :
```
📦 Utilisation de level-complete.json (format complet avec arbre narratif)
🗺️ Carte chargée: assets/level1.png
🔄 Enrichissement de 2 challenges avec l'arbre narratif
✅ Challenge enrichi: Le Gobelin (node_0)
✅ Challenge enrichi: Le Gardien (node_1)
🌳 2 challenges enrichis avec l'arbre narratif
✅ 2 challenges chargés depuis level-complete.json
📍 Source: level-complete.json
```

---

### Méthode 2 : Utiliser Votre Propre Fichier

**Étapes** :
1. Ouvrez `challenge-editor.html`
2. Créez votre arbre narratif
3. Exportez → `narrative-tree.json`
4. Ouvrez `niveau-editor.html`
5. Importez `narrative-tree.json`
6. Placez les challenges sur la carte
7. Exportez → `level-complete.json`
8. **Placez le fichier** : `cp ~/Downloads/level-complete.json data/`
9. Rechargez le jeu

---

## 🔍 Vérifications Console

Ouvrez la console du navigateur (F12) et vérifiez :

### 1. Chargement des Fichiers

```
Fichiers chargés: {
  levelComplete: "✅",  ← Doit être ✅
  challenges: "✅",
  level1: "✅"
}
```

Si `levelComplete` est ❌, le fichier n'est pas trouvé.

### 2. Source Utilisée

```
📦 Utilisation de level-complete.json (format complet avec arbre narratif)
```

Si vous voyez `challenges.json` ou `level1.json`, c'est que le fichier n'est pas au bon endroit.

### 3. Enrichissement des Challenges

```
🔄 Enrichissement de X challenges avec l'arbre narratif
✅ Challenge enrichi: Le Gobelin (node_0)
✅ Challenge enrichi: Le Gardien (node_1)
```

Si vous ne voyez pas ces lignes, l'arbre narratif n'est pas présent dans le JSON.

### 4. Chargement Final

```
✅ 2 challenges chargés depuis level-complete.json
📍 Source: level-complete.json
✅ Jeu démarré avec succès!
```

---

## ❌ Erreurs Courantes

### Erreur 1 : `404 Not Found - level-complete.json`

**Cause** : Le fichier n'est pas dans `data/`

**Solution** :
```bash
# Vérifiez que le fichier existe
ls -la data/level-complete.json

# Si absent, copiez-le
cp ~/Downloads/level-complete.json data/
```

---

### Erreur 2 : `levelComplete: "❌"` dans la console

**Cause** : Le fichier n'existe pas ou est mal nommé

**Solution** :
```bash
# Le nom doit être EXACTEMENT :
data/level-complete.json

# Pas :
data/level_complete.json  ❌
data/levelcomplete.json   ❌
data/Level-Complete.json  ❌
```

---

### Erreur 3 : `Unexpected token` ou `JSON parse error`

**Cause** : Le JSON est invalide

**Solution** :
```bash
# Validez le JSON
cat data/level-complete.json | jq .

# Ou utilisez https://jsonlint.com/
```

---

### Erreur 4 : Pas d'enrichissement avec l'arbre narratif

**Cause** : La propriété `narrativeTree` est absente ou vide

**Console** :
```
⚠️ Pas d'arbre narratif fourni, utilisation des challenges bruts
```

**Solution** :
1. Vérifiez que vous avez exporté depuis `niveau-editor.html` (pas challenge-editor)
2. Vérifiez que vous avez importé l'arbre narratif dans niveau-editor avant d'exporter
3. Ouvrez le JSON et vérifiez la présence de :
```json
{
  "narrativeTree": {
    "nodes": [...],
    "connections": [...]
  }
}
```

---

### Erreur 5 : `CORS error` ou `file://` bloqué

**Cause** : Vous avez ouvert le HTML directement (pas via serveur)

**Solution** :
```bash
# Lancez TOUJOURS un serveur local
python3 -m http.server 8000

# Puis ouvrez
http://localhost:8000
```

---

## 🧪 Tests de Validation

### Test 1 : Vérifier le Fichier

```bash
# Le fichier doit exister
test -f data/level-complete.json && echo "✅ Fichier existe" || echo "❌ Fichier absent"

# Le JSON doit être valide
cat data/level-complete.json | jq . > /dev/null && echo "✅ JSON valide" || echo "❌ JSON invalide"
```

### Test 2 : Vérifier la Structure

```bash
# Doit avoir les propriétés essentielles
cat data/level-complete.json | jq 'has("mapFile", "gridSize", "startPos", "challenges", "narrativeTree")'
# Doit afficher: true
```

### Test 3 : Compter les Challenges

```bash
# Nombre de challenges
cat data/level-complete.json | jq '.challenges | length'

# Nombre de nœuds narratifs
cat data/level-complete.json | jq '.narrativeTree.nodes | length'

# Ces deux nombres doivent correspondre !
```

### Test 4 : Vérifier les IDs

```bash
# IDs des challenges
cat data/level-complete.json | jq '.challenges[].id'

# IDs des nœuds narratifs
cat data/level-complete.json | jq '.narrativeTree.nodes[].id'

# Les IDs doivent correspondre !
```

---

## 🔧 Commandes de Débogage

### Afficher la Structure du Fichier

```bash
cat data/level-complete.json | jq 'keys'
# Résultat attendu:
# [
#   "challenges",
#   "gridSize",
#   "mapFile",
#   "narrativeTree",
#   "objects",
#   "startPos",
#   "walls",
#   "water"
# ]
```

### Afficher les Challenges

```bash
cat data/level-complete.json | jq '.challenges[] | {id, coordinates, name: .name}'
```

### Afficher l'Arbre Narratif

```bash
cat data/level-complete.json | jq '.narrativeTree.nodes[] | {id, name, type}'
```

### Vérifier la Correspondance

```bash
# IDs des challenges
CHALLENGES=$(cat data/level-complete.json | jq -r '.challenges[].id' | sort)

# IDs des nœuds
NODES=$(cat data/level-complete.json | jq -r '.narrativeTree.nodes[].id' | sort)

# Comparer
diff <(echo "$CHALLENGES") <(echo "$NODES")
# Si rien ne s'affiche, les IDs correspondent ✅
```

---

## 📊 Logs Console Complets

### Exemple de Logs Corrects

```
Last Dunes - Initialisation...
Fichiers chargés: {levelComplete: "✅", challenges: "✅", level1: "✅"}
📦 Utilisation de level-complete.json (format complet avec arbre narratif)
🗺️ Carte chargée: assets/level1.png
🌍 Terrain chargé: 0 murs, 0 eau, 0 objets
🔄 Enrichissement de 2 challenges avec l'arbre narratif
✅ Challenge enrichi: Le Gobelin (node_0)
✅ Challenge enrichi: Le Gardien (node_1)
🌳 2 challenges enrichis avec l'arbre narratif
✅ 2 challenges chargés depuis level-complete.json
✅ Jeu démarré avec succès!
📍 Source: level-complete.json
```

### Exemple de Logs avec Fallback (Normal)

Si `level-complete.json` n'existe pas :

```
Fichiers chargés: {levelComplete: "❌", challenges: "✅", level1: "✅"}
📦 Utilisation de challenges.json (ancien format)
🗺️ Carte chargée: assets/level1.png
⚠️ Pas d'arbre narratif fourni, utilisation des challenges bruts
✅ 4 challenges chargés depuis challenges.json
📍 Source: challenges.json
```

### Exemple de Logs avec Erreur (Problème)

```
❌ Erreur lors du chargement: SyntaxError: Unexpected token } in JSON at position 1234
```

→ Le JSON est invalide, utilisez `jq` ou jsonlint pour le valider

---

## 🎯 Checklist de Débogage

Cochez au fur et à mesure :

### Fichier
- [ ] Le fichier `data/level-complete.json` existe
- [ ] Le nom est exact (tiret, pas underscore)
- [ ] Le JSON est valide (testé avec `jq`)
- [ ] Le fichier est accessible (permissions OK)

### Structure
- [ ] La propriété `mapFile` existe
- [ ] La propriété `gridSize` existe
- [ ] La propriété `startPos` existe
- [ ] La propriété `challenges` existe et n'est pas vide
- [ ] La propriété `narrativeTree` existe
- [ ] `narrativeTree.nodes` existe et n'est pas vide

### Correspondance
- [ ] Le nombre de challenges = nombre de nœuds
- [ ] Les IDs des challenges correspondent aux IDs des nœuds
- [ ] Chaque challenge a des `outcomes` valides
- [ ] Chaque nœud a un `name`, `icon`, `color`

### Serveur
- [ ] Utilisation d'un serveur local (pas `file://`)
- [ ] Port accessible (ex: 8000)
- [ ] Pas d'erreur CORS

### Console
- [ ] `levelComplete: "✅"` dans les logs
- [ ] Message "Utilisation de level-complete.json"
- [ ] Message "Enrichissement de X challenges"
- [ ] Message "Source: level-complete.json"
- [ ] Aucune erreur rouge

---

## 🚑 Solutions Rapides

### Problème : Le fichier ne se charge pas

```bash
# 1. Vérifiez le chemin EXACT
pwd
# Vous devez être dans: /home/user/last_dunes_v2

# 2. Vérifiez le fichier
ls -la data/level-complete.json

# 3. Validez le JSON
cat data/level-complete.json | jq . > /dev/null

# 4. Utilisez le fichier exemple fourni
# (Il est déjà dans data/level-complete.json)

# 5. Lancez le serveur
python3 -m http.server 8000
```

### Problème : L'enrichissement ne fonctionne pas

```bash
# Vérifiez que narrativeTree existe
cat data/level-complete.json | jq '.narrativeTree'

# Si "null" ou absent, réexportez depuis niveau-editor.html
# APRÈS avoir importé l'arbre narratif
```

### Problème : Les challenges ne s'affichent pas

```bash
# Vérifiez les coordonnées
cat data/level-complete.json | jq '.challenges[] | {id, coordinates}'

# Vérifiez que les coordonnées sont dans la grille
# x et y doivent être entre 0 et (gridSize - 1)
```

---

## 📞 Support

Si après toutes ces vérifications le problème persiste :

1. **Ouvrez la console** (F12)
2. **Copiez TOUS les logs** (depuis "Last Dunes - Initialisation")
3. **Vérifiez le fichier** :
```bash
cat data/level-complete.json | jq . | head -50
```
4. Partagez ces informations

---

## ✅ Résumé

**Ce qui a été corrigé** :
- ✅ `main.js` charge maintenant `level-complete.json` en priorité
- ✅ Fonction d'enrichissement automatique ajoutée
- ✅ Logs détaillés pour le débogage
- ✅ Fallback intelligent sur les anciens formats
- ✅ Fichier exemple créé dans `data/level-complete.json`

**Ce que vous devez faire** :
1. Lancer un serveur web local
2. Ouvrir la console (F12)
3. Vérifier les logs
4. Tester le jeu

**Le jeu devrait maintenant charger automatiquement `level-complete.json` s'il existe dans `data/` !** 🎉
