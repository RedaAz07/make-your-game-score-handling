// Arkanoid Game Engine - 60 FPS Optimized
class ArkanoidGame {
    constructor() {
        this.gameArea = document.getElementById('gameArea');
        this.gameContainer = document.getElementById('gameContainer');
        this.pauseMenu = document.getElementById('pauseMenu');
        
        // Game dimensions
        this.width = 800;
        this.height = 600;
        this.scoreboardHeight = 70;
        
        // Game state
        this.gameState = 'waiting'; // waiting, playing, paused, gameOver, won
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.startTime = 0;
        this.gameTime = 0;
        
        // Performance tracking
        this.lastFrameTime = 0;
        this.frameCount = 0;
        this.fps = 0;
        
        // Input handling
        this.keys = {};
        this.keyStates = {};
        
        // Game objects
        this.paddle = null;
        this.ball = null;
        this.bricks = [];
        this.particles = [];
        
        // Animation ID for RAF
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.createGameObjects();
        this.updateUI();
        this.startGameLoop();
    }
    
    setupEventListeners() {
        // Keyboard input with proper key state management
        document.addEventListener('keydown', (e) => {
            if (!this.keyStates[e.code]) {
                this.keyStates[e.code] = true;
                this.handleKeyDown(e.code);
            }
            e.preventDefault();
        });
        
        document.addEventListener('keyup', (e) => {
            this.keyStates[e.code] = false;
            e.preventDefault();
        });
        
        // Pause menu buttons
        document.getElementById('continueBtn').addEventListener('click', () => this.resumeGame());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
        document.getElementById('restartGameOver').addEventListener('click', () => this.restartGame());
        document.getElementById('restartWin').addEventListener('click', () => this.restartGame());
        
        // Prevent context menu
        this.gameContainer.addEventListener('contextmenu', e => e.preventDefault());
    }
    
    handleKeyDown(code) {
        switch(code) {
            case 'Space':
                if (this.gameState === 'playing') {
                    this.pauseGame();
                } else if (this.gameState === 'paused') {
                    this.resumeGame();
                }
                break;
            case 'Enter':
                if (this.gameState === 'waiting') {
                    this.startGame();
                }
                break;
            case 'Escape':
                if (this.gameState === 'playing') {
                    this.pauseGame();
                }
                break;
        }
    }
    
    createGameObjects() {
        this.createPaddle();
        this.createBall();
        this.createBricks();
    }
    
    createPaddle() {
        this.paddle = {
            element: document.createElement('div'),
            x: this.width / 2 - 60,
            y: this.height - 100,
            width: 120,
            height: 12,
            speed: 8
        };
        
        this.paddle.element.className = 'game-object paddle';
        this.paddle.element.style.width = this.paddle.width + 'px';
        this.paddle.element.style.height = this.paddle.height + 'px';
        this.gameArea.appendChild(this.paddle.element);
        this.updatePaddlePosition();
    }
    
    createBall() {
        this.ball = {
            element: document.createElement('div'),
            x: this.width / 2 - 8,
            y: this.height - 150,
            width: 16,
            height: 16,
            velocityX: 4,
            velocityY: -4,
            speed: 1
        };
        
        this.ball.element.className = 'game-object ball';
        this.ball.element.style.width = this.ball.width + 'px';
        this.ball.element.style.height = this.ball.height + 'px';
        this.gameArea.appendChild(this.ball.element);
        this.updateBallPosition();
    }
    
