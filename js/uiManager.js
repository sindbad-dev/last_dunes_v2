/**
 * Gère l'interface utilisateur : overlays, cartes, historique, affichage
 */
class UIManager {
    constructor() {
        // Éléments du DOM - overlay des challenges
        this.overlay = document.getElementById('challenge-overlay');
        this.dialogueText = document.getElementById('dialogue-text');
        this.cardsArea = document.getElementById('cards-area');
        this.yggdrasilScreen = document.getElementById('yggdrasil-screen');
        this.storyTree = document.getElementById('story-tree');

        // Éléments du DOM - jauge de catastrophe
        this.gaugeSegments = [
            document.getElementById('seg-1'),
            document.getElementById('seg-2'),
            document.getElementById('seg-3')
        ];

        // Éléments du DOM - barre de santé
        this.healthBar = document.getElementById('health-bar');

        // Éléments du DOM - deck persistant
        this.persistentDeck = document.getElementById('persistent-deck');
        this.persistentCardsArea = document.getElementById('persistent-cards-area');

        // Éléments du DOM - overlay d'historique
        this.historyOverlay = document.getElementById('history-overlay');
        this.historyContent = document.getElementById('history-content');
        this.historyButton = document.getElementById('history-button');
        this.closeHistoryButton = document.getElementById('close-history');

        // État interne
        this.cardDefinitions = {};
        this.currentChallenge = null;
        this.gameLogic = null;
        this.optionalCards = []; // Cartes optionnelles actives

        // Configuration des handlers
        this.setupHistoryHandlers();
    }

    /**
     * Initialise le gestionnaire UI avec les définitions de cartes
     * @param {Object} cardDefs - Définitions des cartes depuis level data
     */
    init(cardDefs) {
        this.cardDefinitions = cardDefs;
    }

    /**
     * Configure les gestionnaires d'événements pour l'historique
     */
    setupHistoryHandlers() {
        // Ouvrir l'overlay d'historique
        this.historyButton.addEventListener('click', () => {
            this.showHistory();
        });

        // Fermer l'overlay d'historique
        this.closeHistoryButton.addEventListener('click', () => {
            this.closeHistory();
        });

        // Fermer en cliquant sur l'arrière-plan
        this.historyOverlay.addEventListener('click', (e) => {
            if (e.target === this.historyOverlay) {
                this.closeHistory();
            }
        });
    }

    /**
     * Affiche l'overlay d'historique des choix
     */
    showHistory() {
        if (!this.gameLogic || this.gameLogic.history.length === 0) {
            this.historyContent.innerHTML = '';
            this.historyOverlay.classList.remove('hidden');
            return;
        }

        const history = this.gameLogic.history;

        // Construire le contenu de l'historique
        this.historyContent.innerHTML = '';

        // Ajouter un en-tête récapitulatif
        const summary = document.createElement('div');
        summary.className = 'recap-summary';
        const choiceText = history.length > 1 ? UI_TEXT.CHOICE_PLURAL : UI_TEXT.CHOICE_SINGULAR;
        summary.innerHTML = `<p>${history.length} ${choiceText} ${UI_TEXT.UNTIL_NOW}</p>`;
        this.historyContent.appendChild(summary);

        // Construire la timeline avec la méthode réutilisable
        this._buildHistoryTimeline(history, this.historyContent);

        this.historyOverlay.classList.remove('hidden');
    }

    /**
     * Ferme l'overlay d'historique
     */
    closeHistory() {
        this.historyOverlay.classList.add('hidden');
    }

