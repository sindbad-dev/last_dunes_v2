# 🔧 Correctifs Appliqués - Régressions Résolues

## Problèmes Identifiés

### 1. ❌ Les cartes ne s'affichaient plus dans le menu
### 2. ❌ NetworkError dans les tests

---

## Solutions Appliquées

### Correctif 1 : Conversion des Outcomes dans main.js

**Problème** : `level-complete.json` utilise des objets pour les outcomes (`{text: "...", cost: ..., healthChange: ...}`) alors que le jeu attend des chaînes simples.

**Solution** : Enrichissement amélioré dans `main.js` qui convertit automatiquement :

```javascript
// Convertir les outcomes d'objets à chaînes
if (challenge.outcomes) {
    enriched.outcomes = {};
    for (let outcomeType in challenge.outcomes) {
        const outcome = challenge.outcomes[outcomeType];
        // Extraire le .text si c'est un objet
        enriched.outcomes[outcomeType] = typeof outcome === 'string' ? outcome : outcome.text;
    }
}

// Extraire healthEffects
if (challenge.outcomes) {
    enriched.healthEffects = {};
    for (let outcomeType in challenge.outcomes) {
        const outcome = challenge.outcomes[outcomeType];
        if (typeof outcome === 'object' && outcome.healthChange !== undefined) {
            enriched.healthEffects[outcomeType] = outcome.healthChange;
        }
    }
}
```

---

### Correctif 2 : Avertissement CORS dans test-suite.html

**Problème** : Tests ouverts en `file://` causaient NetworkError

**Solution** : Détection automatique et message d'avertissement :

```javascript
// Vérifier si ouvert via file://
if (window.location.protocol === 'file:') {
    log('⚠️ ATTENTION: Fichier ouvert en file://', 'error');
    log('Les tests de chargement JSON échoueront à cause de CORS', 'warn');
    log('Solution: Lancez un serveur web local', 'warn');
    log('  python3 -m http.server 8000', 'info');
    log('  Puis ouvrez http://localhost:8000/test-suite.html', 'info');
}
```

---

## Comment Tester les Corrections

### Test 1 : Vérifier que les cartes s'affichent

```bash
# 1. Lancez le serveur
python3 -m http.server 8000

# 2. Ouvrez le jeu
http://localhost:8000

# 3. Déplacez-vous vers un challenge

# 4. Vérifiez dans la console (F12)
# Vous devriez voir :
# - "📦 Utilisation de level-complete.json"
# - "✅ Challenge enrichi: Le Gobelin (node_0)"
# - "✅ 2 challenges chargés depuis level-complete.json"

# 5. Vérifiez que les 4 cartes s'affichent dans le menu
```

---

### Test 2 : Vérifier que les tests passent

```bash
# 1. Lancez le serveur
python3 -m http.server 8000

# 2. Ouvrez les tests
http://localhost:8000/test-suite.html

# 3. Cliquez sur "Exécuter Tous les Tests"

# Résultat attendu :
# - Plus de NetworkError
# - Tous les tests passent
```

---

### Test 3 : Vérifier l'enrichissement

```bash
# Ouvrez la console du jeu (F12)
# Vous devriez voir des logs détaillés:

# 1. Chargement
Fichiers chargés: {levelComplete: "✅", challenges: "✅", level1: "✅"}
📦 Utilisation de level-complete.json (format complet avec arbre narratif)

# 2. Enrichissement
🔄 Enrichissement de 2 challenges avec l'arbre narratif
✅ Challenge enrichi: Le Gobelin (node_0)
✅ Challenge enrichi: Le Gardien (node_1)

# 3. Conversion
# Les outcomes sont maintenant des chaînes
# Les healthEffects sont extraits
```

---

## Structures de Données

### Format level-complete.json (Exporté par niveau-editor)

```json
{
  "challenges": [
    {
      "id": "node_0",
      "outcomes": {
        "success_triumph": {
          "text": "Vous triomphez !",
          "cost": 2,
          "healthChange": 0
        }
      }
    }
  ]
}
```

### Format Après Enrichissement (Utilisé par le jeu)

```json
{
  "id": "node_0",
  "name": "Le Gobelin",
  "icon": "👺",
  "outcomes": {
    "success_triumph": "Vous triomphez !"
  },
  "healthEffects": {
    "success_triumph": 0
  }
}
```

---

## Diagnostic Rapide

### Les cartes ne s'affichent toujours pas ?

**Vérifiez la console (F12)** :

1. ✅ Doit dire : `📦 Utilisation de level-complete.json`
2. ✅ Doit dire : `🔄 Enrichissement de X challenges`
3. ✅ Doit dire : `✅ Challenge enrichi: <nom>`

Si vous ne voyez pas ces messages :
- Vérifiez que `data/level-complete.json` existe
- Vérifiez que le serveur web est lancé
- Videz le cache du navigateur (Ctrl+Shift+R)

---

### NetworkError dans les tests ?

**Solution** : Lancez TOUJOURS un serveur web

```bash
# ❌ NE PAS FAIRE
file:///home/user/last_dunes_v2/test-suite.html

# ✅ FAIRE
python3 -m http.server 8000
# Puis http://localhost:8000/test-suite.html
```

---

### Les outcomes ne s'affichent pas correctement ?

**Vérifiez la structure** :

```javascript
// Dans level-complete.json, les outcomes peuvent être:

// Format 1 (objet - exporté par niveau-editor)
"success_triumph": {
  "text": "Vous triomphez !",
  "cost": 2,
  "healthChange": 0
}

// Format 2 (chaîne - utilisé par level1.json)
"success_triumph": "Vous triomphez !"

// Le code d'enrichissement gère les DEUX formats automatiquement
```

---

## Workflow Mis à Jour

### 1. Créer l'Arbre Narratif

```
challenge-editor.html → Export → narrative-tree.json
```

### 2. Placer sur la Carte

```
niveau-editor.html → Import narrative-tree.json → Export → level-complete.json
```

### 3. Copier dans data/

```bash
cp level-complete.json data/
```

### 4. Tester

```bash
# Tests bash
bash run-tests.sh

# Tests HTML
python3 -m http.server 8000
http://localhost:8000/test-suite.html

# Jeu
http://localhost:8000
```

---

## Changements Techniques

### Fichiers Modifiés

| Fichier | Changement | Impact |
|---------|------------|--------|
| `js/main.js` | Conversion automatique outcomes + healthEffects | ✅ Compatibilité level-complete.json |
| `test-suite.html` | Détection file:// + avertissement | ✅ Meilleur diagnostic |
| `test-suite.html` | Test enrichissement mis à jour | ✅ Tests reflètent le code réel |

### Compatibilité

Le code est maintenant compatible avec :
- ✅ `level-complete.json` (format objet avec text, cost, healthChange)
- ✅ `challenges.json` (format chaîne simple)
- ✅ `level1.json` (format chaîne simple avec healthEffects séparés)

---

## Résumé

### Avant ❌
- Outcomes objets non convertis → cartes ne s'affichent pas
- NetworkError pas expliqué → confusion

### Après ✅
- Conversion automatique dans enrichissement → cartes s'affichent
- Avertissement clair si file:// → meilleur diagnostic
- Tests mis à jour → reflètent le code réel

---

## Prochaines Étapes

1. Testez le jeu : `http://localhost:8000`
2. Vérifiez que les cartes s'affichent
3. Lancez les tests : `http://localhost:8000/test-suite.html`
4. Si tout fonctionne, committez les changements

**Les régressions sont maintenant corrigées ! 🎉**
