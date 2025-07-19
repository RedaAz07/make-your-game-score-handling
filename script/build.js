let container = document.getElementById("game-container")
let colors = ["red", "orange", "yellow", "green", "blue", "purple"]
let rightPressed = false;
let leftPressed = false;
let paddleX = 300;
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





document.body.addEventListener('keydown', (event) => {
    console.log(event.key);

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
function movePaddle() {
    const containerWidth = container.offsetWidth;
    const paddleWidth = paddle.offsetWidth;



    if (rightPressed) {
        paddleX += 6;
    } else if (leftPressed) {
        paddleX -= 6;
    }

    paddleX = Math.max(54, Math.min(paddleX, containerWidth - paddleWidth - 4));

    paddle.style.left = `${paddleX}px`;
    requestAnimationFrame(movePaddle);
}

movePaddle();