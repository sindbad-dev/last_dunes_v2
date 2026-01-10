# Instructions de Test - Last Dunes Prototype

## Comment Lancer le Prototype

1. Ouvrir `index.html` dans un navigateur web moderne (Chrome, Firefox, Edge)
2. Le jeu démarre automatiquement

## Contrôles

- **ZQSD** ou **Flèches directionnelles** : Déplacer l'avatar (carré vert)
- Le déplacement se fait case par case sur une grille de 40x40 pixels

## Critères de Succès du Prototype

### ✅ Test 1 : Mouvement de l'Avatar
- **Action** : Utiliser les touches ZQSD ou flèches
- **Résultat attendu** : Le carré vert (avatar) se déplace sur la carte
- **Position de départ** : (16, 25) sur la grille

### ✅ Test 2 : Détection de Challenge
- **Action** : Déplacer l'avatar sur les coordonnées (16, 20) - Le Gardien (carré magenta marqué "gat")
- **Résultat attendu** : L'overlay de challenge apparaît avec le dialogue "Ses orbites vides vous fixent. Il lève une épée rouillée."
- **Cartes affichées** : 4 cartes de choix doivent apparaître

### ✅ Test 3 : Jauge de Catastrophe - Accumulation
- **Action** :
  1. Rencontrer le premier challenge (Gardien en 16, 20)
  2. Choisir "Réussite triomphale" (+2 Catastrophe)
  3. Rencontrer le deuxième challenge (Puits en 10, 8)
  4. Choisir "Réussite de justesse" (+1 Catastrophe)
- **Résultat attendu** :
  - Après le 1er choix : 2 segments de la jauge s'allument (rouge)
  - Après le 2ème choix : Les 3 segments de la jauge sont allumés et clignotent

### ✅ Test 4 : Jauge Pleine - Échec Forcé
- **Action** : Après avoir rempli la jauge (3/3), rencontrer le troisième challenge (Boss en 11, 23)
- **Résultat attendu** :
  - Les cartes de réussite et échec simple sont grisées (disabled)
  - Seule la carte "Échec catastrophique" est cliquable
  - Le texte de résultat commence par "LA JAUGE EST PLEINE ! Le destin se retourne contre vous."
  - Après l'échec, la jauge revient à 0/3

### ✅ Test 5 : Arbre Yggdrasil
- **Action** : Compléter les 3 challenges du niveau
- **Résultat attendu** :
  - L'écran "Arbre du Destin" s'affiche
  - Les 3 choix effectués sont listés avec :
    - Le titre du challenge
    - La carte choisie
    - Le résultat narratif
  - Les résultats sont colorés selon leur type (vert=succès, orange=échec simple, rouge=catastrophe)

## Challenges Disponibles

1. **Le Gardien** - Position (16, 20) - Type: challenge
2. **Le Puits Empoisonné** - Position (10, 8) - Type: interaction
3. **Le Nécromancien Boss** - Position (11, 23) - Type: boss

## Mécaniques Clés à Valider

### Système de Cartes
- **Réussite de justesse** : +1 Catastrophe
- **Réussite triomphale** : +2 Catastrophe
- **Échec de justesse** : 0 Catastrophe
- **Échec catastrophique** : 0 Catastrophe (forcé si jauge pleine)

### Règle d'Or
Quand la Jauge de Catastrophe atteint 3/3 :
1. Au prochain challenge, le choix du joueur est ignoré
2. Le système force automatiquement "Échec catastrophique"
3. Un message explicite indique que c'est la jauge qui a causé cet échec
4. La jauge est remise à 0 après l'échec forcé

## Remarques

- L'image de fond n'est pas nécessaire pour le prototype - une grille apparaîtra à la place
- Les challenges sont marqués par des carrés magenta sur la carte
- Le HUD avec la jauge est visible en haut à gauche
- Chaque challenge ne peut être déclenché qu'une seule fois
