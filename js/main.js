/**
 * Point d'entrée de l'application Last Dunes
 * Initialise les systèmes de jeu et charge les données du niveau
 */

console.log('Last Dunes - Initialisation...');

// Initialisation des gestionnaires principaux
const ui = new UIManager();
const logic = new GameLogic(ui);
const engine = new MapEngine('gameCanvas');

/**
 * Enrichit les challenges avec les données de l'arbre narratif
 * @param {Array} challenges - Liste des challenges de base
 * @param {Object} narrativeTree - Arbre narratif avec les nœuds
 * @returns {Array} Challenges enrichis
 */
function enrichChallengesWithNarrative(challenges, narrativeTree) {
    if (!narrativeTree || !narrativeTree.nodes) {
        console.warn('⚠️ Pas d\'arbre narratif fourni, utilisation des challenges bruts');
        return challenges;
    }

    console.log(`🔄 Enrichissement de ${challenges.length} challenges avec l'arbre narratif`);

    return challenges.map(challenge => {
        // Trouver le nœud narratif correspondant
        const node = narrativeTree.nodes.find(n => n.id === challenge.id);

        if (!node) {
            console.warn(`⚠️ Nœud narratif non trouvé pour ${challenge.id}`);
            return challenge;
        }

        // Enrichir le challenge avec les données narratives
        const enriched = {
            ...challenge,
            name: node.name || challenge.name,
            type: node.type || challenge.type,
            icon: node.icon || challenge.icon,
            color: node.color || challenge.color,
            description: node.dialogue || challenge.description,
            dialogue_preview: node.dialogue || challenge.dialogue_preview,
            isStart: node.isStart || false,
            rewardCard: node.rewardCard || null
        };

        // Convertir les outcomes d'objets à chaînes si nécessaire
        if (challenge.outcomes) {
            enriched.outcomes = {};
            for (let outcomeType in challenge.outcomes) {
                const outcome = challenge.outcomes[outcomeType];
                // Si l'outcome est un objet avec une propriété text, extraire le texte
                enriched.outcomes[outcomeType] = typeof outcome === 'string' ? outcome : outcome.text;
            }
        }

        // Convertir healthChange d'objets à propriété directe si nécessaire
        if (challenge.outcomes) {
            enriched.healthEffects = {};
            for (let outcomeType in challenge.outcomes) {
                const outcome = challenge.outcomes[outcomeType];
                // Si l'outcome est un objet avec healthChange
                if (typeof outcome === 'object' && outcome.healthChange !== undefined) {
                    enriched.healthEffects[outcomeType] = outcome.healthChange;
                }
            }
        }

        console.log(`✅ Challenge enrichi: ${enriched.name} (${enriched.id})`);
        return enriched;
    });
}

/**
 * Initialise le jeu avec les données du niveau
 * @param {Object} levelData - Données complètes du niveau
 */
