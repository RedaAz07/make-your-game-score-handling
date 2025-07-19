let container = document.getElementById("game-container")
let colors = ["red", "orange", "yellow", "green", "blue", "purple"]
let rightPressed = false;
let leftPressed = false;

const Createelements = () => {
    let containerbricks = document.createElement("div")
    let paddle = document.createElement("div")
    let ball = document.createElement("div")
    containerbricks.className = "bricks-container"
    paddle.className = "paddle"
    ball.className = "ball"
    container.innerHTML = `
        <h1 class="game-title">🧱 BRICK BREAKER 🧱</h1>
        <div class="header">
            <div class="score-lives">
                <div class="score">
                    <span class="trophy">🏆</span>
                    <span>SCORE:</span>
                    <span class="score-value">0</span>
                </div>
                <div class="lives">
                    <span class="heart">❤️</span>
                    <span>LIVES:</span>
                    <span class="lives-value">3</span>
                </div>
            </div>           
            <div class="controls">
                <button class="btn pause-btn" id="pauseBtn">
                    <span class="pause-icon">⏸️</span>
                    PAUSE
                </button>
                <button class="btn music-btn" id="musicBtn">
                    <span class="music-icon">🎵</span>
                    MUSIC
                </button>
            </div>
        </div>
        <div class="game-area" id="gameArea"></div>`



    for (let i = 0; i < colors.length * 5; i++) {
        let brick = document.createElement('div')
        brick.className = "brick"
        let colorIndex = Math.floor(i / 5)
        brick.classList.add(`brick-${colors[colorIndex]}`)
        containerbricks.appendChild(brick)
    }
    let gameArea = document.getElementById("gameArea")
    containerbricks.appendChild(ball)
    containerbricks.appendChild(paddle)
    gameArea.appendChild(containerbricks)
}
// create elements
Createelements()

let paddle = document.querySelector('.paddle')
let ball = document.querySelector(".ball")
let paddleX = gameArea.offsetWidth / 2 - paddle.offsetWidth / 2;
let ballX = gameArea.offsetWidth / 2
let ballY = gameArea.offsetHeight - 60
document.body.addEventListener('keydown', (event) => {
    if (event.key === "ArrowRight") {
        rightPressed = true
    } else if (event.key === "ArrowLeft") {
        leftPressed = true
    }
});

document.body.addEventListener('keyup', (event) => {
    if (event.key === "ArrowRight") {
        rightPressed = false

    } else if (event.key === "ArrowLeft") {
        leftPressed = false
    }
});

function movepaddle() {
    let brick_container = document.querySelector('.bricks-container')
    const paddleWidth = paddle.offsetWidth;
    const containerWidth = brick_container.offsetWidth


    if (rightPressed) {
        paddleX += 6;
    } else if (leftPressed) {
        paddleX -= 6;
    }
    if (paddleX < 0) {
        paddleX = 0
    }
    if (paddleX > containerWidth - paddleWidth) {
        paddleX = containerWidth - paddleWidth;
    }

    paddle.style.left = `${paddleX}px`;
}

function moveball() {
    ballX += 6;
    ballY -= 6;

    ball.style.left = `${ballX}px`
    ball.style.top = `${ballY}px`
}

function gameloop() {
    movepaddle()
    moveball()
    requestAnimationFrame(gameloop);
}

// document.body.addEventListener("keydown", (e) => {
//     if (e.key == " ") {
//         gameloop()
//     }
// })
gameloop()