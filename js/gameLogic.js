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
        this.rewardCards = []; // Cartes spéciales obtenues
    }

    init(levelData) {
        this.totalChallenges = levelData.challenges.length;
        // Load health max from level data
        if (levelData.mechanics && levelData.mechanics.healthMax) {
            this.maxHealth = levelData.mechanics.healthMax;
            this.currentHealth = this.maxHealth;
        }
        // Load catastrophe max from level data
        if (levelData.mechanics && levelData.mechanics.catastropheMax) {
            this.maxCatastrophe = levelData.mechanics.catastropheMax;
        }
        // Reset catastrophe level at game start
        this.catastropheLevel = 0;
    }

    // Appelé quand le joueur clique sur une carte
    resolveCard(cardType, challengeData, cardDef) {
        let actualOutcome = cardType;
        let narrativeResult = "";
        let wasForced = false;
        let healthEffect = 0;
        let isRewardCard = cardDef.isReward || false;
        let skipCatastrophe = false;

        // Gestion des effets spéciaux des cartes récompense
        if (isRewardCard && cardDef.specialEffect === 'skip_catastrophe') {
            skipCatastrophe = true;
        }

        // MÉCANIQUE PRINCIPALE : Vérification Catastrophe
        if (this.catastropheLevel >= this.maxCatastrophe) {
            console.log("!!! CATASTROPHE DECLENCHÉE !!!");
            actualOutcome = "fail_catastrophic";
            narrativeResult = "LA JAUGE EST PLEINE ! Le destin se retourne contre vous. " + challengeData.outcomes["fail_catastrophic"];
            wasForced = true;
            this.catastropheLevel = 0; // Reset après la punition
        } else {
            // Résolution normale
            // Si c'est une carte récompense, utiliser son outcomeText personnalisé
            if (isRewardCard && cardDef.outcomeText) {
                narrativeResult = cardDef.outcomeText;
                // Utiliser l'outcomeType de la carte récompense pour déterminer le résultat
                actualOutcome = cardDef.outcomeType || cardType;
            } else {
                narrativeResult = challengeData.outcomes[cardType];
            }

            // Mise à jour de la jauge selon le coût de la carte
            // Sauf si c'est une carte avec effet spécial "skip_catastrophe"
            if (!skipCatastrophe) {
                this.catastropheLevel += cardDef.catastropheCost;
            } else {
                narrativeResult += " 🛡️ [La jauge de catastrophe n'augmente pas !]";
            }
        }

        // Apply health effects
        // Si c'est une carte récompense, utiliser son healthChange
        if (isRewardCard && cardDef.healthChange !== undefined && cardDef.healthChange !== 0) {
            healthEffect = cardDef.healthChange;
        } else if (challengeData.healthEffects && challengeData.healthEffects[actualOutcome] !== undefined) {
            healthEffect = challengeData.healthEffects[actualOutcome];
        }

        if (healthEffect !== 0) {
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

        // Décrémenter les utilisations de la carte récompense si utilisée
        if (isRewardCard && cardDef.remainingUses !== undefined) {
            cardDef.remainingUses--;
            if (cardDef.remainingUses <= 0) {
                // Retirer la carte du deck
                const index = this.rewardCards.findIndex(c => c.id === cardDef.id);
                if (index !== -1) {
                    this.rewardCards.splice(index, 1);
                }
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
            catastropheCost: skipCatastrophe ? 0 : (cardDef.catastropheCost || 0),
            healthEffect: healthEffect,
            wasForced: wasForced
        });

        // Vérifier si une carte récompense doit être obtenue
        let rewardObtained = null;
        if (!wasForced && challengeData.rewardCard) {
            const reward = challengeData.rewardCard;
            const triggerCard = reward.triggerCard;

            // Vérifier si la condition d'obtention est remplie
            let shouldObtain = false;
            if (triggerCard === 'any') {
                shouldObtain = true;
            } else if (triggerCard === 'any_success' && (cardType === 'success_triumph' || cardType === 'success_narrow')) {
                shouldObtain = true;
            } else if (triggerCard === cardType) {
                shouldObtain = true;
            }

            if (shouldObtain) {
                rewardObtained = this.addRewardCard(reward);
            }
        }

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
            // Afficher la notification de carte obtenue si applicable
            if (rewardObtained) {
                this.ui.showResult(narrativeResult, () => {
                    this.ui.showRewardObtained(rewardObtained, () => {
                        this.checkEndGame();
                    });
                });
            } else {
                this.ui.showResult(narrativeResult, () => {
                    this.checkEndGame();
                });
            }
        }
    }

    addRewardCard(rewardConfig) {
        // Créer un ID unique pour cette carte
        const cardId = `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const rewardCard = {
            id: cardId,
            name: rewardConfig.name,
            label: rewardConfig.label,
            description: rewardConfig.description,
            icon: rewardConfig.icon,
            specialEffect: rewardConfig.specialEffect,
            catastropheCost: rewardConfig.cost,
            outcomeType: rewardConfig.outcomeType,
            outcomeText: rewardConfig.outcomeText,
            healthChange: rewardConfig.healthChange,
            uses: rewardConfig.uses,
            remainingUses: rewardConfig.uses,
            isReward: true
        };

        this.rewardCards.push(rewardCard);
        this.ui.addRewardCardToDeck(rewardCard);

        return rewardCard;
    }

    checkEndGame() {
        // Condition de fin simplifiée pour le prototype
        if (this.history.length >= this.totalChallenges) {
            this.ui.showYggdrasil(this.history);
        }
    }
}