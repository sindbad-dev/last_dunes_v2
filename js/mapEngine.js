class MapEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Avatar state
        this.avatar = {
            x: 0,
            y: 0,
            size: 20,
            color: '#00ff00'
        };

        // Map data
        this.gridSize = 40;
        this.mapImage = null;
        this.challenges = [];
        this.walls = [];
        this.water = [];
        this.objects = [];
        this.moveCallback = null;

        // Keyboard state
        this.keys = {};
        this.setupKeyboard();
    }

    setupKeyboard() {
        // Listen for key presses
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;

            // Prevent default for arrow keys
            if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    loadMap(levelInfo) {
        this.gridSize = levelInfo.gridSize;

        // Set avatar start position
        this.avatar.x = levelInfo.startPos.x * this.gridSize;
        this.avatar.y = levelInfo.startPos.y * this.gridSize;

        // Load map image
        this.mapImage = new Image();
        this.mapImage.onload = () => {
            console.log('Map loaded successfully');
            this.render();
        };

        // If map file doesn't exist, create a placeholder
        this.mapImage.onerror = () => {
            console.log('Map image not found, using placeholder');
            this.createPlaceholderMap();
        };

        this.mapImage.src = levelInfo.mapFile;
    }

    createPlaceholderMap() {
        // Create a simple colored background as placeholder
        this.mapImage = null;
        this.render();
    }

    placeInteractables(challenges) {
        this.challenges = challenges.map(ch => ({
            ...ch,
            visited: false,
            color: ch.color || '#ff00ff',
            icon: ch.icon || '?'
        }));
    }

    loadTerrain(walls, water, objects) {
        this.walls = walls || [];
        this.water = water || [];
        this.objects = objects || [];
        console.log(`Terrain chargé: ${this.walls.length} murs, ${this.water.length} eau, ${this.objects.length} objets`);
    }

    isBlocked(gridX, gridY) {
        // Check walls
        if (this.walls.some(w => w.x === gridX && w.y === gridY)) {
            return true;
        }
        // Check water
        if (this.water.some(w => w.x === gridX && w.y === gridY)) {
            return true;
        }
        return false;
    }

    onPlayerMove(callback) {
        this.moveCallback = callback;
    }

    start() {
        this.gameLoop();
    }

    gameLoop() {
        this.handleInput();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    handleInput() {
        const oldX = this.avatar.x;
        const oldY = this.avatar.y;

        const speed = this.gridSize;
        let newX = this.avatar.x;
        let newY = this.avatar.y;

        // ZQSD or Arrow keys
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

        // Calculate grid position for new position
        const newGridX = Math.floor(newX / this.gridSize);
        const newGridY = Math.floor(newY / this.gridSize);

        // Check boundaries
        const maxX = this.canvas.width - this.avatar.size;
        const maxY = this.canvas.height - this.avatar.size;

        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX > maxX) newX = maxX;
        if (newY > maxY) newY = maxY;

        // Check collision with walls/water
        if (!this.isBlocked(newGridX, newGridY)) {
            this.avatar.x = newX;
            this.avatar.y = newY;
        } else {
            // Collision detected, don't move
            console.log(`Collision détectée à (${newGridX}, ${newGridY})`);
        }

        // Check if position changed
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

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw map if loaded
        if (this.mapImage && this.mapImage.complete) {
            this.ctx.drawImage(this.mapImage, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            // Draw grid for placeholder
            this.ctx.strokeStyle = '#444';
            for (let x = 0; x < this.canvas.width; x += this.gridSize) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.canvas.height);
                this.ctx.stroke();
            }
            for (let y = 0; y < this.canvas.height; y += this.gridSize) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.canvas.width, y);
                this.ctx.stroke();
            }
        }

        // Draw walls with stone texture
        for (let wall of this.walls) {
            const wx = wall.x * this.gridSize;
            const wy = wall.y * this.gridSize;

            // Base stone color - dark brown
            this.ctx.fillStyle = '#3d2f27';
            this.ctx.fillRect(wx, wy, this.gridSize, this.gridSize);

            // Add stone texture with multiple shades
            const stoneShades = [
                '#2a1f1a', // Very dark brown
                '#4a3a30', // Medium brown
                '#554439', // Light brown
                '#1f1812', // Almost black
                '#6b5547'  // Lighter accent
            ];

            // Random-looking but deterministic stone pattern based on position
            const seed = wall.x * 13 + wall.y * 17;
            this.ctx.globalAlpha = 0.6;

            // Draw stone blocks/cracks
            for (let i = 0; i < 8; i++) {
                const blockX = wx + ((seed * (i + 1) * 7) % (this.gridSize - 4));
                const blockY = wy + ((seed * (i + 2) * 11) % (this.gridSize - 4));
                const blockW = 3 + ((seed * (i + 3)) % 5);
                const blockH = 3 + ((seed * (i + 4)) % 5);

                this.ctx.fillStyle = stoneShades[i % stoneShades.length];
                this.ctx.fillRect(blockX, blockY, blockW, blockH);
            }

            this.ctx.globalAlpha = 1.0;

            // Add mortar lines between stones
            this.ctx.strokeStyle = '#1a1410';
            this.ctx.lineWidth = 1;

            // Horizontal mortar lines
            const numHLines = 2;
            for (let h = 1; h <= numHLines; h++) {
                const y = wy + (this.gridSize / (numHLines + 1)) * h;
                this.ctx.beginPath();
                this.ctx.moveTo(wx, y);
                this.ctx.lineTo(wx + this.gridSize, y);
                this.ctx.stroke();
            }

            // Vertical mortar lines (staggered)
            const numVLines = 1;
            for (let v = 1; v <= numVLines; v++) {
                const x = wx + (this.gridSize / (numVLines + 1)) * v;
                const offsetY = (wall.y % 2 === 0) ? 0 : this.gridSize / 3;
                this.ctx.beginPath();
                this.ctx.moveTo(x, wy + offsetY);
                this.ctx.lineTo(x, wy + this.gridSize);
                this.ctx.stroke();
            }

            // Dark border for depth
            this.ctx.strokeStyle = '#0d0a08';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(wx, wy, this.gridSize, this.gridSize);

            // Light edge highlight for 3D effect
            this.ctx.strokeStyle = '#5a4a3f';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(wx + 1, wy + this.gridSize - 1);
            this.ctx.lineTo(wx + 1, wy + 1);
            this.ctx.lineTo(wx + this.gridSize - 1, wy + 1);
            this.ctx.stroke();
        }

        // Draw water
        this.ctx.fillStyle = '#1e90ff';
        this.ctx.globalAlpha = 0.6;
        for (let w of this.water) {
            const wx = w.x * this.gridSize;
            const wy = w.y * this.gridSize;
            this.ctx.fillRect(wx, wy, this.gridSize, this.gridSize);
        }
        this.ctx.globalAlpha = 1.0;
        this.ctx.strokeStyle = '#0066cc';
        this.ctx.lineWidth = 1;
        for (let w of this.water) {
            const wx = w.x * this.gridSize;
            const wy = w.y * this.gridSize;
            this.ctx.strokeRect(wx, wy, this.gridSize, this.gridSize);
        }

        // Draw objects
        this.ctx.font = '28px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        for (let obj of this.objects) {
            const ox = obj.x * this.gridSize + this.gridSize/2;
            const oy = obj.y * this.gridSize + this.gridSize/2;

            // Shadow
            this.ctx.fillStyle = '#000';
            this.ctx.globalAlpha = 0.3;
            this.ctx.fillText(obj.emoji, ox + 2, oy + 2);
            this.ctx.globalAlpha = 1.0;

            // Emoji
            this.ctx.fillText(obj.emoji, ox, oy);
        }

        // Reset text alignment for challenges
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // Draw challenges with icons and colors
        for (let challenge of this.challenges) {
            if (!challenge.visited) {
                const cx = challenge.coordinates.x * this.gridSize;
                const cy = challenge.coordinates.y * this.gridSize;

                // Draw background with challenge color
                this.ctx.fillStyle = challenge.color;
                this.ctx.globalAlpha = 0.6;
                this.ctx.fillRect(cx, cy, this.gridSize, this.gridSize);
                this.ctx.globalAlpha = 1.0;

                // Draw border
                this.ctx.strokeStyle = challenge.color;
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(cx, cy, this.gridSize, this.gridSize);

                // Draw icon (emoji) in center
                this.ctx.font = '24px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(challenge.icon, cx + this.gridSize / 2, cy + this.gridSize / 2);

                // Reset text alignment
                this.ctx.textAlign = 'left';
                this.ctx.textBaseline = 'alphabetic';
            }
        }

        // Draw avatar
        this.ctx.fillStyle = this.avatar.color;
        this.ctx.fillRect(this.avatar.x, this.avatar.y, this.avatar.size, this.avatar.size);

        // Draw avatar border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.avatar.x, this.avatar.y, this.avatar.size, this.avatar.size);
    }
}
