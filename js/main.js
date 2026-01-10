console.log("Last Dunes - Initialisation...");

const ui = new UIManager();
const logic = new GameLogic(ui);
const engine = new MapEngine("gameCanvas");

// Chargement
fetch('data/level1.json')
    .then(response => {
        console.log("Fichier JSON chargé:", response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Données JSON parsées:", data);
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
        console.log("Jeu démarré avec succès!");
    })
    .catch(error => {
        console.error("Erreur lors du chargement:", error);
        alert("Erreur: " + error.message + "\n\nAssurez-vous d'ouvrir le fichier via un serveur web (pas en file://)");
    });