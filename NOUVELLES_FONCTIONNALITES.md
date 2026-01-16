# 🎮 Guide des Nouvelles Fonctionnalités - Challenge Editor

Ce document explique les nouvelles fonctionnalités ajoutées à l'éditeur d'arbre narratif.

---

## 🆕 Fonctionnalités Ajoutées

### 1. ❤️ Gestion des Points de Vie

### 2. 🎁 Cartes Récompenses Personnalisées

---

## ❤️ Gestion des Points de Vie

### Description

Chaque outcome (conséquence) d'un challenge peut maintenant affecter les points de vie du joueur. Cela permet de créer des mécaniques plus riches et variées.

### Comment Utiliser

Pour chaque carte (outcome), vous avez maintenant un champ **"❤️ PV"** :

```
┌────────────────────────────────────────┐
│ ✓ Réussite Triomphale                 │
│ Coût: [2]  ❤️ PV: [0]                 │
└────────────────────────────────────────┘
```

**Valeurs possibles :**
- **Négatif** (-1, -2, -3, etc.) = **Perte de PV** (dégâts)
- **Zéro** (0) = **Aucun changement**
- **Positif** (+1, +2, +3, etc.) = **Gain de PV** (soin)

### Exemples d'Utilisation

#### Exemple 1 : Combat Dangereux

```
Challenge : "Combat contre le Gobelin"

Réussite Triomphale :
  Coût: 2
  PV: +1  (vous récupérez 1 PV en triomphant)

Réussite de Justesse :
  Coût: 1
  PV: 0   (pas de changement)

Échec de Justesse :
  Coût: 0
  PV: -1  (vous perdez 1 PV)

Échec Catastrophique :
  Coût: 0
  PV: -3  (vous perdez 3 PV !)
```

#### Exemple 2 : Interaction de Soin

```
Challenge : "Fontaine de Guérison"

Réussite Triomphale :
  Coût: 2
  PV: +3  (soin complet)

Réussite de Justesse :
  Coût: 1
  PV: +1  (soin partiel)

Échec de Justesse :
  Coût: 0
  PV: 0   (aucun effet)

Échec Catastrophique :
  Coût: 0
  PV: -1  (eau empoisonnée !)
```

#### Exemple 3 : Piège

```
Challenge : "Piège à lames"

Réussite Triomphale :
  Coût: 2
  PV: 0   (évité sans dommage)

Réussite de Justesse :
  Coût: 1
  PV: -1  (éraflure)

Échec de Justesse :
  Coût: 0
  PV: -2  (coupure profonde)

Échec Catastrophique :
  Coût: 0
  PV: -4  (blessure grave)
```

### Valeurs Par Défaut

Quand vous créez un nouveau challenge, les valeurs par défaut sont :
- **Réussite Triomphale** : 0 PV
- **Réussite de Justesse** : 0 PV
- **Échec de Justesse** : -1 PV
- **Échec Catastrophique** : -2 PV

### Structure JSON

Dans le JSON exporté, les PV sont stockés comme `healthChange` :

```json
{
  "outcomes": {
    "success_triumph": {
      "text": "Vous terrassez le gobelin avec brio !",
      "cost": 2,
      "type": "success",
      "healthChange": 1
    },
    "fail_catastrophic": {
      "text": "Le gobelin vous terrasse !",
      "cost": 0,
      "type": "fail",
      "healthChange": -3
    }
  }
}
```

---

## 🎁 Cartes Récompenses Personnalisées

### Description

Les challenges peuvent maintenant donner des **cartes spéciales** au joueur en récompense. Ces cartes uniques s'ajoutent au deck du joueur et ont des effets personnalisés.

### Comment Activer

Dans l'onglet d'édition d'un nœud, vous trouverez une nouvelle section **"🎁 Carte Récompense (Optionnelle)"** :

1. **Cochez** "Activer une carte récompense"
2. La configuration apparaît
3. Remplissez les champs

### Configuration d'une Carte Récompense

```
┌─────────────────────────────────────────────────┐
│ 🎁 Carte Récompense (Optionnelle)              │
├─────────────────────────────────────────────────┤
│ ☑ Activer une carte récompense                 │
│                                                 │
│ Nom de la carte : [Coup du gobelin]            │
│ Label affiché : [Attaque spéciale]             │
│ Description : [Une attaque rapide apprise...]  │
│ Icône : [⚔️]                                    │
│ Coût en catastrophe : [1]                       │
│ Type de résultat : [Réussite ▼]                │
│ Texte de l'outcome : [Vous utilisez...]        │
│ ❤️ Changement de PV : [0]                       │
│ Nombre d'utilisations : [3]                     │
└─────────────────────────────────────────────────┘
```

### Champs Expliqués

#### **Nom de la carte**
- Identifiant interne de la carte
- Exemple : `coup_gobelin`, `sort_feu`, `potion_soin`

#### **Label affiché**
- Texte affiché sur la carte dans le jeu
- Exemple : "Attaque du Gobelin", "Boule de Feu", "Potion"

