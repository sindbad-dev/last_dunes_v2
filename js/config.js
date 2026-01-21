/**
 * Configuration centralisée du jeu Last Dunes
 * Centralise toutes les constantes pour faciliter la maintenance
 */

const GAME_CONFIG = {
    // Paramètres du canvas et de la grille
    CANVAS_SIZE: 800,
    GRID_SIZE: 40,
    AVATAR_SIZE: 20,

    // Paramètres de jeu par défaut
    DEFAULT_HEALTH_MAX: 3,
    DEFAULT_CATASTROPHE_MAX: 3,

    // Couleurs de l'avatar
    AVATAR_COLOR: '#00ff00',
    AVATAR_BORDER_COLOR: '#ffffff',
    AVATAR_BORDER_WIDTH: 2,

    // Paramètres de rendu
    BACKGROUND_COLOR: '#2a2a2a',
    GRID_COLOR: '#444',

    // Texture des murs (pierre)
    WALL: {
        BASE_COLOR: '#3d2f27',
        SHADES: [
            '#2a1f1a', // Très sombre
            '#4a3a30', // Moyen
            '#554439', // Clair
            '#1f1812', // Presque noir
            '#6b5547'  // Accent clair
        ],
        MORTAR_COLOR: '#1a1410',
        BORDER_DARK: '#0d0a08',
        BORDER_LIGHT: '#5a4a3f',
        TEXTURE_BLOCKS: 8,
        OPACITY: 0.6
    },

    // Paramètres de l'eau
    WATER: {
        COLOR: '#1e90ff',
        BORDER_COLOR: '#0066cc',
        OPACITY: 0.6
    },

    // Paramètres des objets
    OBJECT: {
        FONT_SIZE: '28px',
        SHADOW_OFFSET: 2,
        SHADOW_OPACITY: 0.3
    },

    // Paramètres des challenges
    CHALLENGE: {
        FONT_SIZE: '24px',
        OPACITY: 0.6,
        BORDER_WIDTH: 2,
        DEFAULT_COLOR: '#ff00ff',
        DEFAULT_ICON: '?'
    }
};

/**
 * Configuration des cartes du jeu
 * Centralise les types, icônes et métadonnées des cartes
 */
const CARD_CONFIG = {
    // Types de cartes disponibles dans l'ordre d'affichage
    TYPES: ['success_triumph', 'success_narrow', 'fail_narrow', 'fail_catastrophic'],

    // Icônes associées à chaque type de carte
    ICONS: {
        'success_triumph': '✨',
        'success_narrow': '✓',
        'fail_narrow': '⚠️',
        'fail_catastrophic': '💀'
    },

    // Classes CSS pour le style des résultats
    OUTCOME_CLASSES: {
        'success_triumph': 'outcome-triumph',
        'success_narrow': 'outcome-success',
        'fail_narrow': 'outcome-fail',
        'fail_catastrophic': 'outcome-catastrophic'
    },

    // Emojis pour les types de challenges
    CHALLENGE_TYPE_ICONS: {
        'boss': '👑',
        'interaction': '💬',
        'default': '⚔️'
    },

    // Style des cartes optionnelles
    OPTIONAL: {
        GRADIENT: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        GRADIENT_LIGHT: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
        BORDER_COLOR: '#ffeb3b',
        BORDER_WIDTH: '2px',
        ICON_DEFAULT: '🎁'
    }
};

/**
 * Messages et textes de l'interface
 */
const UI_TEXT = {
    GAME_OVER: '💀 GAME OVER - Vous êtes mort !',
    CONTINUE: 'Continuer',
    CARD_PLAYED: '🎴 Carte jouée',
    RESULT: '📖 Résultat',
    NO_COST: 'Aucun coût',
    FORCED_BY_GAUGE: '⚡ FORCÉ PAR LA JAUGE',
    OPTIONAL_CARD_SUFFIX: '(Carte optionnelle',
    USES: 'Utilisations',
    POSSIBLE_OUTCOMES: 'Résultats possibles :',
    USE_DECK_INSTRUCTION: '👇 Utilisez le menu de cartes en bas de l\'écran pour choisir votre action',
    CATASTROPHE_COST: 'Catastrophe:',
    RECAP_TITLE: '📜 Récapitulatif de votre aventure',
    CHALLENGE_SINGULAR: 'challenge',
    CHALLENGE_PLURAL: 'challenges',
    ENCOUNTERED_SINGULAR: 'rencontré',
    ENCOUNTERED_PLURAL: 'rencontrés',
    CHOICE_SINGULAR: 'choix effectué',
    CHOICE_PLURAL: 'choix effectués',
    UNTIL_NOW: 'jusqu\'à présent'
};

/**
 * Constantes pour la validation et les limites
 */
const VALIDATION = {
    MAX_HISTORY_ENTRIES: 100, // Limite pour éviter la croissance infinie de l'historique
    MIN_HEALTH: 0,
    MAX_CATASTROPHE_LEVEL: 3
};