    createBricks() {
        this.bricks = [];
        const colors = ['brick-red', 'brick-orange', 'brick-yellow', 'brick-green', 'brick-blue'];
        const brickWidth = 75;
        const brickHeight = 25;
        const padding = 5;
        const rows = 5;
        const cols = 10;
        const startX = (this.width - (cols * (brickWidth + padding) - padding)) / 2;
        const startY = this.scoreboardHeight + 50;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const brick = {
                    element: document.createElement('div'),
                    x: startX + col * (brickWidth + padding),
                    y: startY + row * (brickHeight + padding),
                    width: brickWidth,
                    height: brickHeight,
                    destroyed: false,
                    points: (5 - row) * 10
                };
                
                brick.element.className = `game-object brick ${colors[row]}`;
                brick.element.style.width = brick.width + 'px';
                brick.element.style.height = brick.height + 'px';
                brick.element.style.left = brick.x + 'px';
                brick.element.style.top = brick.y + 'px';
                
                this.gameArea.appendChild(brick.element);
                this.bricks.push(brick);
            }
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.startTime = performance.now();
        this.resetBall();
    }
    
    pauseGame() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.pauseMenu.style.display = 'block';
        }
    }
    
    resumeGame() {
        if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.pauseMenu.style.display = 'none';
            // Reset start time to account for pause duration
            this.startTime = performance.now() - this.gameTime;
        }
    }
    
    restartGame() {
        // Hide all menus
        this.pauseMenu.style.display = 'none';
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('gameWin').style.display = 'none';
        
        // Reset game state
        this.gameState = 'waiting';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameTime = 0;
        
        // Clear game area
        this.gameArea.innerHTML = '';
        
        // Recreate game objects
        this.createGameObjects();
        this.updateUI();
    }
    
    resetBall() {
        this.ball.x = this.paddle.x + this.paddle.width / 2 - this.ball.width / 2;
        this.ball.y = this.paddle.y - this.ball.height - 5;
        
        // Random angle between 30-150 degrees
        const angle = (Math.random() * 120 + 30) * Math.PI / 180;
        this.ball.velocityX = Math.cos(angle) * this.ball.speed;
        this.ball.velocityY = -Math.sin(angle) * this.ball.speed;
        
        this.updateBallPosition();
    }
    
    update(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        this.updateGameTime();
        this.updatePaddle(deltaTime);
        this.updateBall(deltaTime);
        this.updateParticles(deltaTime);
        this.checkCollisions();
        this.checkWinCondition();
    }
    
    updateGameTime() {
        this.gameTime = performance.now() - this.startTime;
    }
    
    updatePaddle(deltaTime) {
        // Smooth paddle movement
        let moving = false;
        
        if (this.keyStates['ArrowLeft'] || this.keyStates['KeyA']) {
            this.paddle.x = Math.max(0, this.paddle.x - this.paddle.speed);
            moving = true;
        }
        if (this.keyStates['ArrowRight'] || this.keyStates['KeyD']) {
            this.paddle.x = Math.min(this.width - this.paddle.width, this.paddle.x + this.paddle.speed);
            moving = true;
        }
        
        if (moving) {
            this.updatePaddlePosition();
        }
    }
    
    updateBall(deltaTime) {
        this.ball.x += this.ball.velocityX;
        this.ball.y += this.ball.velocityY;
        
        // Wall collisions
        if (this.ball.x <= 0 || this.ball.x >= this.width - this.ball.width) {
            this.ball.velocityX = -this.ball.velocityX;
            this.ball.x = Math.max(0, Math.min(this.width - this.ball.width, this.ball.x));
        }
        
        if (this.ball.y <= this.scoreboardHeight) {
            this.ball.velocityY = -this.ball.velocityY;
            this.ball.y = this.scoreboardHeight;
        }
        
        // Bottom boundary - lose life
        if (this.ball.y >= this.height) {
            this.loseLife();
            return;
        }
        
        this.updateBallPosition();
    }
    
    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.life -= deltaTime;
            
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
            particle.element.style.opacity = particle.life / particle.maxLife;
            
            if (particle.life <= 0) {
                particle.element.remove();
                this.particles.splice(i, 1);
            }
        }
    }
    
    checkCollisions() {
        // Paddle collision
        if (this.ball.velocityY > 0 &&
            this.ball.x + this.ball.width > this.paddle.x &&
            this.ball.x < this.paddle.x + this.paddle.width &&
            this.ball.y + this.ball.height > this.paddle.y &&
            this.ball.y < this.paddle.y + this.paddle.height) {
            
            // Calculate hit position for angle adjustment
            const hitPos = (this.ball.x + this.ball.width / 2 - this.paddle.x) / this.paddle.width;
            const angle = (hitPos - 0.5) * Math.PI / 3; // Max 60 degrees
            
            this.ball.velocityX = Math.sin(angle) * this.ball.speed;
            this.ball.velocityY = -Math.cos(angle) * this.ball.speed;
            
            this.ball.y = this.paddle.y - this.ball.height;
        }
        
        // Brick collisions
        for (let brick of this.bricks) {
            if (brick.destroyed) continue;
            
            if (this.ball.x + this.ball.width > brick.x &&
                this.ball.x < brick.x + brick.width &&
                this.ball.y + this.ball.height > brick.y &&
                this.ball.y < brick.y + brick.height) {
                
                // Determine collision side
                const ballCenterX = this.ball.x + this.ball.width / 2;
                const ballCenterY = this.ball.y + this.ball.height / 2;
                const brickCenterX = brick.x + brick.width / 2;
                const brickCenterY = brick.y + brick.height / 2;
                
                const deltaX = ballCenterX - brickCenterX;
                const deltaY = ballCenterY - brickCenterY;
                
                if (Math.abs(deltaX / brick.width) > Math.abs(deltaY / brick.height)) {
                    this.ball.velocityX = -this.ball.velocityX;
                } else {
                    this.ball.velocityY = -this.ball.velocityY;
                }
                
                this.destroyBrick(brick);
                break;
            }
        }
    }
    
    destroyBrick(brick) {
        brick.destroyed = true;
        brick.element.style.display = 'none';
        this.score += brick.points;
        
        // Create particle effect
        this.createParticles(brick.x + brick.width / 2, brick.y + brick.height / 2);
        
        // Speed up ball slightly
        const speedIncrease = 1.02;
        this.ball.velocityX *= speedIncrease;
        this.ball.velocityY *= speedIncrease;
        this.ball.speed *= speedIncrease;
        
        this.updateUI();
    }
    
    createParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            const particle = {
                element: document.createElement('div'),
                x: x,
                y: y,
                velocityX: (Math.random() - 0.5) * 10,
                velocityY: (Math.random() - 0.5) * 10,
                life: 500,
                maxLife: 500
            };
            
            particle.element.style.position = 'absolute';
            particle.element.style.width = '3px';
            particle.element.style.height = '3px';
            particle.element.style.background = '#fff';
            particle.element.style.borderRadius = '50%';
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
            
            this.gameArea.appendChild(particle.element);
            this.particles.push(particle);
        }
    }
    
    loseLife() {
        this.lives--;
        this.updateUI();
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.resetBall();
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').style.display = 'block';
    }
    
    checkWinCondition() {
        const activeBricks = this.bricks.filter(brick => !brick.destroyed);
        if (activeBricks.length === 0) {
            this.gameState = 'won';
            document.getElementById('winScore').textContent = this.score;
            document.getElementById('gameWin').style.display = 'block';
        }
    }
    
    updatePaddlePosition() {
        this.paddle.element.style.left = this.paddle.x + 'px';
        this.paddle.element.style.top = this.paddle.y + 'px';
    }
    
    updateBallPosition() {
        this.ball.element.style.left = this.ball.x + 'px';
        this.ball.element.style.top = this.ball.y + 'px';
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
        
        const minutes = Math.floor(this.gameTime / 60000);
        const seconds = Math.floor((this.gameTime % 60000) / 1000);
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Main game loop with performance monitoring
    gameLoop(currentTime) {
        // Calculate delta time and FPS
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        
        // FPS calculation
        this.frameCount++;
        if (this.frameCount % 60 === 0) {
            this.fps = Math.round(1000 / (deltaTime || 16.67));
        }
        
        // Update game logic
        this.update(deltaTime);
        
        // Schedule next frame
        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    startGameLoop() {
        this.lastFrameTime = performance.now();
        this.gameLoop(this.lastFrameTime);
    }
    
    stopGameLoop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new ArkanoidGame();
    
    // Performance monitoring (development only)
    if (window.location.hash === '#debug') {
        setInterval(() => {
            console.log(`FPS: ${game.fps}, Objects: ${game.particles.length + game.bricks.length + 2}`);
        }, 1000);
    }
});