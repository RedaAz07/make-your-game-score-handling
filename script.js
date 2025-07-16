class BrickBreakerGame {
            constructor() {
                this.gameArea = document.getElementById('gameArea');
                this.ball = document.getElementById('ball');
                this.paddle = document.getElementById('paddle');
                this.bricksContainer = document.getElementById('bricksContainer');
                this.scoreElement = document.querySelector('.score-value');
                this.livesElement = document.querySelector('.lives-value');
                this.gameMessage = document.getElementById('gameMessage');
                this.pauseBtn = document.getElementById('pauseBtn');
                this.musicBtn = document.getElementById('musicBtn');
                
                this.gameAreaRect = this.gameArea.getBoundingClientRect();
                this.gameWidth = 600;
                this.gameHeight = 500;
                
                this.ballX = this.gameWidth / 2;
                this.ballY = this.gameHeight - 100;
                this.ballSpeedX = 3;
                this.ballSpeedY = -3;
                this.ballRadius = 7.5;
                
                this.paddleX = this.gameWidth / 2 - 40;
                this.paddleY = this.gameHeight - 42;
                this.paddleWidth = 80;
                this.paddleHeight = 12;
                
                this.score = 0;
                this.lives = 3;
                this.gameRunning = false;
                this.gamePaused = false;
                this.gameStarted = false;
                
                this.bricks = [];
                this.brickRows = 6;
                this.brickCols = 10;
                this.brickWidth = 54;
                this.brickHeight = 25;
                this.brickOffsetTop = 20;
                this.brickOffsetLeft = 20;
                this.brickPadding = 3;
                
                this.colors = ['brick-red', 'brick-orange', 'brick-yellow', 'brick-green', 'brick-blue', 'brick-purple'];
                
                this.init();
            }
            
            init() {
                this.createBricks();
                this.setupEventListeners();
                this.updateBallPosition();
                this.updatePaddlePosition();
                this.showStartMessage();
            }
            
            createBricks() {
                this.bricksContainer.innerHTML = '';
                this.bricks = [];
                
                for (let row = 0; row < this.brickRows; row++) {
                    for (let col = 0; col < this.brickCols; col++) {
                        const brick = document.createElement('div');
                        brick.className = `brick ${this.colors[row]}`;
                        this.bricksContainer.appendChild(brick);
                        
                        this.bricks.push({
                            element: brick,
                            x: col * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft,
                            y: row * (this.brickHeight + this.brickPadding) + this.brickOffsetTop,
                            width: this.brickWidth,
                            height: this.brickHeight,
                            destroyed: false
                        });
                    }
                }
            }
            
            setupEventListeners() {
                this.keys = {};
                
                // Keyboard controls
                document.addEventListener('keydown', (e) => {
                    this.keys[e.key] = true;
                    
                    // Start game with Escape key
                    if (e.key === 'Escape') {
                        if (!this.gameStarted) {
                            this.startGame();
                        } else {
                            this.togglePause();
                        }
                    }
                    
                    // Prevent default behavior for arrow keys
                    if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D'].includes(e.key)) {
                        e.preventDefault();
                    }
                });
                
                document.addEventListener('keyup', (e) => {
                    this.keys[e.key] = false;
                });
                
                // Keep click to start as backup
                this.gameArea.addEventListener('click', () => {
                    if (!this.gameStarted) {
                        this.startGame();
                    }
                });
                
                this.pauseBtn.addEventListener('click', () => {
                    this.togglePause();
                });
                
                this.musicBtn.addEventListener('click', () => {
                    this.toggleMusic();
                });
            }
            
            startGame() {
                this.gameStarted = true;
                this.gameRunning = true;
                this.hideMessage();
                this.gameLoop();
            }
            
            gameLoop() {
                if (!this.gameRunning || this.gamePaused) return;
                
                this.updatePaddle();
                this.updateBall();
                this.checkCollisions();
                this.checkGameState();
                
                requestAnimationFrame(() => this.gameLoop());
            }
            
            updatePaddle() {
                const paddleSpeed = 8;
                
                // Move paddle with arrow keys or WASD
                if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
                    this.paddleX -= paddleSpeed;
                }
                if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
                    this.paddleX += paddleSpeed;
                }
                
                // Keep paddle within bounds
                this.paddleX = Math.max(0, Math.min(this.paddleX, this.gameWidth - this.paddleWidth));
                this.updatePaddlePosition();
            }
            
            updateBall() {
                this.ballX += this.ballSpeedX;
                this.ballY += this.ballSpeedY;
                
                // Ball collision with walls
                if (this.ballX <= this.ballRadius || this.ballX >= this.gameWidth - this.ballRadius) {
                    this.ballSpeedX = -this.ballSpeedX;
                }
                
                if (this.ballY <= this.ballRadius) {
                    this.ballSpeedY = -this.ballSpeedY;
                }
                
                // Ball falls below paddle
                if (this.ballY > this.gameHeight) {
                    this.loseLife();
                }
                
                this.updateBallPosition();
            }
            
            checkCollisions() {
                // Paddle collision
                if (this.ballY + this.ballRadius >= this.paddleY && 
                    this.ballY - this.ballRadius <= this.paddleY + this.paddleHeight &&
                    this.ballX >= this.paddleX && 
                    this.ballX <= this.paddleX + this.paddleWidth) {
                    
                    this.ballSpeedY = -Math.abs(this.ballSpeedY);
                    
                    // Add spin based on where ball hits paddle
                    const hitPos = (this.ballX - this.paddleX) / this.paddleWidth;
                    this.ballSpeedX = (hitPos - 0.5) * 6;
                }
                
                // Brick collisions
                for (let brick of this.bricks) {
                    if (brick.destroyed) continue;
                    
                    if (this.ballX + this.ballRadius >= brick.x &&
                        this.ballX - this.ballRadius <= brick.x + brick.width &&
                        this.ballY + this.ballRadius >= brick.y &&
                        this.ballY - this.ballRadius <= brick.y + brick.height) {
                        
                        this.ballSpeedY = -this.ballSpeedY;
                        brick.destroyed = true;
                        brick.element.classList.add('brick-destroyed');
                        
                        this.score += 10;
                        this.updateScore();
                        
                        // Speed up ball slightly
                        this.ballSpeedX *= 1.01;
                        this.ballSpeedY *= 1.01;
                        
                        break;
                    }
                }
            }
            
            checkGameState() {
                // Check if all bricks are destroyed
                const remainingBricks = this.bricks.filter(brick => !brick.destroyed);
                if (remainingBricks.length === 0) {
                    this.showWinMessage();
                }
            }
            
            loseLife() {
                this.lives--;
                this.updateLives();
                
                if (this.lives <= 0) {
                    this.showGameOverMessage();
                } else {
                    this.resetBall();
                }
            }
            
            resetBall() {
                this.ballX = this.gameWidth / 2;
                this.ballY = this.gameHeight - 100;
                this.ballSpeedX = 3 * (Math.random() > 0.5 ? 1 : -1);
                this.ballSpeedY = -3;
                this.updateBallPosition();
            }
            
            updateBallPosition() {
                this.ball.style.left = (this.ballX - this.ballRadius) + 'px';
                this.ball.style.top = (this.ballY - this.ballRadius) + 'px';
            }
            
            updatePaddlePosition() {
                this.paddle.style.left = this.paddleX + 'px';
            }
            
            updateScore() {
                this.scoreElement.textContent = this.score.toLocaleString();
            }
            
            updateLives() {
                this.livesElement.textContent = this.lives;
            }
            
            showStartMessage() {
                this.gameMessage.innerHTML = `
                    <div>Click to Start!</div>
                    <div class="start-message">Move mouse to control paddle</div>
                `;
                this.gameMessage.style.display = 'block';
            }
            
            showGameOverMessage() {
                this.gameRunning = false;
                this.gameMessage.innerHTML = `
                    <div>Game Over!</div>
                    <div class="start-message">Final Score: ${this.score}</div>
                    <div class="start-message">Click to restart</div>
                `;
                this.gameMessage.style.display = 'block';
                this.gameStarted = false;
            }
            
            showWinMessage() {
                this.gameRunning = false;
                this.gameMessage.innerHTML = `
                    <div>You Win! 🎉</div>
                    <div class="start-message">Score: ${this.score}</div>
                    <div class="start-message">Click to play again</div>
                `;
                this.gameMessage.style.display = 'block';
                this.gameStarted = false;
            }
            
            hideMessage() {
                this.gameMessage.style.display = 'none';
            }
            
            togglePause() {
                if (!this.gameStarted) return;
                
                this.gamePaused = !this.gamePaused;
                
                if (this.gamePaused) {
                    this.pauseBtn.innerHTML = '<span class="pause-icon">▶️</span>RESUME';
                    this.pauseBtn.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';
                    this.showPauseMessage();
                } else {
                    this.pauseBtn.innerHTML = '<span class="pause-icon">⏸️</span>PAUSE';
                    this.pauseBtn.style.background = 'linear-gradient(45deg, #e94560, #f39c12)';
                    this.hideMessage();
                    this.gameLoop();
                }
            }
            
            showPauseMessage() {
                this.gameMessage.innerHTML = `
                    <div>Game Paused</div>
                    <div class="start-message">Click Resume to continue</div>
                `;
                this.gameMessage.style.display = 'block';
            }
            
            toggleMusic() {
                if (this.musicBtn.textContent.includes('MUSIC')) {
                    this.musicBtn.innerHTML = '<span class="music-icon">🔇</span>MUTED';
                    this.musicBtn.style.background = 'linear-gradient(45deg, #95a5a6, #7f8c8d)';
                } else {
                    this.musicBtn.innerHTML = '<span class="music-icon">🎵</span>MUSIC';
                    this.musicBtn.style.background = 'linear-gradient(45deg, #3498db, #2ecc71)';
                }
            }
        }
        
        // Start the game when page loads
        document.addEventListener('DOMContentLoaded', () => {
            new BrickBreakerGame();
        });