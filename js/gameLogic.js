class GameLogic {
    constructor(uiManager) {
        this.ui = uiManager;
        this.catastropheLevel = 0;
        this.maxCatastrophe = 3;
        this.currentHealth = 3;
        this.maxHealth = 3;
        this.history = []; // Pour Yggdrasil
        this.challengesSolved = 0;
        this.totalChallenges = 0;
    }

    init(levelData) {
        this.totalChallenges = levelData.challenges.length;
        // Load health max from level data
        if (levelData.mechanics && levelData.mechanics.healthMax) {
            this.maxHealth = levelData.mechanics.healthMax;
            this.currentHealth = this.maxHealth;
        }
    }

    // Appelé quand le joueur clique sur une carte
    resolveCard(cardType, challengeData, cardDef) {
        let actualOutcome = cardType;
        let narrativeResult = "";
        let wasForced = false;
        let healthEffect = 0;

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

        // Apply health effects
        if (challengeData.healthEffects && challengeData.healthEffects[actualOutcome] !== undefined) {
            healthEffect = challengeData.healthEffects[actualOutcome];
            this.currentHealth += healthEffect;

            // Clamp health between 0 and maxHealth
            if (this.currentHealth > this.maxHealth) {
                this.currentHealth = this.maxHealth;
            }
            if (this.currentHealth < 0) {
                this.currentHealth = 0;
            }

            // Add health effect to narrative
            if (healthEffect > 0) {
                narrativeResult += ` [+${healthEffect} ❤️]`;
            } else if (healthEffect < 0) {
                narrativeResult += ` [${healthEffect} ❤️]`;
            }
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
            healthEffect: healthEffect,
            wasForced: wasForced
        });

        // Mise à jour UI
        this.ui.updateGauge(this.catastropheLevel);
        this.ui.updateHealthBar(this.currentHealth, this.maxHealth);
        this.ui.updateDeckState();

        // Check for game over due to health
        if (this.currentHealth <= 0) {
            this.ui.showResult(narrativeResult + "\n\n💀 GAME OVER - Vous êtes mort !", () => {
                this.ui.showYggdrasil(this.history);
            });
        } else {
            this.ui.showResult(narrativeResult, () => {
                this.checkEndGame();
            });
        }
    }

    checkEndGame() {
        // Condition de fin simplifiée pour le prototype
        if (this.history.length >= this.totalChallenges) {
            this.ui.showYggdrasil(this.history);
        }
    }
}