    /**
     * Construit une timeline visuelle de l'historique
     * Méthode réutilisable partagée par showHistory() et showYggdrasil()
     * @private
     * @param {Array} history - Tableau des entrées d'historique
     * @param {HTMLElement} container - Conteneur DOM où insérer la timeline
     */
    _buildHistoryTimeline(history, container) {
        history.forEach((entry, index) => {
            const node = document.createElement('div');
            node.className = 'story-node';

            // Ajouter la classe CSS selon le type de résultat
            const outcomeClass = this._getOutcomeClass(entry.outcomeType);
            node.classList.add(outcomeClass);

            // En-tête du challenge avec icône
            const header = document.createElement('div');
            header.className = 'challenge-header';
            header.innerHTML = `
                <span class="challenge-number">#${index + 1}</span>
                <span class="challenge-icon">${entry.challengeIcon || '❓'}</span>
                <h3 class="challenge-title">${entry.challengeName || entry.challenge}</h3>
            `;
            node.appendChild(header);

            // Badge du type de challenge
            const typeBadge = document.createElement('span');
            typeBadge.className = 'challenge-type-badge';
            const typeEmoji = this._getChallengeTypeIcon(entry.challengeType);
            typeBadge.textContent = `${typeEmoji} ${entry.challengeType}`;
            header.appendChild(typeBadge);

            // Section carte jouée
            const cardSection = document.createElement('div');
            cardSection.className = 'card-played-section';

            const cardTitle = document.createElement('div');
            cardTitle.className = 'section-title';
            cardTitle.textContent = UI_TEXT.CARD_PLAYED;
            cardSection.appendChild(cardTitle);

            const cardInfo = document.createElement('div');
            cardInfo.className = 'card-info';

            // Badge d'effet de santé
            const healthBadge = this._createHealthBadge(entry.healthEffect);

            cardInfo.innerHTML = `
                <strong>${entry.cardPlayed}</strong>
                ${entry.catastropheCost > 0 ? `<span class="catastrophe-cost">+${entry.catastropheCost} ⚠️</span>` : ''}
                ${healthBadge}
                ${entry.wasForced ? `<span class="forced-badge">${UI_TEXT.FORCED_BY_GAUGE}</span>` : ''}
            `;
            cardSection.appendChild(cardInfo);
            node.appendChild(cardSection);

            // Section résultat
            const resultSection = document.createElement('div');
            resultSection.className = 'result-section';

            const resultTitle = document.createElement('div');
            resultTitle.className = 'section-title';
            resultTitle.textContent = UI_TEXT.RESULT;
            resultSection.appendChild(resultTitle);

            const resultText = document.createElement('p');
            resultText.className = 'result-text';
            resultText.textContent = entry.result;
            resultSection.appendChild(resultText);

            node.appendChild(resultSection);

            // Ajouter une ligne de connexion (sauf pour le dernier élément)
            if (index < history.length - 1) {
                const connector = document.createElement('div');
                connector.className = 'timeline-connector';
                container.appendChild(node);
                container.appendChild(connector);
            } else {
                container.appendChild(node);
            }
        });
    }

    /**
     * Retourne la classe CSS correspondant au type de résultat
     * @private
     * @param {string} outcomeType - Type de résultat (ex: 'success_triumph')
     * @returns {string} Classe CSS
     */
    _getOutcomeClass(outcomeType) {
        for (const [key, cssClass] of Object.entries(CARD_CONFIG.OUTCOME_CLASSES)) {
            if (outcomeType.includes(key)) {
                return cssClass;
            }
        }
        return 'outcome-fail'; // Par défaut
    }

    /**
     * Retourne l'icône emoji correspondant au type de challenge
     * @private
     * @param {string} challengeType - Type de challenge
     * @returns {string} Emoji
     */
    _getChallengeTypeIcon(challengeType) {
        return CARD_CONFIG.CHALLENGE_TYPE_ICONS[challengeType] || CARD_CONFIG.CHALLENGE_TYPE_ICONS.default;
    }

    /**
     * Crée le HTML pour un badge d'effet de santé
     * @private
     * @param {number} healthEffect - Effet de santé (+/-)
     * @returns {string} HTML du badge
     */
    _createHealthBadge(healthEffect) {
        if (healthEffect === undefined || healthEffect === 0) {
            return '';
        }

        if (healthEffect > 0) {
            return `<span class="health-effect positive">+${healthEffect} ❤️</span>`;
        } else {
            return `<span class="health-effect negative">${healthEffect} ❤️</span>`;
        }
    }

    /**
     * Initialise le deck persistant avec les cartes de base
     * @param {GameLogic} gameLogic - Instance de la logique de jeu
     */
    initPersistentDeck(gameLogic) {
        this.gameLogic = gameLogic;
        this.persistentCardsArea.innerHTML = '';

        for (let cardType of CARD_CONFIG.TYPES) {
            const cardDef = this.cardDefinitions[cardType];
            if (!cardDef) {
                console.warn(`⚠️ Définition manquante pour ${cardType}`);
                continue;
            }

            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.cardType = cardType;

            // Ajouter un tooltip avec le nom complet de la carte
            card.title = cardDef.label;

            // Icône de la carte
            const icon = document.createElement('div');
            icon.className = 'card-icon';
            icon.textContent = CARD_CONFIG.ICONS[cardType];
            card.appendChild(icon);

            // Titre de la carte
            const title = document.createElement('h3');
            title.textContent = cardDef.label;
            card.appendChild(title);

            // Coût de la carte
            const cost = document.createElement('p');
            cost.className = 'card-cost';
            if (cardDef.catastropheCost > 0) {
                cost.textContent = `${UI_TEXT.CATASTROPHE_COST} +${cardDef.catastropheCost}`;
            } else {
                cost.textContent = UI_TEXT.NO_COST;
            }
            card.appendChild(cost);

            // Gestionnaire de clic
            card.addEventListener('click', () => {
                if (!card.classList.contains('disabled') && !this.persistentDeck.classList.contains('disabled')) {
                    this.onCardSelected(cardType, cardDef);
                }
            });

            this.persistentCardsArea.appendChild(card);
        }
    }

