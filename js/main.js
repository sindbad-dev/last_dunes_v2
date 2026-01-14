console.log("Last Dunes - Initialisation...");

const ui = new UIManager();
const logic = new GameLogic(ui);
const engine = new MapEngine("gameCanvas");

// Chargement des données (challenges.json prioritaire, level1.json en fallback)
Promise.all([
    fetch('data/challenges.json').then(r => r.ok ? r.json() : null),
    fetch('data/level1.json').then(r => r.ok ? r.json() : null)
])
.then(([challengesData, gameData]) => {
    console.log("Fichiers chargés:", challengesData ? "challenges.json ✅" : "challenges.json ❌", gameData ? "level1.json ✅" : "level1.json ❌");

    let finalData;

    // Si challenges.json existe avec mechanics complets, l'utiliser en standalone
    if (challengesData && challengesData.mechanics) {
        const levelInfo = {
            name: "Niveau Personnalisé",
            mapFile: challengesData.mapFile,
            gridSize: challengesData.gridSize,
            startPos: challengesData.startPos
        };

        engine.loadMap(levelInfo);
        engine.placeInteractables(challengesData.challenges);
        engine.loadTerrain(challengesData.walls, challengesData.water, challengesData.objects);
        console.log(`✅ ${challengesData.challenges.length} challenges chargés depuis challenges.json (standalone)`);

        // Use challenges.json as complete data source
        finalData = {
            mechanics: challengesData.mechanics,
            challenges: challengesData.challenges
        };
    } else if (challengesData) {
        // Legacy format: challenges.json without mechanics, need level1.json fallback
        if (!gameData) {
            throw new Error("challenges.json existe mais level1.json est manquant. Utilisez l'éditeur pour exporter un fichier complet.");
        }

        const levelInfo = {
            name: "Niveau Personnalisé",
            mapFile: challengesData.mapFile,
            gridSize: challengesData.gridSize,
            startPos: challengesData.startPos
        };

        engine.loadMap(levelInfo);
        engine.placeInteractables(challengesData.challenges);
        engine.loadTerrain(challengesData.walls, challengesData.water, challengesData.objects);
        console.log(`⚠️ ${challengesData.challenges.length} challenges chargés depuis challenges.json (format legacy)`);

        // Override healthMax from challenges.json if available
        if (challengesData.maxHealth) {
            gameData.mechanics.healthMax = challengesData.maxHealth;
        }

        finalData = gameData;
    } else if (gameData) {
        // Fallback complet sur level1.json
        engine.loadMap(gameData.levelInfo);
        engine.placeInteractables(gameData.challenges);
        console.log(`✅ ${gameData.challenges.length} challenges chargés depuis level1.json (fallback)`);

        finalData = gameData;
    } else {
        throw new Error("Aucun fichier de niveau trouvé (challenges.json ou level1.json manquants)");
    }

    // Initialiser les mécaniques de jeu
    logic.init(finalData);
    ui.init(finalData.mechanics.cards);

    // Initialize health bar with starting values
    const startingHealth = finalData.mechanics.healthMax || 3;
    ui.updateHealthBar(startingHealth, startingHealth);

    // Initialize persistent deck
    ui.initPersistentDeck(logic);

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
})
.catch(error => {
    console.error("Erreur lors du chargement:", error);
    alert("Erreur: " + error.message + "\n\nAssurez-vous d'ouvrir le fichier via un serveur web (pas en file://)");
});