#### **Description de l'effet**
- Explication de ce que fait la carte
- Exemple : "Une attaque rapide apprise du gobelin. Inflige des dégâts mineurs mais fiables."

#### **Icône**
- Emoji représentant la carte
- Exemple : ⚔️, 🔥, 💊, 🛡️, ⚡

#### **Coût en catastrophe**
- Combien cette carte augmente la jauge de catastrophe
- De 0 à 3 (comme les cartes standards)

#### **Type de résultat**
- **Réussite** : Compte comme une réussite
- **Échec** : Compte comme un échec
- **Spécial** : Effet unique, ni réussite ni échec

#### **Texte de l'outcome**
- Le texte narratif qui s'affiche quand la carte est jouée
- Exemple : "Vous utilisez la technique du gobelin ! L'ennemi est surpris."

#### **❤️ Changement de PV**
- Impact sur les points de vie (comme les cartes standards)
- Négatif = dégâts, Positif = soin

#### **Nombre d'utilisations**
- Combien de fois la carte peut être utilisée
- Après épuisement, la carte disparaît du deck
- De 1 à 10 utilisations

---

## 📝 Exemples de Cartes Récompenses

### Exemple 1 : Attaque Spéciale

```
Challenge : "Vaincre le Gobelin"
Récompense après réussite triomphale

Carte Récompense:
  Nom : coup_gobelin
  Label : "Coup du Gobelin"
  Description : "Une attaque rapide et sournoise"
  Icône : ⚔️
  Coût : 1
  Type : Réussite
  Outcome : "Vous frappez avec la ruse du gobelin !"
  PV : 0
  Utilisations : 3
```

**Usage** : Le joueur obtient 3 utilisations d'une nouvelle carte d'attaque fiable.

---

### Exemple 2 : Potion de Soin

```
Challenge : "Trouver l'herbe médicinale"
Récompense après réussite

Carte Récompense:
  Nom : potion_soin
  Label : "Potion de Soin"
  Description : "Restaure 2 PV"
  Icône : 💊
  Coût : 0
  Type : Spécial
  Outcome : "Vous buvez la potion et vous sentez revigoré."
  PV : +2
  Utilisations : 1
```

**Usage** : Une potion one-shot qui soigne 2 PV sans coût de catastrophe.

---

### Exemple 3 : Bouclier Temporaire

```
Challenge : "Récupérer le bouclier ancien"
Récompense

Carte Récompense:
  Nom : bouclier_ancien
  Label : "Bouclier Ancien"
  Description : "Absorbe les dégâts"
  Icône : 🛡️
  Coût : 2
  Type : Réussite
  Outcome : "Le bouclier bloque l'attaque !"
  PV : +1
  Utilisations : 2
```

**Usage** : 2 utilisations d'une défense puissante qui bloque et soigne.

---

### Exemple 4 : Malédiction

```
Challenge : "Ouvrir le coffre maudit"
Récompense (avec risque !)

Carte Récompense:
  Nom : malediction
  Label : "Malédiction Sombre"
  Description : "Puissante mais dangereuse"
  Icône : 💀
  Coût : 0
  Type : Échec
  Outcome : "La malédiction se retourne contre vous..."
  PV : -2
  Utilisations : 5
```

**Usage** : Une carte qui force l'échec mais sans coût. Double tranchant !

---

### Exemple 5 : Carte Ultime

```
Challenge : "Vaincre le Dragon Boss"
Récompense finale

Carte Récompense:
  Nom : souffle_dragon
  Label : "Souffle du Dragon"
  Description : "Puissance du dragon vaincu"
  Icône : 🐉
  Coût : 3
  Type : Réussite
  Outcome : "Vous invoquez le souffle du dragon !"
  PV : -1
  Utilisations : 1
```

**Usage** : Carte ultra puissante mais coûteuse, récompense d'un boss.

---

## 🎯 Stratégies de Design

### Équilibrage des PV

**Règles générales :**
- **Réussites** : 0 à +2 PV (rarement négatif)
- **Échecs** : 0 à -3 PV (rarement positif)
- **Challenges faciles** : ±1 PV maximum
- **Challenges difficiles** : Jusqu'à ±3 PV
- **Boss** : Peut aller jusqu'à ±5 PV

### Équilibrage des Cartes Récompenses

**Cartes faibles** (3-5 utilisations) :
- Coût : 0-1
- PV : 0 à ±1
- Effet modéré

**Cartes moyennes** (2-3 utilisations) :
- Coût : 1-2
- PV : ±1 à ±2
- Effet notable

**Cartes puissantes** (1-2 utilisations) :
- Coût : 2-3
- PV : ±2 à ±3
- Effet majeur

**Cartes spéciales** :
- Effets uniques ou atypiques
- Utilisations limitées
- Peut avoir des contreparties

### Quand Donner des Récompenses

