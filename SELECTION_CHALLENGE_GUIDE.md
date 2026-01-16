# 🎯 Guide de Sélection des Challenges

## Nouvelles Fonctionnalités de Sélection

Ce guide documente les améliorations apportées au système de sélection des challenges dans l'éditeur d'arbre narratif.

---

## 1. Liste de Sélection Rapide

### Description
Une nouvelle section **🎯 Sélection Rapide** a été ajoutée en haut de la sidebar, permettant de visualiser et sélectionner rapidement tous les challenges créés.

### Fonctionnalités
- **Liste visuelle** : Affiche tous les challenges avec leur icône, nom et type
- **Badge START** : Les nœuds de départ sont marqués avec un badge vert "START"
- **Highlight** : Le challenge actuellement sélectionné est surligné avec une bordure dorée
- **Clic pour sélectionner** : Cliquez simplement sur un challenge dans la liste pour le sélectionner

### Comportement
- La liste se met à jour automatiquement :
  - Quand un nouveau challenge est créé
  - Quand un challenge est supprimé
  - Quand les propriétés d'un challenge sont modifiées (nom, icône)
  - Quand vous sélectionnez/désélectionnez un challenge

---

## 2. Feedback Visuel Amélioré

### Effet de Glow
Le nœud sélectionné dans le canvas bénéficie maintenant d'un effet visuel amélioré :
- **Bordure dorée (#ffd700)** : Plus épaisse (4px au lieu de 3px)
- **Effet de glow** : Ombre lumineuse autour du nœud sélectionné
- **Visibilité maximale** : Il est désormais impossible de perdre de vue quel nœud est sélectionné

---

## 3. Raccourcis Clavier

### Navigation entre les Challenges

| Raccourci | Action |
|-----------|--------|
| **Flèche Droite** / **Flèche Bas** | Sélectionner le challenge suivant |
| **Flèche Gauche** / **Flèche Haut** | Sélectionner le challenge précédent |
| **Suppr** / **Backspace** | Supprimer le challenge sélectionné (avec confirmation) |
| **Échap** | Désélectionner le challenge courant et annuler la connexion en cours |

### Notes Importantes
- Les raccourcis clavier **ne fonctionnent pas** lorsque vous tapez dans un champ de texte (input/textarea)
- La navigation est cyclique : après le dernier challenge, on revient au premier
- Un message de confirmation apparaît avant la suppression

### Aide Visuelle
Un rappel des raccourcis est affiché dans la barre d'outils :
```
⌨️ Flèches: Naviguer | Suppr: Effacer
```

---

## 4. Utilisation Pratique

### Workflow Typique

1. **Créer des challenges**
   - Cliquez sur "➕ Nouveau Challenge"
   - Les challenges apparaissent automatiquement dans la liste de sélection rapide

2. **Naviguer entre les challenges**
   - **Option A** : Cliquez sur un challenge dans la liste de sélection rapide
   - **Option B** : Cliquez directement sur un nœud dans le canvas
   - **Option C** : Utilisez les flèches du clavier pour naviguer

3. **Éditer un challenge**
   - Le challenge sélectionné est automatiquement chargé dans le panneau d'édition
   - Modifiez les propriétés, outcomes, points de vie, etc.
   - Cliquez sur "💾 Sauvegarder Modifications"
   - La liste de sélection se met à jour automatiquement

4. **Re-sélectionner un challenge**
   - Vous pouvez cliquer plusieurs fois sur le même challenge
   - Dans la liste de sélection : rechargera les données
   - Dans le canvas : rechargera les données
   - Utile pour annuler des modifications non sauvegardées

---

## 5. Exemples d'Usage

### Exemple 1 : Navigation Rapide
```
Situation : Vous avez créé 10 challenges et voulez éditer le 7ème

Solution :
1. Regardez dans la liste de sélection rapide
2. Cliquez sur le challenge désiré
3. Éditez immédiatement
```

### Exemple 2 : Révision Systématique
```
Situation : Vous voulez réviser tous vos challenges un par un

Solution :
1. Cliquez sur le premier challenge (ou utilisez Flèche Bas)
2. Vérifiez les propriétés
3. Appuyez sur Flèche Bas pour passer au suivant
4. Répétez jusqu'à la fin
```

### Exemple 3 : Suppression Rapide
```
Situation : Vous voulez supprimer un challenge spécifique

Solution :
1. Cliquez sur le challenge dans la liste ou le canvas
2. Appuyez sur Suppr
3. Confirmez la suppression
```

---

## 6. États Visuels

### Challenge Non Sélectionné
- Bordure grise (#666)
- Pas d'effet de glow
- Fond normal dans la liste de sélection (#3a3a3a)

### Challenge Sélectionné
- **Canvas** :
  - Bordure dorée épaisse (#ffd700, 4px)
  - Effet de glow doré (shadowBlur: 20px)
- **Liste de sélection** :
  - Bordure dorée (#ffd700)
  - Fond plus clair (#4a4a4a)

### Challenge de Départ
- Bordure verte (#00ff00) même si non sélectionné
- Badge "START" vert dans la liste de sélection

---

## 7. Avantages

### Productivité
- ✅ **Navigation ultra-rapide** : Passez d'un challenge à l'autre en un clic ou une touche
- ✅ **Vue d'ensemble** : Voyez tous vos challenges d'un coup d'œil
- ✅ **Pas de perte** : Impossible de perdre le challenge sélectionné grâce au glow

### Ergonomie
- ✅ **Trois méthodes** : Clic dans liste, clic sur canvas, ou clavier
- ✅ **Feedback immédiat** : La sélection est visible partout (liste + canvas)
- ✅ **Undo facile** : Re-sélectionnez pour recharger les données originales

### Organisation
- ✅ **Liste ordonnée** : Les challenges sont affichés dans l'ordre de création
- ✅ **Informations visuelles** : Icône, nom, type, statut START
- ✅ **Scroll automatique** : La liste défile si vous avez beaucoup de challenges

---

## 8. Tests à Effectuer

### Test 1 : Création de Challenges
1. Créez 5 challenges
2. Vérifiez que chacun apparaît dans la liste de sélection
3. Vérifiez que leurs icônes et noms sont corrects

### Test 2 : Sélection Multiple
1. Sélectionnez un challenge dans la liste
2. Vérifiez qu'il est surligné dans la liste ET a un glow dans le canvas
3. Sélectionnez un autre challenge
4. Vérifiez que le précédent n'est plus surligné

### Test 3 : Re-sélection
1. Sélectionnez un challenge
2. Modifiez son nom dans le champ (mais ne sauvegardez pas)
3. Re-cliquez sur le même challenge dans la liste
4. Vérifiez que le nom original est rechargé

### Test 4 : Navigation au Clavier
1. Créez 3 challenges
2. Appuyez sur Flèche Bas plusieurs fois
3. Vérifiez que la sélection avance et revient au premier après le dernier
4. Appuyez sur Flèche Haut
5. Vérifiez que la sélection recule

### Test 5 : Suppression
1. Sélectionnez un challenge
2. Appuyez sur Suppr
3. Confirmez
4. Vérifiez que le challenge disparaît de la liste ET du canvas

### Test 6 : Modification de Propriétés
1. Sélectionnez un challenge
2. Changez son nom et son icône
3. Sauvegardez
4. Vérifiez que la liste de sélection reflète les changements

### Test 7 : Challenge de Départ
1. Créez un challenge et cochez "Nœud de départ"
2. Sauvegardez
3. Vérifiez que le badge "START" apparaît dans la liste
4. Vérifiez que la bordure est verte dans le canvas

### Test 8 : Raccourcis Désactivés dans Input
1. Sélectionnez un challenge
2. Cliquez dans le champ "Nom du challenge"
3. Appuyez sur Flèche Droite
4. Vérifiez que le curseur bouge dans le texte (pas de changement de sélection)

---

## 9. Limites et Comportements Spéciaux

### Aucun Challenge Créé
- La liste affiche : "Aucun challenge créé"
- Les raccourcis clavier de navigation ne font rien

### Challenge Supprimé
- Si vous supprimez le challenge sélectionné :
  - La sélection est annulée
  - Le panneau "📝 Aucune sélection" s'affiche
  - La liste de sélection se met à jour

### Clic en Dehors
- Cliquer sur le canvas (en dehors d'un nœud) désélectionne le challenge courant
- La liste de sélection perd son highlight

---

## 10. Compatibilité

### Import/Export
- ✅ La sélection est purement visuelle et n'affecte pas les fichiers JSON
- ✅ Importer un fichier JSON ne sélectionne aucun challenge par défaut
- ✅ La liste de sélection se reconstruit automatiquement après un import

### Autres Fonctionnalités
- ✅ Compatible avec toutes les fonctionnalités existantes
- ✅ Fonctionne avec la gestion des points de vie
- ✅ Fonctionne avec les cartes récompenses
- ✅ Fonctionne avec les connexions entre nœuds

---

## Conclusion

Ces améliorations transforment l'expérience de création d'arbres narratifs en permettant une navigation fluide et intuitive entre les challenges. Que vous préfériez la souris ou le clavier, vous pouvez désormais travailler plus efficacement sur vos arbres de décision complexes.