    /**
     * Active le deck de cartes
     */
    enableDeck() {
        this.persistentDeck.classList.remove('disabled');
        this.updateDeckState();
    }

    /**
     * Désactive le deck de cartes
     */
    disableDeck() {
        this.persistentDeck.classList.add('disabled');
    }

    /**
     * Met à jour l'état des cartes (actives/désactivées) selon la jauge de catastrophe
     */
    updateDeckState() {
        if (!this.gameLogic) return;

        const cards = this.persistentCardsArea.querySelectorAll('.card');
        const isCatastropheFull = this.gameLogic.catastropheLevel >= this.gameLogic.maxCatastrophe;

        cards.forEach(card => {
            const cardType = card.dataset.cardType;

            // Désactiver les cartes success/fail si la jauge est pleine
            // Seule la carte fail_catastrophic reste disponible
            if (isCatastropheFull && cardType !== 'fail_catastrophic') {
                card.classList.add('disabled');
            } else {
                card.classList.remove('disabled');
            }
        });
    }

    /**
     * Ajoute une carte optionnelle au deck
     * @param {Object} rewardCard - Données de la carte optionnelle
     */
    addOptionalCard(rewardCard) {
        // Vérifier si la carte existe déjà
        const existingCard = this.optionalCards.find(c => c.name === rewardCard.name);
        if (existingCard) {
            return; // Ne pas ajouter si déjà présente
        }

        // Ajouter à la liste des cartes optionnelles
        this.optionalCards.push({...rewardCard});

        // Créer l'élément visuel de la carte
        const card = document.createElement('div');
        card.className = 'card optional-card';
        card.dataset.cardType = 'optional_' + rewardCard.name;
        card.dataset.optionalName = rewardCard.name;

        // Ajouter un tooltip avec la description complète
        const tooltipText = `${rewardCard.label}\n\n${rewardCard.description}`;
        card.title = tooltipText;

        // Icône de la carte
        const icon = document.createElement('div');
        icon.className = 'card-icon';
        icon.textContent = rewardCard.icon || CARD_CONFIG.OPTIONAL.ICON_DEFAULT;
        card.appendChild(icon);

        // Titre de la carte
        const title = document.createElement('h3');
        title.textContent = rewardCard.label;
        card.appendChild(title);

        // Description de la carte
        const description = document.createElement('p');
        description.className = 'card-description';
        description.textContent = rewardCard.description;
        card.appendChild(description);

        // Coût de la carte
        const cost = document.createElement('p');
        cost.className = 'card-cost';
        if (rewardCard.cost > 0) {
            cost.textContent = `${UI_TEXT.CATASTROPHE_COST} +${rewardCard.cost}`;
        } else {
            cost.textContent = UI_TEXT.NO_COST;
        }
        card.appendChild(cost);

        // Compteur d'utilisations
        const uses = document.createElement('div');
        uses.className = 'card-uses';
        const usesText = rewardCard.uses > 1 ? UI_TEXT.USES : UI_TEXT.USES.slice(0, -1); // Singulier/pluriel
        uses.textContent = `${usesText}: ${rewardCard.uses}`;
        card.appendChild(uses);

        // Gestionnaire de clic
        card.addEventListener('click', () => {
            if (!card.classList.contains('disabled') && !this.persistentDeck.classList.contains('disabled')) {
                this.onOptionalCardSelected(rewardCard);
            }
        });

        // Ajouter au deck
        this.persistentCardsArea.appendChild(card);
    }

