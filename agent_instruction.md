Utilise :

lit la description du jeux readme.md
le fichier file_struct.txt pour créer l'arborescence
les fichiers présent pour t'inspirer 

Objet du Prompt : Développement final du prototype fonctionnel "Last Dunes" à partir de la structure de fichiers existante.

Rôle de l'Agent : Tu es un développeur Full-Stack expert en prototypage de jeux web (HTML5/Canvas/JS). Ton objectif est de prendre les fichiers statiques et les données JSON fournis et de les transformer en une expérience jouable pour valider les mécaniques principales du jeu.
1. Contexte du Projet et Objectifs

"Last Dunes" est un RPG narratif isométrique où la gestion du risque est centrale. Le but de ce prototype est de valider exclusivement la boucle de gameplay suivante :

    Déplacement sur une carte.

    Rencontre d'un "Challenge".

    Choix stratégique d'une carte de résolution parmi 4 options.

    Impact de ce choix sur la narration et surtout sur la Jauge de Catastrophe.

    Visualisation de l'histoire générée en fin de partie (Yggdrasil).

État actuel : La structure des dossiers est en place. Les fichiers HTML, CSS sont prêts. Le fichier data/level1.json contient toutes les données nécessaires (coordonnées, textes, règles). Les fichiers JS (main.js, mapEngine.js, gameLogic.js, uiManager.js) sont créés mais sont essentiellement des coquilles vides ou partiellement implémentées.
2. Tes Tâches (Plan de Développement)

Tu dois implémenter les fonctionnalités suivantes, étape par étape, en respectant la séparation des responsabilités définies par les fichiers JS.
Étape 1 : Moteur de Carte et Mouvement (mapEngine.js, main.js)

    Objectif : Avoir un avatar qui se déplace sur l'image de fond.

    Actions :

        Dans main.js, charge le fichier data/level1.json.

        Passe les données levelInfo à mapEngine.js.

        Dans mapEngine.js, initialise le Canvas 2D. Charge et dessine l'image assets/lastdunes1.jpg.

        Implémente un système de mouvement simple (clavier ZQSD ou flèches) pour un avatar (un simple carré de couleur suffit pour l'instant si sprites.png n'est pas prêt).

        Utilise gridSize du JSON pour gérer les collisions avec les bords de la carte.

Étape 2 : Détection des Interactions (mapEngine.js, main.js)

    Objectif : Le jeu détecte quand le joueur marche sur un challenge.

    Actions :

        Dans main.js, utilise les données challenges du JSON.

        À chaque mouvement de l'avatar, vérifie si sa position (convertie en coordonnées de grille) correspond aux coordinates d'un challenge actif (non encore résolu).

        Si une collision est détectée : fige le mouvement de l'avatar et déclenche l'UI.

Étape 3 : Interface de Challenge et Logique de Cartes (uiManager.js, gameLogic.js)

    Objectif : Afficher l'overlay de choix et gérer le clic sur les cartes.

    Actions :

        Dans uiManager.js, implémente showChallengeOverlay(challengeData). Cette fonction doit :

            Retirer la classe .hidden de #challenge-overlay.

            Injecter le dialogue_preview du challenge dans la bulle de texte.

            Générer dynamiquement les 4 cartes HTML dans .cards-container en se basant sur les définitions dans mechanics.cards du JSON.

            IMPORTANT : Si la Jauge de Catastrophe est pleine (vérifier auprès de gameLogic), désactiver visuellement (classe CSS .disabled) les cartes de réussite et d'échec simple, ne laissant que la "Catastrophe" cliquable.

        Ajoute des écouteurs d'événements (onclick) sur les cartes générées qui appellent une fonction de résolution dans gameLogic.js.

Étape 4 : LE CŒUR DU SYSTÈME - La Jauge de Catastrophe (gameLogic.js)

    Objectif : Implémenter la règle d'or du prototype.

    Règles Absolues à coder dans gameLogic.resolveCard(...) :

        État Normal (Jauge < 3) :

            Si le joueur choisit "Réussite de justesse", incrémente la jauge de +1.

            Si le joueur choisit "Réussite triomphale", incrémente la jauge de +2.

            Affiche le résultat correspondant (outcomes) du JSON.

        État Punitif (Jauge >= 3) :

            C'est la règle la plus importante : Si au moment de déclencher un challenge, la jauge est déjà à 3 (ou plus), le choix du joueur est ignoré.

            Le système force automatiquement le résultat fail_catastrophic.

            Le texte affiché doit explicitement dire que la jauge a provoqué cet échec.

            Après la résolution de cet échec forcé, la jauge doit être remise à 0.

        Mise à jour UI : Après chaque changement de valeur de la jauge, appelle uiManager.updateGauge() pour mettre à jour visuellement les segments dans le HUD HTML (ajouter/retirer la classe .filled).

Étape 5 : Résolution et Fin de Partie (uiManager.js, gameLogic.js)

    Objectif : Fermer la boucle et afficher l'arbre.

    Actions :

        Après un choix de carte, uiManager doit cacher l'overlay et afficher une modale de résultat (le texte de conséquence du JSON).

        Au clic sur "Continuer", le jeu reprend (l'avatar peut bouger).

        gameLogic doit stocker un historique de chaque challenge résolu (titre, choix fait, résultat).

        Quand tous les challenges du niveau sont résolus, gameLogic déclenche la fin de partie.

        uiManager.showYggdrasil(history) doit générer le HTML de l'arbre (les nœuds .story-node) basé sur l'historique pour afficher le récapitulatif narratif.

3. Critères de Succès

Le prototype est considéré comme terminé si :

    Je peux déplacer le carré avatar sur la carte.

    Quand je marche sur les coordonnées (16, 20) (le Gardien), l'overlay apparaît.

    Si je choisis "Triomphe" deux fois de suite sur deux challenges différents, je vois 2 segments de la jauge s'allumer dans le HUD.

    Si la jauge a 3 segments allumés, le prochain challenge que je rencontre me donne automatiquement l'échec catastrophique et la jauge se vide.

    À la fin, je vois l'écran Yggdrasil résumant mes choix.

Au travail ! Commence par l'Étape 1 : le chargement du JSON et l'affichage de la carte.
