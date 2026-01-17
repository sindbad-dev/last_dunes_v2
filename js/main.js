console.log("Last Dunes - Initialisation...");

const ui = new UIManager();
const logic = new GameLogic(ui);
const engine = new MapEngine("gameCanvas");

/**
 * Enrichit les challenges avec les données de l'arbre narratif
 */
function enrichChallengesWithNarrative(challenges, narrativeTree) {
    if (!narrativeTree || !narrativeTree.nodes) {
        console.warn("⚠️ Pas d'arbre narratif fourni, utilisation des challenges bruts");
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

// Chargement des données depuis level-complete.json uniquement
fetch('data/level-complete.json')
.then(response => {
    if (!response.ok) {
        throw new Error(`Impossible de charger level-complete.json: ${response.status}`);
    }
    return response.json();
})
.then(levelData => {
    console.log("✅ Fichier chargé: level-complete.json");

    // Vérifier que les données essentielles sont présentes
    if (!levelData.mechanics || !levelData.mechanics.cards) {
        throw new Error("Le fichier level-complete.json doit contenir une section 'mechanics' avec les définitions de cartes");
    }

    // Configurer le niveau
    const levelInfo = {
        name: levelData.name || "Niveau Personnalisé",
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

    // Boucle de jeu
    engine.onPlayerMove((pos) => {
        const challenge = engine.checkCollision(pos);
        if (challenge && !challenge.visited) {
            challenge.visited = true;
            ui.triggerChallenge(challenge, logic);
        }
    });

    engine.start();
    console.log("✅ Jeu démarré avec succès!");
    console.log(`📍 Niveau: ${levelInfo.name}`);
})
.catch(error => {
    console.error("❌ Erreur lors du chargement:", error);
    alert("Erreur: " + error.message + "\n\nAssurez-vous d'ouvrir le fichier via un serveur web (pas en file://)");
});