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
            visited: false
        }));
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

        // ZQSD or Arrow keys
        if (this.keys['z'] || this.keys['arrowup']) {
            this.avatar.y -= speed;
            this.keys['z'] = false;
            this.keys['arrowup'] = false;
        }
        if (this.keys['s'] || this.keys['arrowdown']) {
            this.avatar.y += speed;
            this.keys['s'] = false;
            this.keys['arrowdown'] = false;
        }
        if (this.keys['q'] || this.keys['arrowleft']) {
            this.avatar.x -= speed;
            this.keys['q'] = false;
            this.keys['arrowleft'] = false;
        }
        if (this.keys['d'] || this.keys['arrowright']) {
            this.avatar.x += speed;
            this.keys['d'] = false;
            this.keys['arrowright'] = false;
        }

        // Boundary collision
        const maxX = this.canvas.width - this.avatar.size;
        const maxY = this.canvas.height - this.avatar.size;

        if (this.avatar.x < 0) this.avatar.x = 0;
        if (this.avatar.y < 0) this.avatar.y = 0;
        if (this.avatar.x > maxX) this.avatar.x = maxX;
        if (this.avatar.y > maxY) this.avatar.y = maxY;

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

        // Draw challenges (for debugging)
        this.ctx.fillStyle = '#ff00ff';
        for (let challenge of this.challenges) {
            if (!challenge.visited) {
                const cx = challenge.coordinates.x * this.gridSize;
                const cy = challenge.coordinates.y * this.gridSize;
                this.ctx.fillRect(cx, cy, this.gridSize, this.gridSize);
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '10px Arial';
                this.ctx.fillText(challenge.id.substring(0, 3), cx + 5, cy + 15);
                this.ctx.fillStyle = '#ff00ff';
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
