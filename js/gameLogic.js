/**
 * Gère la logique du jeu : santé, catastrophe, résolution des cartes et historique
 */
class GameLogic {
    constructor(uiManager) {
        this.ui = uiManager;
        this.catastropheLevel = 0;
        this.maxCatastrophe = GAME_CONFIG.DEFAULT_CATASTROPHE_MAX;
        this.currentHealth = GAME_CONFIG.DEFAULT_HEALTH_MAX;
        this.maxHealth = GAME_CONFIG.DEFAULT_HEALTH_MAX;
        this.history = [];
        this.challengesSolved = 0;
        this.totalChallenges = 0;
    }

    /**
     * Initialise la logique de jeu avec les données du niveau
     * @param {Object} levelData - Données du niveau chargées depuis JSON
     */
    init(levelData) {
        // Validation des données
        if (!levelData || !levelData.challenges) {
            console.error('❌ levelData invalide ou manque challenges');
            return;
        }

        this.totalChallenges = levelData.challenges.length;

        // Charger les paramètres de santé depuis les données du niveau
        if (levelData.mechanics?.healthMax) {
            this.maxHealth = levelData.mechanics.healthMax;
            this.currentHealth = this.maxHealth;
        }

        // Charger le niveau de catastrophe max depuis les données du niveau
        if (levelData.mechanics?.catastropheMax) {
            this.maxCatastrophe = levelData.mechanics.catastropheMax;
        }

        // Réinitialiser le niveau de catastrophe au démarrage
        this.catastropheLevel = 0;
    }

    /**
     * Résout une carte jouée (standard ou optionnelle)
     * @param {string} cardType - Type de carte jouée (ex: 'success_triumph')
     * @param {Object} challengeData - Données du challenge actuel
     * @param {Object} cardDef - Définition de la carte
     * @param {boolean} isOptional - Indique si c'est une carte optionnelle
     */
    resolveCard(cardType, challengeData, cardDef, isOptional = false) {
        // Validation des paramètres
        if (!challengeData || !cardDef) {
            console.error('❌ Paramètres invalides pour resolveCard');
            return;
        }

        let actualOutcome = cardType;
        let narrativeResult = "";
        let wasForced = false;
        let healthEffect = 0;

        // MÉCANIQUE PRINCIPALE : Vérification Catastrophe
        // Si la jauge est pleine, force un échec catastrophique
        if (this.catastropheLevel >= this.maxCatastrophe && !isOptional) {
            console.log('!!! CATASTROPHE DÉCLENCHÉE !!!');
            actualOutcome = "fail_catastrophic";
            narrativeResult = `LA JAUGE EST PLEINE ! Le destin se retourne contre vous. ${challengeData.outcomes["fail_catastrophic"]}`;
            wasForced = true;
            this.catastropheLevel = 0; // Reset après la punition
        } else {
            // Résolution normale
            narrativeResult = isOptional
                ? (cardDef.outcomeText || challengeData.outcomes[cardType])
                : challengeData.outcomes[cardType];

            // Mise à jour de la jauge selon le coût de la carte
            const cost = isOptional ? (cardDef.cost || 0) : (cardDef.catastropheCost || 0);
            this.catastropheLevel += cost;

            // S'assurer que le niveau de catastrophe ne dépasse pas le max
            if (this.catastropheLevel > this.maxCatastrophe) {
                this.catastropheLevel = this.maxCatastrophe;
            }
        }

        // Appliquer les effets de santé
        healthEffect = this._applyHealthEffects(challengeData, actualOutcome, cardDef, isOptional);

        // Ajouter l'effet de santé au texte narratif
        if (healthEffect > 0) {
            narrativeResult += ` [+${healthEffect} ❤️]`;
        } else if (healthEffect < 0) {
            narrativeResult += ` [${healthEffect} ❤️]`;
        }

        // Sauvegarder dans l'historique
        this._addToHistory(challengeData, cardDef, actualOutcome, narrativeResult, healthEffect, wasForced, isOptional);

        // Mise à jour de l'interface
        this.ui.updateGauge(this.catastropheLevel);
        this.ui.updateHealthBar(this.currentHealth, this.maxHealth);
        this.ui.updateDeckState();

        // Ajouter la carte récompense au deck si c'est un succès et qu'il y en a une
        // IMPORTANT : Ne s'applique QUE pour les cartes standards, pas pour les cartes optionnelles
        if (!isOptional && challengeData.rewardCard && (actualOutcome === 'success_triumph' || actualOutcome === 'success_narrow')) {
            console.log(`✨ Carte récompense débloquée: ${challengeData.rewardCard.label}`);
            this.ui.addOptionalCard(challengeData.rewardCard);
        }

        // Vérifier Game Over ou continuer
        this._handleOutcome(narrativeResult);
    }

