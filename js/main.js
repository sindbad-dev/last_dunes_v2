console.log("Last Dunes - Initialisation...");

const ui = new UIManager();
const logic = new GameLogic(ui);
const engine = new MapEngine("gameCanvas");

// Chargement des données (challenges.json pour la carte, level1.json pour les mécaniques)
Promise.all([
    fetch('data/challenges.json').then(r => r.ok ? r.json() : null),
    fetch('data/level1.json').then(r => r.json())
])
.then(([challengesData, gameData]) => {
    console.log("Fichiers chargés:", challengesData, gameData);

    // Si challenges.json existe, l'utiliser pour la carte et les challenges
    if (challengesData) {
        const levelInfo = {
            name: "Niveau Personnalisé",
            mapFile: challengesData.mapFile,
            gridSize: challengesData.gridSize,
            startPos: challengesData.startPos
        };

        engine.loadMap(levelInfo);
        engine.placeInteractables(challengesData.challenges);
        engine.loadTerrain(challengesData.walls, challengesData.water, challengesData.objects);
        console.log(`✅ ${challengesData.challenges.length} challenges chargés depuis challenges.json`);
    } else {
        // Fallback sur level1.json
        engine.loadMap(gameData.levelInfo);
        engine.placeInteractables(gameData.challenges);
        console.log(`✅ ${gameData.challenges.length} challenges chargés depuis level1.json`);
    }

    // Utiliser level1.json pour les mécaniques de jeu
    logic.init(gameData);
    ui.init(gameData.mechanics.cards);

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