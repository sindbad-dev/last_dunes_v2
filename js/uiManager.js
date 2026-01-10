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

        this.cardDefinitions = {};
        this.currentChallenge = null;
        this.gameLogic = null;
    }

    init(cardDefs) {
        this.cardDefinitions = cardDefs;
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

        // Show dialogue
        this.dialogueText.textContent = challengeData.dialogue_preview;

        // Generate cards
        this.renderCards(challengeData, gameLogic);

        // Show overlay
        this.overlay.classList.remove('hidden');
    }

    renderCards(challengeData, gameLogic) {
        this.cardsArea.innerHTML = '';

        const cardTypes = ['success_narrow', 'success_triumph', 'fail_narrow', 'fail_catastrophic'];

        for (let cardType of cardTypes) {
            const cardDef = this.cardDefinitions[cardType];
            const card = document.createElement('div');
            card.className = 'card';

            // Check if gauge is full
            const isCatastropheFull = gameLogic.catastropheLevel >= gameLogic.maxCatastrophe;

            // Disable success/fail cards if catastrophe is full
            if (isCatastropheFull && (cardType === 'success_narrow' || cardType === 'success_triumph' || cardType === 'fail_narrow')) {
                card.classList.add('disabled');
            }

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

            // Preview text
            const preview = document.createElement('p');
            preview.textContent = challengeData.outcomes[cardType].substring(0, 60) + '...';
            preview.style.fontSize = '10px';
            preview.style.fontStyle = 'italic';
            card.appendChild(preview);

            // Click handler
            card.addEventListener('click', () => {
                if (!card.classList.contains('disabled')) {
                    this.onCardSelected(cardType, cardDef);
                }
            });

            this.cardsArea.appendChild(card);
        }
    }

    onCardSelected(cardType, cardDef) {
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
        // Build story tree
        this.storyTree.innerHTML = '';

        history.forEach((entry, index) => {
            const node = document.createElement('div');
            node.className = 'story-node';

            const title = document.createElement('h3');
            title.textContent = `${index + 1}. ${entry.challenge}`;
            title.style.color = '#ffd700';
            node.appendChild(title);

            const choice = document.createElement('p');
            choice.textContent = `Choix: ${entry.choice}`;
            choice.style.fontStyle = 'italic';
            node.appendChild(choice);

            const result = document.createElement('p');
            result.textContent = entry.result;

            // Color code based on outcome
            if (entry.outcomeType.includes('success')) {
                result.style.color = '#4CAF50';
            } else if (entry.outcomeType.includes('fail_catastrophic')) {
                result.style.color = '#ff0000';
            } else {
                result.style.color = '#ff9800';
            }

            node.appendChild(result);
            this.storyTree.appendChild(node);
        });

        // Show Yggdrasil screen
        this.yggdrasilScreen.classList.remove('hidden');
    }
}