async function initializeGame(levelData) {
    // Validation des données essentielles
    if (!levelData.mechanics || !levelData.mechanics.cards) {
        throw new Error('Le fichier level-complete.json doit contenir une section "mechanics" avec les définitions de cartes');
    }

    // Configuration du niveau
    const levelInfo = {
        name: levelData.name || 'Niveau Personnalisé',
        mapFile: levelData.mapFile,
        gridSize: levelData.gridSize,
        startPos: levelData.startPos
    };

    // Charger la carte
    engine.loadMap(levelInfo);
    console.log(`🗺️ Carte chargée: ${levelInfo.mapFile}`);

    // Charger le terrain si disponible
    if (levelData.walls || levelData.water || levelData.objects) {
        engine.loadTerrain(
            levelData.walls || [],
            levelData.water || [],
            levelData.objects || []
        );
        console.log(`🌍 Terrain chargé: ${levelData.walls?.length || 0} murs, ${levelData.water?.length || 0} eau, ${levelData.objects?.length || 0} objets`);
    }

    // Enrichir et charger les challenges
    let challenges = levelData.challenges || [];

    // Si on a un arbre narratif, enrichir les challenges avec
    if (levelData.narrativeTree) {
        challenges = enrichChallengesWithNarrative(challenges, levelData.narrativeTree);
        console.log(`🌳 ${challenges.length} challenges enrichis avec l'arbre narratif`);
    }

    // Placer les challenges sur la carte
    engine.placeInteractables(challenges);
    console.log(`✅ ${challenges.length} challenges placés sur la carte`);

    // Initialiser les mécaniques de jeu depuis level-complete.json
    logic.init(levelData);
    ui.init(levelData.mechanics.cards);
    ui.initPersistentDeck(logic);

    // Initialiser l'affichage de la santé et de la jauge
    ui.updateHealthBar(logic.currentHealth, logic.maxHealth);
    ui.updateGauge(logic.catastropheLevel);

    console.log(`🎮 Mécaniques initialisées: catastropheMax=${levelData.mechanics.catastropheMax}, healthMax=${levelData.mechanics.healthMax}`);
    console.log(`🎴 Deck persistant initialisé avec ${Object.keys(levelData.mechanics.cards).length} cartes`);

    // Boucle de jeu - détection des collisions avec challenges
    engine.onPlayerMove((pos) => {
        const challenge = engine.checkCollision(pos);
        if (challenge && !challenge.visited) {
            challenge.visited = true;
            ui.triggerChallenge(challenge, logic);
        }
    });

    // Démarrer la boucle de rendu
    engine.start();
    console.log('✅ Jeu démarré avec succès!');
    console.log(`📍 Niveau: ${levelInfo.name}`);
}

/**
 * Point d'entrée principal - Charge et initialise le jeu
 */
async function main() {
    try {
        console.log('📦 Chargement de level-complete.json...');

        const response = await fetch('data/level-complete.json');

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('❌ FICHIER ABSENT: Le fichier data/level-complete.json est introuvable.\n\nVeuillez créer ce fichier avec l\'éditeur de niveau ou placer un fichier level-complete.json valide dans le dossier data/');
            }
            throw new Error(`❌ ERREUR HTTP ${response.status}: Impossible de charger level-complete.json`);
        }

        let levelData;
        try {
            levelData = await response.json();
        } catch (jsonError) {
            throw new Error('❌ FICHIER MAL FORMATTÉ: Le fichier level-complete.json contient du JSON invalide.\n\nVérifiez la syntaxe avec un validateur JSON (JSONLint).');
        }

        // Vérifier que le fichier n'est pas vide
        if (!levelData || Object.keys(levelData).length === 0) {
            throw new Error('❌ FICHIER VIDE: Le fichier level-complete.json est vide ou ne contient aucune donnée.\n\nUtilisez l\'éditeur de niveau pour créer un niveau valide.');
        }

        // Vérifier la structure minimale requise
        if (!levelData.mechanics) {
            throw new Error('❌ STRUCTURE INVALIDE: Le fichier level-complete.json doit contenir une section "mechanics".\n\nFormat requis: { "mechanics": { "cards": {...}, "catastropheMax": 3, "healthMax": 3 }, ... }');
        }

        if (!levelData.mechanics.cards) {
            throw new Error('❌ CARTES MANQUANTES: La section "mechanics" doit contenir les définitions de cartes.\n\nFormat requis: "mechanics": { "cards": { "success_triumph": {...}, ... } }');
        }

        console.log('✅ Fichier chargé: level-complete.json');
        await initializeGame(levelData);

    } catch (error) {
        console.error('❌ Erreur lors du chargement:', error);

        // Message d'erreur détaillé pour l'utilisateur
        let errorMessage = error.message;

        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMessage = '❌ ERREUR RÉSEAU: Impossible de charger le fichier.\n\nAssurez-vous d\'ouvrir le jeu via un serveur web (pas en file://).\n\nUtilisez:\n• python -m http.server\n• npx http-server\n• php -S localhost:8000';
        }

        alert(errorMessage);
    }
}

// Lancer le jeu au chargement de la page
main();
