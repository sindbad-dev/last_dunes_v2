class UIManager {
    constructor() {
        this.overlay = document.getElementById('challenge-overlay');
        this.dialogueText = document.getElementById('dialogue-text');
        this.cardsArea = document.getElementById('cards-area');
        this.yggdrasilScreen = document.getElementById('yggdrasil-screen');
        this.storyTree = document.getElementById('story-tree');

        this.gaugeSegments = [
            document.getElementById('seg-1'),
            document.getElementById('seg-2'),
            document.getElementById('seg-3')
        ];

        this.healthBar = document.getElementById('health-bar');

        // Persistent deck
        this.persistentDeck = document.getElementById('persistent-deck');
        this.persistentCardsArea = document.getElementById('persistent-cards-area');

        // History overlay
        this.historyOverlay = document.getElementById('history-overlay');
        this.historyContent = document.getElementById('history-content');
        this.historyButton = document.getElementById('history-button');
        this.closeHistoryButton = document.getElementById('close-history');

        this.cardDefinitions = {};
        this.currentChallenge = null;
        this.gameLogic = null;

        // Setup history button handlers
        this.setupHistoryHandlers();
    }

    init(cardDefs) {
        this.cardDefinitions = cardDefs;
    }

    setupHistoryHandlers() {
        // Open history overlay
        this.historyButton.addEventListener('click', () => {
            this.showHistory();
        });

        // Close history overlay
        this.closeHistoryButton.addEventListener('click', () => {
            this.closeHistory();
        });

        // Close on overlay background click
        this.historyOverlay.addEventListener('click', (e) => {
            if (e.target === this.historyOverlay) {
                this.closeHistory();
            }
        });
    }

    showHistory() {
        if (!this.gameLogic || this.gameLogic.history.length === 0) {
            this.historyContent.innerHTML = '';
            this.historyOverlay.classList.remove('hidden');
            return;
        }

        // Build history content using same format as Yggdrasil
        this.historyContent.innerHTML = '';

        const history = this.gameLogic.history;

        // Add summary header
        const summary = document.createElement('div');
        summary.className = 'recap-summary';
        summary.innerHTML = `
            <p>${history.length} choix effectué${history.length > 1 ? 's' : ''} jusqu'à présent</p>
        `;
        this.historyContent.appendChild(summary);

        // Create timeline
        history.forEach((entry, index) => {
            const node = document.createElement('div');
            node.className = 'story-node';

            // Add outcome class for styling
            let outcomeClass = '';
            if (entry.outcomeType.includes('success_triumph')) {
                outcomeClass = 'outcome-triumph';
            } else if (entry.outcomeType.includes('success_narrow')) {
                outcomeClass = 'outcome-success';
            } else if (entry.outcomeType.includes('fail_catastrophic')) {
                outcomeClass = 'outcome-catastrophic';
            } else {
                outcomeClass = 'outcome-fail';
            }
            node.classList.add(outcomeClass);

            // Challenge header with icon
            const header = document.createElement('div');
            header.className = 'challenge-header';
            header.innerHTML = `
                <span class="challenge-number">#${index + 1}</span>
                <span class="challenge-icon">${entry.challengeIcon || '❓'}</span>
                <h3 class="challenge-title">${entry.challengeName || entry.challenge}</h3>
            `;
            node.appendChild(header);

            // Challenge type badge
            const typeBadge = document.createElement('span');
            typeBadge.className = 'challenge-type-badge';
            const typeEmoji = entry.challengeType === 'boss' ? '👑' :
                            entry.challengeType === 'interaction' ? '💬' : '⚔️';
            typeBadge.textContent = `${typeEmoji} ${entry.challengeType}`;
            header.appendChild(typeBadge);

            // Card played section
            const cardSection = document.createElement('div');
            cardSection.className = 'card-played-section';

            const cardTitle = document.createElement('div');
            cardTitle.className = 'section-title';
            cardTitle.textContent = '🎴 Carte jouée';
            cardSection.appendChild(cardTitle);

            const cardInfo = document.createElement('div');
            cardInfo.className = 'card-info';

            let healthBadge = '';
            if (entry.healthEffect !== undefined && entry.healthEffect !== 0) {
                if (entry.healthEffect > 0) {
                    healthBadge = `<span class="health-effect positive">+${entry.healthEffect} ❤️</span>`;
                } else {
                    healthBadge = `<span class="health-effect negative">${entry.healthEffect} ❤️</span>`;
                }
            }

            cardInfo.innerHTML = `
                <strong>${entry.cardPlayed}</strong>
                ${entry.catastropheCost > 0 ? `<span class="catastrophe-cost">+${entry.catastropheCost} ⚠️</span>` : ''}
                ${healthBadge}
                ${entry.wasForced ? '<span class="forced-badge">⚡ FORCÉ PAR LA JAUGE</span>' : ''}
            `;
            cardSection.appendChild(cardInfo);
            node.appendChild(cardSection);

            // Result section
            const resultSection = document.createElement('div');
            resultSection.className = 'result-section';

            const resultTitle = document.createElement('div');
            resultTitle.className = 'section-title';
            resultTitle.textContent = '📖 Résultat';
            resultSection.appendChild(resultTitle);

            const resultText = document.createElement('p');
            resultText.className = 'result-text';
            resultText.textContent = entry.result;
            resultSection.appendChild(resultText);

            node.appendChild(resultSection);

            // Add connector line (except for last item)
            if (index < history.length - 1) {
                const connector = document.createElement('div');
                connector.className = 'timeline-connector';
                this.historyContent.appendChild(node);
                this.historyContent.appendChild(connector);
            } else {
                this.historyContent.appendChild(node);
            }
        });

        this.historyOverlay.classList.remove('hidden');
    }

    closeHistory() {
        this.historyOverlay.classList.add('hidden');
    }

    initPersistentDeck(gameLogic) {
        this.gameLogic = gameLogic;
        this.persistentCardsArea.innerHTML = '';

        const cardTypes = ['success_triumph', 'success_narrow', 'fail_narrow', 'fail_catastrophic'];
        const cardIcons = {
            'success_triumph': '✨',
            'success_narrow': '✓',
            'fail_narrow': '⚠️',
            'fail_catastrophic': '💀'
        };

        for (let cardType of cardTypes) {
            const cardDef = this.cardDefinitions[cardType];
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.cardType = cardType;

            // Card icon
            const icon = document.createElement('div');
            icon.className = 'card-icon';
            icon.textContent = cardIcons[cardType];
            card.appendChild(icon);

            // Card title
            const title = document.createElement('h3');
            title.textContent = cardDef.label;
            card.appendChild(title);

            // Card cost
            const cost = document.createElement('p');
            if (cardDef.catastropheCost > 0) {
                cost.textContent = `Catastrophe: +${cardDef.catastropheCost}`;
                cost.style.color = '#cc0000';
            } else {
                cost.textContent = 'Aucun coût';
                cost.style.color = '#666';
            }
            card.appendChild(cost);

            // Click handler
            card.addEventListener('click', () => {
                if (!card.classList.contains('disabled') && !this.persistentDeck.classList.contains('disabled')) {
                    this.onCardSelected(cardType, cardDef);
                }
            });

            this.persistentCardsArea.appendChild(card);
        }
    }

    enableDeck() {
        this.persistentDeck.classList.remove('disabled');
        this.updateDeckState();
    }

    disableDeck() {
        this.persistentDeck.classList.add('disabled');
    }

    updateDeckState() {
        if (!this.gameLogic) return;

        const cards = this.persistentCardsArea.querySelectorAll('.card');
        const isCatastropheFull = this.gameLogic.catastropheLevel >= this.gameLogic.maxCatastrophe;

        cards.forEach(card => {
            const cardType = card.dataset.cardType;

            // Disable success/fail cards if catastrophe is full
            if (isCatastropheFull && (cardType === 'success_narrow' || cardType === 'success_triumph' || cardType === 'fail_narrow')) {
                card.classList.add('disabled');
            } else {
                card.classList.remove('disabled');
            }
        });
    }

    updateHealthBar(currentHealth, maxHealth) {
        // Clear existing hearts
        this.healthBar.innerHTML = '';

        // Generate hearts based on max health
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

    updateGauge(level) {
        // Update gauge visual state
        for (let i = 0; i < this.gaugeSegments.length; i++) {
            if (i < level) {
                this.gaugeSegments[i].classList.add('active');
            } else {
                this.gaugeSegments[i].classList.remove('active');
            }
        }

        // Add blink effect if at max
        if (level >= 3) {
            this.gaugeSegments.forEach(seg => seg.classList.add('blink'));
        } else {
            this.gaugeSegments.forEach(seg => seg.classList.remove('blink'));
        }
    }

    triggerChallenge(challengeData, gameLogic) {
        this.currentChallenge = challengeData;
        this.gameLogic = gameLogic;

        // Display challenge title
        const titleElement = document.getElementById('challenge-title');
        titleElement.textContent = `${challengeData.icon} ${challengeData.name}`;

        // Display challenge image (if available)
        const imageContainer = document.getElementById('challenge-image');
        if (challengeData.image) {
            imageContainer.innerHTML = `<img src="${challengeData.image}" alt="${challengeData.name}">`;
        } else {
            // Show placeholder with challenge icon
            imageContainer.innerHTML = `<div class="image-placeholder">${challengeData.icon}</div>`;
        }

        // Show dialogue
        this.dialogueText.textContent = challengeData.dialogue_preview;

        // Generate cards in overlay (for results preview)
        this.renderCards(challengeData, gameLogic);

        // Enable persistent deck
        this.enableDeck();

        // Show overlay
        this.overlay.classList.remove('hidden');
    }

    renderCards(challengeData, gameLogic) {
        this.cardsArea.innerHTML = '';

        // Create results preview section
        const resultsPreview = document.createElement('div');
        resultsPreview.className = 'challenge-results-preview';

        const previewTitle = document.createElement('h3');
        previewTitle.textContent = 'Résultats possibles :';
        previewTitle.className = 'results-preview-title';
        resultsPreview.appendChild(previewTitle);

        const resultsList = document.createElement('div');
        resultsList.className = 'results-list';

        const cardTypes = ['success_triumph', 'success_narrow', 'fail_narrow', 'fail_catastrophic'];
        const cardIcons = {
            'success_triumph': '✨',
            'success_narrow': '✓',
            'fail_narrow': '⚠️',
            'fail_catastrophic': '💀'
        };

        for (let cardType of cardTypes) {
            const cardDef = this.cardDefinitions[cardType];
            const resultItem = document.createElement('div');
            resultItem.className = `result-item result-${cardType}`;

            const resultLabel = document.createElement('div');
            resultLabel.className = 'result-label';
            resultLabel.innerHTML = `${cardIcons[cardType]} <strong>${cardDef.label}</strong>`;

            const resultText = document.createElement('div');
            resultText.className = 'result-text-preview';
            resultText.textContent = challengeData.outcomes[cardType];

            resultItem.appendChild(resultLabel);
            resultItem.appendChild(resultText);
            resultsList.appendChild(resultItem);
        }

        resultsPreview.appendChild(resultsList);
        this.cardsArea.appendChild(resultsPreview);

        // Add instruction for persistent menu
        const instruction = document.createElement('div');
        instruction.className = 'menu-instruction';
        instruction.innerHTML = '<p><strong>👇 Utilisez le menu de cartes en bas de l\'écran pour choisir votre action</strong></p>';
        instruction.style.textAlign = 'center';
        instruction.style.marginTop = '20px';
        instruction.style.padding = '15px';
        instruction.style.background = 'rgba(255, 255, 255, 0.1)';
        instruction.style.borderRadius = '5px';
        instruction.style.color = '#ffeb3b';
        this.cardsArea.appendChild(instruction);
    }

    onCardSelected(cardType, cardDef) {
        // Disable deck
        this.disableDeck();

        // Hide overlay
        this.overlay.classList.add('hidden');

        // Resolve through game logic
        this.gameLogic.resolveCard(cardType, this.currentChallenge, cardDef);
    }

    showResult(narrativeText, onContinue) {
        // Create a modal for result
        const modal = document.createElement('div');
        modal.style.position = 'absolute';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.background = '#fff';
        modal.style.color = '#000';
        modal.style.padding = '30px';
        modal.style.borderRadius = '10px';
        modal.style.maxWidth = '500px';
        modal.style.zIndex = '100';
        modal.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';

        const text = document.createElement('p');
        text.textContent = narrativeText;
        text.style.marginBottom = '20px';
        modal.appendChild(text);

        const button = document.createElement('button');
        button.textContent = 'Continuer';
        button.style.padding = '10px 20px';
        button.style.cursor = 'pointer';
        button.style.background = '#4CAF50';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.fontSize = '16px';

        button.addEventListener('click', () => {
            document.body.removeChild(modal);
            if (onContinue) onContinue();
        });

        modal.appendChild(button);
        document.body.appendChild(modal);
    }

    showYggdrasil(history) {
        // Build story tree with enhanced UI
        this.storyTree.innerHTML = '';

        // Add summary header
        const summary = document.createElement('div');
        summary.className = 'recap-summary';
        summary.innerHTML = `
            <h2>📜 Récapitulatif de votre aventure</h2>
            <p>${history.length} challenge${history.length > 1 ? 's' : ''} rencontré${history.length > 1 ? 's' : ''}</p>
        `;
        this.storyTree.appendChild(summary);

        // Create timeline
        history.forEach((entry, index) => {
            const node = document.createElement('div');
            node.className = 'story-node';

            // Add outcome class for styling
            let outcomeClass = '';
            if (entry.outcomeType.includes('success_triumph')) {
                outcomeClass = 'outcome-triumph';
            } else if (entry.outcomeType.includes('success_narrow')) {
                outcomeClass = 'outcome-success';
            } else if (entry.outcomeType.includes('fail_catastrophic')) {
                outcomeClass = 'outcome-catastrophic';
            } else {
                outcomeClass = 'outcome-fail';
            }
            node.classList.add(outcomeClass);

            // Challenge header with icon
            const header = document.createElement('div');
            header.className = 'challenge-header';
            header.innerHTML = `
                <span class="challenge-number">#${index + 1}</span>
                <span class="challenge-icon">${entry.challengeIcon || '❓'}</span>
                <h3 class="challenge-title">${entry.challengeName || entry.challenge}</h3>
            `;
            node.appendChild(header);

            // Challenge type badge
            const typeBadge = document.createElement('span');
            typeBadge.className = 'challenge-type-badge';
            const typeEmoji = entry.challengeType === 'boss' ? '👑' :
                            entry.challengeType === 'interaction' ? '💬' : '⚔️';
            typeBadge.textContent = `${typeEmoji} ${entry.challengeType}`;
            header.appendChild(typeBadge);

            // Card played section
            const cardSection = document.createElement('div');
            cardSection.className = 'card-played-section';

            const cardTitle = document.createElement('div');
            cardTitle.className = 'section-title';
            cardTitle.textContent = '🎴 Carte jouée';
            cardSection.appendChild(cardTitle);

            const cardInfo = document.createElement('div');
            cardInfo.className = 'card-info';

            let healthBadge = '';
            if (entry.healthEffect !== undefined && entry.healthEffect !== 0) {
                if (entry.healthEffect > 0) {
                    healthBadge = `<span class="health-effect positive">+${entry.healthEffect} ❤️</span>`;
                } else {
                    healthBadge = `<span class="health-effect negative">${entry.healthEffect} ❤️</span>`;
                }
            }

            cardInfo.innerHTML = `
                <strong>${entry.cardPlayed}</strong>
                ${entry.catastropheCost > 0 ? `<span class="catastrophe-cost">+${entry.catastropheCost} ⚠️</span>` : ''}
                ${healthBadge}
                ${entry.wasForced ? '<span class="forced-badge">⚡ FORCÉ PAR LA JAUGE</span>' : ''}
            `;
            cardSection.appendChild(cardInfo);
            node.appendChild(cardSection);

            // Result section
            const resultSection = document.createElement('div');
            resultSection.className = 'result-section';

            const resultTitle = document.createElement('div');
            resultTitle.className = 'section-title';
            resultTitle.textContent = '📖 Résultat';
            resultSection.appendChild(resultTitle);

            const resultText = document.createElement('p');
            resultText.className = 'result-text';
            resultText.textContent = entry.result;
            resultSection.appendChild(resultText);

            node.appendChild(resultSection);

            // Add connector line (except for last item)
            if (index < history.length - 1) {
                const connector = document.createElement('div');
                connector.className = 'timeline-connector';
                node.appendChild(connector);
            }

            this.storyTree.appendChild(node);
        });

        // Show Yggdrasil screen
        this.yggdrasilScreen.classList.remove('hidden');
    }
}
