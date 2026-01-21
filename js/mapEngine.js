/**
 * Gère le rendu canvas, les déplacements et les collisions
 */
class MapEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // État de l'avatar
        this.avatar = {
            x: 0,
            y: 0,
            size: GAME_CONFIG.AVATAR_SIZE,
            color: GAME_CONFIG.AVATAR_COLOR
        };

        // Données de la carte
        this.gridSize = GAME_CONFIG.GRID_SIZE;
        this.mapImage = null;
        this.challenges = [];
        this.walls = [];
        this.water = [];
        this.objects = [];
        this.moveCallback = null;

        // État du clavier
        this.keys = {};
        this.setupKeyboard();
    }

    /**
     * Configure les événements clavier pour le contrôle de l'avatar
     */
    setupKeyboard() {
        // Écouter les touches pressées
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;

            // Empêcher le comportement par défaut pour les flèches
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    /**
     * Charge la carte et initialise la position de départ
     * @param {Object} levelInfo - Informations du niveau (taille grille, position départ, fichier carte)
     */
    loadMap(levelInfo) {
        this.gridSize = levelInfo.gridSize;

        // Définir la position de départ de l'avatar
        this.avatar.x = levelInfo.startPos.x * this.gridSize;
        this.avatar.y = levelInfo.startPos.y * this.gridSize;

        // Charger l'image de la carte
        this.mapImage = new Image();
        this.mapImage.onload = () => {
            console.log('✅ Carte chargée avec succès');
            this.render();
        };

        // Si l'image n'existe pas, créer un placeholder
        this.mapImage.onerror = () => {
            console.log('⚠️ Image de carte non trouvée, utilisation du placeholder');
            this.createPlaceholderMap();
        };

        this.mapImage.src = levelInfo.mapFile;
    }

    /**
     * Crée une carte placeholder simple si l'image n'est pas disponible
     */
    createPlaceholderMap() {
        this.mapImage = null;
        this.render();
    }

    /**
     * Place les challenges/interactables sur la carte
     * @param {Array} challenges - Tableau des challenges à placer
     */
    placeInteractables(challenges) {
        this.challenges = challenges.map(ch => ({
            ...ch,
            visited: false,
            color: ch.color || GAME_CONFIG.CHALLENGE.DEFAULT_COLOR,
            icon: ch.icon || GAME_CONFIG.CHALLENGE.DEFAULT_ICON
        }));
    }

    /**
     * Charge le terrain (murs, eau, objets)
     * @param {Array} walls - Positions des murs
     * @param {Array} water - Positions des zones d'eau
     * @param {Array} objects - Positions des objets décoratifs
     */
    loadTerrain(walls, water, objects) {
        this.walls = walls || [];
        this.water = water || [];
        this.objects = objects || [];
        console.log(`🌍 Terrain chargé: ${this.walls.length} murs, ${this.water.length} eau, ${this.objects.length} objets`);
    }

    /**
     * Vérifie si une position de grille est bloquée (mur ou eau)
     * @param {number} gridX - Coordonnée X de la grille
     * @param {number} gridY - Coordonnée Y de la grille
     * @returns {boolean} true si bloqué
     */
    isBlocked(gridX, gridY) {
        // Vérifier les murs
        if (this.walls.some(w => w.x === gridX && w.y === gridY)) {
            return true;
        }
        // Vérifier l'eau
        if (this.water.some(w => w.x === gridX && w.y === gridY)) {
            return true;
        }
        return false;
    }

    /**
     * Enregistre un callback appelé lors des déplacements du joueur
     * @param {Function} callback - Fonction appelée avec la position de grille
     */
    onPlayerMove(callback) {
        this.moveCallback = callback;
    }

    /**
     * Démarre la boucle de jeu
     */
    start() {
        this.gameLoop();
    }

    /**
     * Boucle de jeu principale
     */
    gameLoop() {
        this.handleInput();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Gère les entrées clavier et le déplacement de l'avatar
     */
    handleInput() {
        const oldX = this.avatar.x;
        const oldY = this.avatar.y;

        const speed = this.gridSize;
        let newX = this.avatar.x;
        let newY = this.avatar.y;

        // Touches ZQSD ou flèches
        if (this.keys['z'] || this.keys['arrowup']) {
            newY -= speed;
            this.keys['z'] = false;
            this.keys['arrowup'] = false;
        }
        if (this.keys['s'] || this.keys['arrowdown']) {
            newY += speed;
            this.keys['s'] = false;
            this.keys['arrowdown'] = false;
        }
        if (this.keys['q'] || this.keys['arrowleft']) {
            newX -= speed;
            this.keys['q'] = false;
            this.keys['arrowleft'] = false;
        }
        if (this.keys['d'] || this.keys['arrowright']) {
            newX += speed;
            this.keys['d'] = false;
            this.keys['arrowright'] = false;
        }

        // Calculer la position de grille pour la nouvelle position
        const newGridX = Math.floor(newX / this.gridSize);
        const newGridY = Math.floor(newY / this.gridSize);

        // Vérifier les limites du canvas
        const maxX = this.canvas.width - this.avatar.size;
        const maxY = this.canvas.height - this.avatar.size;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        // Vérifier les collisions avec murs/eau
        if (!this.isBlocked(newGridX, newGridY)) {
            this.avatar.x = newX;
            this.avatar.y = newY;
        } else {
            console.log(`❌ Collision détectée à (${newGridX}, ${newGridY})`);
        }

        // Vérifier si la position a changé
        if (oldX !== this.avatar.x || oldY !== this.avatar.y) {
            if (this.moveCallback) {
                const gridPos = {
                    x: Math.floor(this.avatar.x / this.gridSize),
                    y: Math.floor(this.avatar.y / this.gridSize)
                };
                this.moveCallback(gridPos);
            }
        }
    }

    /**
     * Vérifie la collision avec un challenge
     * @param {Object} playerGridPos - Position de grille du joueur {x, y}
     * @returns {Object|null} Challenge trouvé ou null
     */
    checkCollision(playerGridPos) {
        for (let challenge of this.challenges) {
            const dx = Math.abs(playerGridPos.x - challenge.coordinates.x);
            const dy = Math.abs(playerGridPos.y - challenge.coordinates.y);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= (challenge.triggerRadius || 0) && !challenge.visited) {
                return challenge;
            }
        }
        return null;
    }

    /**
     * Rend tous les éléments visuels du jeu
     */
    render() {
        // Effacer le canvas
        this._renderBackground();

        // Dessiner les différentes couches
        this._renderWalls();
        this._renderWater();
        this._renderObjects();
        this._renderChallenges();
        this._renderAvatar();
    }

    /**
     * Rend l'arrière-plan (carte ou grille placeholder)
     * @private
     */
    _renderBackground() {
        // Couleur de fond
        this.ctx.fillStyle = GAME_CONFIG.BACKGROUND_COLOR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessiner la carte si chargée
        if (this.mapImage && this.mapImage.complete) {
            this.ctx.drawImage(this.mapImage, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            // Dessiner la grille placeholder
            this._renderGrid();
        }
    }

    /**
     * Rend une grille de fond lorsque l'image n'est pas disponible
     * @private
     */
    _renderGrid() {
        this.ctx.strokeStyle = GAME_CONFIG.GRID_COLOR;

        // Lignes verticales
        for (let x = 0; x < this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        // Lignes horizontales
        for (let y = 0; y < this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    /**
     * Rend les murs avec texture de pierre
     * @private
     */
    _renderWalls() {
        for (let wall of this.walls) {
            this._drawStoneWall(wall.x, wall.y);
        }
    }

    /**
     * Dessine un mur en pierre avec texture réaliste
     * @private
     * @param {number} gridX - Position X dans la grille
     * @param {number} gridY - Position Y dans la grille
     */
    _drawStoneWall(gridX, gridY) {
        const wx = gridX * this.gridSize;
        const wy = gridY * this.gridSize;

        // Couleur de base de la pierre
        this.ctx.fillStyle = GAME_CONFIG.WALL.BASE_COLOR;
        this.ctx.fillRect(wx, wy, this.gridSize, this.gridSize);

        // Ajouter la texture de pierre avec plusieurs nuances
        const seed = gridX * 13 + gridY * 17; // Seed déterministe pour consistance
        this.ctx.globalAlpha = GAME_CONFIG.WALL.OPACITY;

        // Dessiner des blocs/fissures de pierre
        for (let i = 0; i < GAME_CONFIG.WALL.TEXTURE_BLOCKS; i++) {
            const blockX = wx + ((seed * (i + 1) * 7) % (this.gridSize - 4));
            const blockY = wy + ((seed * (i + 2) * 11) % (this.gridSize - 4));
            const blockW = 3 + ((seed * (i + 3)) % 5);
            const blockH = 3 + ((seed * (i + 4)) % 5);

            this.ctx.fillStyle = GAME_CONFIG.WALL.SHADES[i % GAME_CONFIG.WALL.SHADES.length];
            this.ctx.fillRect(blockX, blockY, blockW, blockH);
        }

        this.ctx.globalAlpha = 1.0;

        // Ajouter des lignes de mortier entre les pierres
        this.ctx.strokeStyle = GAME_CONFIG.WALL.MORTAR_COLOR;
        this.ctx.lineWidth = 1;

        // Lignes horizontales de mortier
        const numHLines = 2;
        for (let h = 1; h <= numHLines; h++) {
            const y = wy + (this.gridSize / (numHLines + 1)) * h;
            this.ctx.beginPath();
            this.ctx.moveTo(wx, y);
            this.ctx.lineTo(wx + this.gridSize, y);
            this.ctx.stroke();
        }

        // Lignes verticales de mortier (décalées)
        const numVLines = 1;
        for (let v = 1; v <= numVLines; v++) {
            const x = wx + (this.gridSize / (numVLines + 1)) * v;
            const offsetY = (gridY % 2 === 0) ? 0 : this.gridSize / 3;
            this.ctx.beginPath();
            this.ctx.moveTo(x, wy + offsetY);
            this.ctx.lineTo(x, wy + this.gridSize);
            this.ctx.stroke();
        }

        // Bordure sombre pour la profondeur
        this.ctx.strokeStyle = GAME_CONFIG.WALL.BORDER_DARK;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(wx, wy, this.gridSize, this.gridSize);

        // Surbrillance claire pour l'effet 3D
        this.ctx.strokeStyle = GAME_CONFIG.WALL.BORDER_LIGHT;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(wx + 1, wy + this.gridSize - 1);
        this.ctx.lineTo(wx + 1, wy + 1);
        this.ctx.lineTo(wx + this.gridSize - 1, wy + 1);
        this.ctx.stroke();
    }

    /**
     * Rend l'eau avec transparence
     * @private
     */
    _renderWater() {
        // Remplissage de l'eau avec transparence
        this.ctx.fillStyle = GAME_CONFIG.WATER.COLOR;
        this.ctx.globalAlpha = GAME_CONFIG.WATER.OPACITY;

        for (let w of this.water) {
            const wx = w.x * this.gridSize;
            const wy = w.y * this.gridSize;
            this.ctx.fillRect(wx, wy, this.gridSize, this.gridSize);
        }

        this.ctx.globalAlpha = 1.0;

        // Bordures de l'eau
        this.ctx.strokeStyle = GAME_CONFIG.WATER.BORDER_COLOR;
        this.ctx.lineWidth = 1;

        for (let w of this.water) {
            const wx = w.x * this.gridSize;
            const wy = w.y * this.gridSize;
            this.ctx.strokeRect(wx, wy, this.gridSize, this.gridSize);
        }
    }

    /**
     * Rend les objets décoratifs (emojis)
     * @private
     */
    _renderObjects() {
        this.ctx.font = `${GAME_CONFIG.OBJECT.FONT_SIZE} Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        for (let obj of this.objects) {
            const ox = obj.x * this.gridSize + this.gridSize / 2;
            const oy = obj.y * this.gridSize + this.gridSize / 2;

            // Ombre portée
            this.ctx.fillStyle = '#000';
            this.ctx.globalAlpha = GAME_CONFIG.OBJECT.SHADOW_OPACITY;
            this.ctx.fillText(
                obj.emoji,
                ox + GAME_CONFIG.OBJECT.SHADOW_OFFSET,
                oy + GAME_CONFIG.OBJECT.SHADOW_OFFSET
            );
            this.ctx.globalAlpha = 1.0;

            // Emoji
            this.ctx.fillText(obj.emoji, ox, oy);
        }
    }

    /**
     * Rend les challenges non visités
     * @private
     */
    _renderChallenges() {
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        for (let challenge of this.challenges) {
            if (!challenge.visited) {
                const cx = challenge.coordinates.x * this.gridSize;
                const cy = challenge.coordinates.y * this.gridSize;

                // Dessiner l'arrière-plan avec la couleur du challenge
                this.ctx.fillStyle = challenge.color;
                this.ctx.globalAlpha = GAME_CONFIG.CHALLENGE.OPACITY;
                this.ctx.fillRect(cx, cy, this.gridSize, this.gridSize);
                this.ctx.globalAlpha = 1.0;

                // Dessiner la bordure
                this.ctx.strokeStyle = challenge.color;
                this.ctx.lineWidth = GAME_CONFIG.CHALLENGE.BORDER_WIDTH;
                this.ctx.strokeRect(cx, cy, this.gridSize, this.gridSize);

                // Dessiner l'icône (emoji) au centre
                this.ctx.font = `${GAME_CONFIG.CHALLENGE.FONT_SIZE} Arial`;
                this.ctx.fillText(
                    challenge.icon,
                    cx + this.gridSize / 2,
                    cy + this.gridSize / 2
                );
            }
        }

        // Réinitialiser l'alignement du texte
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'alphabetic';
    }

    /**
     * Rend l'avatar du joueur
     * @private
     */
    _renderAvatar() {
        // Corps de l'avatar
        this.ctx.fillStyle = this.avatar.color;
        this.ctx.fillRect(this.avatar.x, this.avatar.y, this.avatar.size, this.avatar.size);

        // Bordure de l'avatar
        this.ctx.strokeStyle = GAME_CONFIG.AVATAR_BORDER_COLOR;
        this.ctx.lineWidth = GAME_CONFIG.AVATAR_BORDER_WIDTH;
        this.ctx.strokeRect(this.avatar.x, this.avatar.y, this.avatar.size, this.avatar.size);
    }
}
