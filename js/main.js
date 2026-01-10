const ui = new UIManager();
const logic = new GameLogic(ui);
const engine = new MapEngine("gameCanvas");

// Chargement
fetch('data/level1.json')
    .then(response => response.json())
    .then(data => {
        engine.loadMap(data.levelInfo);
        engine.placeInteractables(data.challenges);
        logic.init(data);
        ui.init(data.mechanics.cards);
        
        // Boucle de jeu simple
        engine.onPlayerMove((pos) => {
            // Vérifier collision avec challenge
            const challenge = engine.checkCollision(pos);
            if (challenge && !challenge.visited) {
                challenge.visited = true; // Empêcher boucle
                ui.triggerChallenge(challenge, logic);
            }
        });
        
        engine.start();
    });