    /**
     * Résout une carte optionnelle (wrapper pour compatibilité)
     * @param {Object} rewardCard - Carte optionnelle à résoudre
     * @param {Object} challengeData - Données du challenge
     */
    resolveOptionalCard(rewardCard, challengeData) {
        // Créer un objet cardDef compatible
        const cardDef = {
            label: rewardCard.label,
            catastropheCost: rewardCard.cost || 0,
            cost: rewardCard.cost || 0,
            outcomeText: rewardCard.outcomeText,
            icon: rewardCard.icon
        };

        // Utiliser la méthode unifiée
        this.resolveCard(rewardCard.outcomeType, challengeData, cardDef, true);
    }

    /**
     * Applique les effets de santé d'une carte
     * @private
     * @returns {number} L'effet de santé appliqué
     */
    _applyHealthEffects(challengeData, outcomeType, cardDef, isOptional) {
        let healthEffect = 0;

        // Déterminer l'effet de santé selon le type de carte
        if (isOptional && cardDef.healthChange !== undefined) {
            healthEffect = cardDef.healthChange;
        } else if (challengeData.healthEffects && challengeData.healthEffects[outcomeType] !== undefined) {
            healthEffect = challengeData.healthEffects[outcomeType];
        }

        // Appliquer l'effet
        if (healthEffect !== 0) {
            this.currentHealth += healthEffect;

            // Limiter la santé entre 0 et maxHealth
            this.currentHealth = Math.max(VALIDATION.MIN_HEALTH, Math.min(this.currentHealth, this.maxHealth));
        }

        return healthEffect;
    }

    /**
     * Ajoute une entrée à l'historique
     * @private
     */
    _addToHistory(challengeData, cardDef, outcomeType, narrativeResult, healthEffect, wasForced, isOptional) {
        // Limiter la taille de l'historique pour éviter les problèmes de mémoire
        if (this.history.length >= VALIDATION.MAX_HISTORY_ENTRIES) {
            console.warn('⚠️ Historique plein, suppression des anciennes entrées');
            this.history.shift(); // Retirer la plus ancienne entrée
        }

        const historyEntry = {
            challengeName: challengeData.name || challengeData.description,
            challengeIcon: challengeData.icon || '❓',
            challengeType: challengeData.type || 'challenge',
            cardPlayed: isOptional
                ? `${cardDef.label} ${cardDef.icon || CARD_CONFIG.OPTIONAL.ICON_DEFAULT}`
                : cardDef.label,
            cardType: isOptional ? `optional_${outcomeType}` : outcomeType,
            result: narrativeResult,
            outcomeType: outcomeType,
            catastropheCost: cardDef.catastropheCost || cardDef.cost || 0,
            healthEffect: healthEffect,
            wasForced: wasForced
        };

        this.history.push(historyEntry);
    }

    /**
     * Gère le résultat après la résolution d'une carte
     * @private
     */
    _handleOutcome(narrativeResult) {
        // Vérifier Game Over si santé à 0
        if (this.currentHealth <= 0) {
            this.ui.showResult(`${narrativeResult}\n\n${UI_TEXT.GAME_OVER}`, () => {
                this.ui.showYggdrasil(this.history);
            });
        } else {
            this.ui.showResult(narrativeResult, () => {
                this.checkEndGame();
            });
        }
    }

    /**
     * Vérifie si le jeu est terminé (tous les challenges résolus)
     */
    checkEndGame() {
        // Condition de fin : tous les challenges ont été visités
        if (this.history.length >= this.totalChallenges) {
            this.ui.showYggdrasil(this.history);
        }
    }
}