    /**
     * Retire une carte optionnelle du deck
     * @param {string} cardName - Nom de la carte à retirer
     */
    removeOptionalCard(cardName) {
        // Retirer de la liste
        this.optionalCards = this.optionalCards.filter(c => c.name !== cardName);

        // Retirer du DOM
        const cardElement = this.persistentCardsArea.querySelector(`[data-optional-name="${cardName}"]`);
        if (cardElement) {
            cardElement.remove();
        }
    }

    /**
     * Décrémente le compteur d'utilisations d'une carte optionnelle
     * @param {string} cardName - Nom de la carte
     */
    decrementOptionalCardUse(cardName) {
        const card = this.optionalCards.find(c => c.name === cardName);
        if (!card) return;

        card.uses--;

        // Mettre à jour l'affichage
        const cardElement = this.persistentCardsArea.querySelector(`[data-optional-name="${cardName}"]`);
        if (cardElement) {
            const usesElement = cardElement.querySelector('.card-uses');
            if (usesElement) {
                const usesText = card.uses > 1 ? UI_TEXT.USES : UI_TEXT.USES.slice(0, -1);
                usesElement.textContent = `${usesText}: ${card.uses}`;
            }

            // Retirer la carte si plus d'utilisations
            if (card.uses <= 0) {
                this.removeOptionalCard(cardName);
            }
        }
    }

    /**
     * Met à jour l'affichage de la barre de santé
     * @param {number} currentHealth - Santé actuelle
     * @param {number} maxHealth - Santé maximale
     */
    updateHealthBar(currentHealth, maxHealth) {
        // Effacer les cœurs existants
        this.healthBar.innerHTML = '';

        // Générer les cœurs selon la santé max
        for (let i = 0; i < maxHealth; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart';

            if (i < currentHealth) {
                heart.classList.add('filled');
                heart.textContent = '❤️';
            } else {
                heart.classList.add('empty');
                heart.textContent = '🤍';
            }

            this.healthBar.appendChild(heart);
        }
    }

    /**
     * Met à jour l'affichage de la jauge de catastrophe
     * @param {number} level - Niveau de catastrophe actuel
     */
    updateGauge(level) {
        // Mettre à jour l'état visuel de la jauge
        for (let i = 0; i < this.gaugeSegments.length; i++) {
            if (i < level) {
                this.gaugeSegments[i].classList.add('active');
            } else {
                this.gaugeSegments[i].classList.remove('active');
            }
        }

        // Ajouter l'effet de clignotement si au max
        if (level >= VALIDATION.MAX_CATASTROPHE_LEVEL) {
            this.gaugeSegments.forEach(seg => seg.classList.add('blink'));
        } else {
            this.gaugeSegments.forEach(seg => seg.classList.remove('blink'));
        }
    }

    /**
     * Déclenche l'affichage d'un challenge
     * @param {Object} challengeData - Données du challenge
     * @param {GameLogic} gameLogic - Instance de la logique de jeu
     */
    triggerChallenge(challengeData, gameLogic) {
        this.currentChallenge = challengeData;
        this.gameLogic = gameLogic;

        // Afficher le titre du challenge
        const titleElement = document.getElementById('challenge-title');
        titleElement.textContent = `${challengeData.icon} ${challengeData.name}`;

        // Afficher l'image du challenge (si disponible)
        const imageContainer = document.getElementById('challenge-image');
        if (challengeData.image) {
            imageContainer.innerHTML = `<img src="${challengeData.image}" alt="${challengeData.name}">`;
        } else {
            // Placeholder avec icône du challenge
            imageContainer.innerHTML = `<div class="image-placeholder">${challengeData.icon}</div>`;
        }

        // Afficher le dialogue
        this.dialogueText.textContent = challengeData.dialogue_preview;

        // Générer l'aperçu des résultats
        this.renderCards(challengeData, gameLogic);

        // Activer le deck persistant
        this.enableDeck();

        // Afficher l'overlay
        this.overlay.classList.remove('hidden');
    }

