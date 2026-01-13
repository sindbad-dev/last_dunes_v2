class GameLogic {
    constructor(uiManager) {
        this.ui = uiManager;
        this.catastropheLevel = 0;
        this.maxCatastrophe = 3;
        this.history = []; // Pour Yggdrasil
        this.challengesSolved = 0;
        this.totalChallenges = 0;
    }

    init(levelData) {
        this.totalChallenges = levelData.challenges.length;
    }

    // Appelé quand le joueur clique sur une carte
    resolveCard(cardType, challengeData, cardDef) {
        let actualOutcome = cardType;
        let narrativeResult = "";
        let wasForced = false;

        // MÉCANIQUE PRINCIPALE : Vérification Catastrophe
        if (this.catastropheLevel >= this.maxCatastrophe) {
            console.log("!!! CATASTROPHE DECLENCHÉE !!!");
            actualOutcome = "fail_catastrophic";
            narrativeResult = "LA JAUGE EST PLEINE ! Le destin se retourne contre vous. " + challengeData.outcomes["fail_catastrophic"];
            wasForced = true;
            this.catastropheLevel = 0; // Reset après la punition
        } else {
            // Résolution normale
            narrativeResult = challengeData.outcomes[cardType];

            // Mise à jour de la jauge selon le coût de la carte
            this.catastropheLevel += cardDef.catastropheCost;
        }

        // Sauvegarde pour l'arbre avec informations détaillées
        this.history.push({
            challengeName: challengeData.name || challengeData.description,
            challengeIcon: challengeData.icon || '❓',
            challengeType: challengeData.type || 'challenge',
            cardPlayed: cardDef.label,
            cardType: actualOutcome,
            result: narrativeResult,
            outcomeType: actualOutcome,
            catastropheCost: cardDef.catastropheCost || 0,
            wasForced: wasForced
        });

        // Mise à jour UI
        this.ui.updateGauge(this.catastropheLevel);
        this.ui.showResult(narrativeResult, () => {
            this.checkEndGame();
        });
    }

    checkEndGame() {
        // Condition de fin simplifiée pour le prototype
        if (this.history.length >= this.totalChallenges) {
            this.ui.showYggdrasil(this.history);
        }
    }
}