- ✅ **Après un boss** : Carte puissante
- ✅ **Challenge difficile** : Carte utilitaire
- ✅ **Interaction spéciale** : Carte thématique
- ✅ **Quête secondaire** : Carte situationnelle
- ⚠️ **Pas trop souvent** : Les récompenses doivent rester spéciales

---

## 📊 Structure JSON Complète

Exemple de nœud avec toutes les fonctionnalités :

```json
{
  "id": "node_1",
  "name": "Combat contre le Gobelin",
  "type": "challenge",
  "icon": "👺",
  "color": "#00ff00",
  "dialogue": "Un gobelin féroce vous attaque !",
  "isStart": true,
  "x": 50,
  "y": 50,
  "outcomes": {
    "success_triumph": {
      "text": "Vous terrassez le gobelin avec maestria !",
      "cost": 2,
      "type": "success",
      "healthChange": 1
    },
    "success_narrow": {
      "text": "Vous repoussez le gobelin de justesse.",
      "cost": 1,
      "type": "success",
      "healthChange": 0
    },
    "fail_narrow": {
      "text": "Le gobelin vous blesse au bras.",
      "cost": 0,
      "type": "fail",
      "healthChange": -1
    },
    "fail_catastrophic": {
      "text": "Le gobelin vous terrasse !",
      "cost": 0,
      "type": "fail",
      "healthChange": -3
    }
  },
  "rewardCard": {
    "name": "coup_gobelin",
    "label": "Coup du Gobelin",
    "description": "Attaque rapide et sournoise",
    "icon": "⚔️",
    "cost": 1,
    "outcomeType": "success",
    "outcomeText": "Vous frappez avec la ruse du gobelin !",
    "healthChange": 0,
    "uses": 3
  }
}
```

---

## 🔄 Workflow de Création

### Workflow Simple (Sans Récompense)

1. Créer le challenge
2. Définir nom, type, icône, dialogue
3. Ajuster les **PV** de chaque outcome
4. Écrire les textes narratifs
5. Exporter

### Workflow Avancé (Avec Récompense)

1. Créer le challenge
2. Définir les propriétés de base
3. Ajuster les **PV** de chaque outcome
4. **Cocher** "Activer une carte récompense"
5. Remplir les champs de la carte
6. Tester l'équilibrage (coût vs utilité)
7. Exporter

---

## 🎓 Bonnes Pratiques

### Pour les Points de Vie

1. **Cohérence** : Les challenges similaires devraient avoir des impacts PV similaires
2. **Progression** : Augmentez l'impact PV plus tard dans l'aventure
3. **Équilibre** : Les gains de PV doivent être plus rares que les pertes
4. **Clarté** : Le texte narratif doit refléter l'impact (sévérité des blessures, etc.)

### Pour les Cartes Récompenses

1. **Rareté** : Pas de carte récompense pour chaque challenge
2. **Thématique** : La carte doit avoir du sens narrativement
3. **Équilibrage** : Une carte puissante = peu d'utilisations
4. **Variété** : Diversifiez les types de cartes (attaque, soin, spécial)
5. **Narration** : La carte raconte une histoire (apprentissage, butin, etc.)

---

## 🧪 Exemples de Scénarios Complets

### Scénario 1 : Le Donjon du Gobelin

```
Nœud 1 : "Entrée du Donjon"
  - Pas de PV, pas de récompense
  - Simple interaction narrative

Nœud 2 : "Combat Gobelin"
  - PV : 0/0/-1/-2
  - Récompense : "Coup du Gobelin" (3 uses)

Nœud 3 : "Piège à Lames"
  - PV : 0/-1/-2/-3
  - Pas de récompense

Nœud 4 : "Fontaine Magique"
  - PV : +3/+1/0/-1
  - Récompense : "Eau Bénie" (1 use, +2 PV)

Nœud 5 : "Boss : Chef Gobelin"
  - PV : +2/0/-2/-4
  - Récompense : "Hache du Chef" (2 uses, puissant)
```

---

## 🆘 Dépannage

### Les PV ne se sauvegardent pas
- Vérifiez que vous avez cliqué sur "Sauvegarder les modifications"
- Les valeurs doivent être des nombres (pas de texte)

### La carte récompense ne s'affiche pas
- Vérifiez que la checkbox est bien cochée
- Rechargez le nœud après sauvegarde

### Le JSON ne contient pas les nouvelles données
- Assurez-vous d'avoir sauvegardé avant d'exporter
- Les nœuds créés avant la mise à jour doivent être réédités

---

## ✅ Checklist de Validation

Pour un challenge complet :
- [ ] Nom et icône définis
- [ ] Les 4 outcomes ont du texte
- [ ] **Les PV sont cohérents** avec la difficulté
- [ ] Si récompense : checkbox activée
- [ ] Si récompense : tous les champs remplis
- [ ] Si récompense : **utilisations** appropriées
- [ ] Testé en jeu
- [ ] Exporté en JSON

---

Bon game design avec les nouvelles fonctionnalités ! 🎮❤️🎁