    /**
     * Génère l'aperçu des cartes et résultats possibles
     * @param {Object} challengeData - Données du challenge
     * @param {GameLogic} gameLogic - Instance de la logique de jeu
     */
    renderCards(challengeData, gameLogic) {
        this.cardsArea.innerHTML = '';

        // Créer la section d'aperçu des résultats
        const resultsPreview = document.createElement('div');
        resultsPreview.className = 'challenge-results-preview';

        const previewTitle = document.createElement('h3');
        previewTitle.textContent = UI_TEXT.POSSIBLE_OUTCOMES;
        previewTitle.className = 'results-preview-title';
        resultsPreview.appendChild(previewTitle);

        const resultsList = document.createElement('div');
        resultsList.className = 'results-list';

        // Générer les aperçus pour chaque type de carte
        for (let cardType of CARD_CONFIG.TYPES) {
            const cardDef = this.cardDefinitions[cardType];
            if (!cardDef) continue;

            const resultItem = document.createElement('div');
            resultItem.className = `result-item result-${cardType}`;

            const resultLabel = document.createElement('div');
            resultLabel.className = 'result-label';
            resultLabel.innerHTML = `${CARD_CONFIG.ICONS[cardType]} <strong>${cardDef.label}</strong>`;

            const resultText = document.createElement('div');
            resultText.className = 'result-text-preview';
            resultText.textContent = challengeData.outcomes[cardType];

            resultItem.appendChild(resultLabel);
            resultItem.appendChild(resultText);
            resultsList.appendChild(resultItem);
        }

        // La carte récompense n'est pas affichée dans l'aperçu
        // Elle sera ajoutée au deck après résolution du challenge

        resultsPreview.appendChild(resultsList);
        this.cardsArea.appendChild(resultsPreview);

        // Ajouter l'instruction pour utiliser le menu
        const instruction = document.createElement('div');
        instruction.className = 'menu-instruction';
        instruction.innerHTML = `<p><strong>${UI_TEXT.USE_DECK_INSTRUCTION}</strong></p>`;
        this.cardsArea.appendChild(instruction);
    }

    /**
     * Gestionnaire de sélection d'une carte standard
     * @param {string} cardType - Type de carte sélectionnée
     * @param {Object} cardDef - Définition de la carte
     */
    onCardSelected(cardType, cardDef) {
        // Désactiver le deck
        this.disableDeck();

        // Masquer l'overlay
        this.overlay.classList.add('hidden');

        // Résoudre via la logique de jeu
        this.gameLogic.resolveCard(cardType, this.currentChallenge, cardDef);
    }

    /**
     * Gestionnaire de sélection d'une carte optionnelle
     * @param {Object} rewardCard - Carte optionnelle sélectionnée
     */
    onOptionalCardSelected(rewardCard) {
        // Désactiver le deck
        this.disableDeck();

        // Masquer l'overlay
        this.overlay.classList.add('hidden');

        // Décrémenter les utilisations
        this.decrementOptionalCardUse(rewardCard.name);

        // Résoudre via la logique de jeu
        this.gameLogic.resolveOptionalCard(rewardCard, this.currentChallenge);
    }

    /**
     * Affiche le résultat d'une action dans une modale
     * @param {string} narrativeText - Texte narratif du résultat
     * @param {Function} onContinue - Callback à appeler quand l'utilisateur continue
     */
    showResult(narrativeText, onContinue) {
        // Créer une modale pour le résultat
        const modal = document.createElement('div');
        modal.className = 'result-modal';

        const text = document.createElement('p');
        text.textContent = narrativeText;
        text.className = 'result-text';
        modal.appendChild(text);

        const button = document.createElement('button');
        button.textContent = UI_TEXT.CONTINUE;
        button.className = 'continue-button';

        button.addEventListener('click', () => {
            document.body.removeChild(modal);
            if (onContinue) onContinue();
        });

        modal.appendChild(button);
        document.body.appendChild(modal);
    }

    /**
     * Affiche l'écran final Yggdrasil avec le récapitulatif complet
     * @param {Array} history - Historique complet des choix
     */
    showYggdrasil(history) {
        // Construire l'arbre de l'histoire avec une UI enrichie
        this.storyTree.innerHTML = '';

        // Ajouter l'en-tête récapitulatif
        const summary = document.createElement('div');
        summary.className = 'recap-summary';
        const challengeText = history.length > 1 ? UI_TEXT.CHALLENGE_PLURAL : UI_TEXT.CHALLENGE_SINGULAR;
        const encounteredText = history.length > 1 ? UI_TEXT.ENCOUNTERED_PLURAL : UI_TEXT.ENCOUNTERED_SINGULAR;
        summary.innerHTML = `
            <h2>${UI_TEXT.RECAP_TITLE}</h2>
            <p>${history.length} ${challengeText} ${encounteredText}</p>
        `;
        this.storyTree.appendChild(summary);

        // Construire la timeline avec la méthode réutilisable
        this._buildHistoryTimeline(history, this.storyTree);

        // Afficher l'écran Yggdrasil
        this.yggdrasilScreen.classList.remove('hidden');
    }
}
