let container = document.getElementById("game-container");
let gameArea = document.getElementById("gameArea");
let score = document.querySelector('.score-value');
let lives = document.querySelector('.lives-value');
let gameMessage = document.createElement('div')
let intro = document.getElementById("intro");
let pauseIcon = document.getElementById("pauseBtn");
let timeValue = document.querySelector('.time-value');
intro.classList.add("image")
gameMessage.className = "gameMessage"
gameMessage.innerHTML = "Press Space to Start"
document.body.appendChild(gameMessage)
let restLifes = 3
let scoree = 0
let colors = ["red", "orange", "yellow", "green", "blue", "purple"];
let rightPressed = false;
let leftPressed = false;
let paddleX;
let ballX, ballY;
let dx = 4;
let dy = -4;
let bricks = [];

let time = {
    min: 0,
    sec: 0,
    interval: null
};
// Game state
const gameState = {
    gameStart: false,
    gamePause: false,
    gameOver: false,
};

const Createelements = () => {
    let containerbricks = document.createElement("div");
    let paddle = document.createElement("div");
    let ball = document.createElement("div");

    containerbricks.className = "bricks-container";
    paddle.className = "paddle";
    ball.className = "ball";


    for (let i = 0; i < colors.length * 5; i++) {
        let brick = document.createElement('div');
        brick.className = "brick";
        let colorIndex = Math.floor(i / 5);
        brick.classList.add(`brick-${colors[colorIndex]}`);
        containerbricks.appendChild(brick);

        bricks.push(brick);
    }

    containerbricks.appendChild(ball);
    containerbricks.appendChild(paddle);
    gameArea.appendChild(containerbricks);
};
Createelements();

let paddle = document.querySelector('.paddle');
let ball = document.querySelector(".ball");

paddleX = gameArea.offsetWidth / 2 - paddle.offsetWidth / 2;
ballX = gameArea.offsetWidth / 2;
ballY = gameArea.offsetHeight - 60;

document.body.addEventListener('keydown', (event) => {
    if (event.key === " ") {
        if (gameState.gameOver && gameState.gamePause) {
            restart();
        }
        if (!gameState.gameStart) {
            intro.classList.add("hidden");
            pauseIcon.innerHTML = "⏸️ pause";
            gameState.gameStart = true;
            gameState.gamePause = false;
            start(gameMessage);
            creatTime(timeValue, time, gameState);
        } else {
            pauseIcon.innerHTML = "▶️ Continue";
            gameState.gamePause = true;
            gameState.gameStart = false;
            creatTime(timeValue, time, gameState);
            Pause(gameMessage, gameState);
        }
    } else if (event.key === "ArrowRight") {
        rightPressed = true;
    } else if (event.key === "ArrowLeft") {
        leftPressed = true;
    }
});
document.body.addEventListener('keyup', (event) => {
    if (event.key === "ArrowRight") {
        rightPressed = false;
    } else if (event.key === "ArrowLeft") {
        leftPressed = false;
    }
});

function creatTime(timeValue, time, gameState) {
    if (gameState.gameStart && time.interval === null) {
        time.interval = setInterval(() => {
            time.sec++;
            if (time.sec === 60) {
                time.min++;
                time.sec = 0;
            }
            timeValue.innerHTML = `${String(time.min).padStart(2, "0")}:${String(
                time.sec
            ).padStart(2, "0")}`;
        }, 1000);
    } else if (gameState.gamePause) {
        clearInterval(time.interval);
        time.interval = null;
    }
}

function start(gameMessage) {
    gameMessage.style.display = "none";
}

function Pause(gameMessage) {
    gameMessage.style.display = "block";
}

function restart() {
    gameState.gameOver = false

    lives = 3
    scoree = 0
    score.innerHTML = "0";
    lives.innerHTML = "3";
    bricks = [];
    gameArea.innerHTML = "";
    Createelements();

    paddleX = gameArea.offsetWidth / 2 - paddle.offsetWidth / 2;
    ballX = gameArea.offsetWidth / 2;
    ballY = gameArea.offsetHeight - 60;

    clearInterval(time.interval);
    time.interval = null;
    time.sec = 0;
    time.min = 0;
    timeValue.innerHTML = "00:00";
}

function movepaddle() {
    const containerWidth = gameArea.offsetWidth;
    const paddleWidth = paddle.offsetWidth;

    if (rightPressed) paddleX += 6;
    if (leftPressed) paddleX -= 6;

    if (paddleX < 0) paddleX = 0;
    if (paddleX > containerWidth - paddleWidth) {
        paddleX = containerWidth - paddleWidth;
    }

    paddle.style.left = `${paddleX}px`;
}

function resetBall() {
    ballX = gameArea.offsetWidth / 2;
    ballY = gameArea.offsetHeight - 60;
    dx = 4;
    dy = -4;
}

function handleBrickCollision() {
    if (bricks.length > 0) {
        for (let i = 0; i < bricks.length; i++) {
            let brick = bricks[i];

            const brickRect = brick.getBoundingClientRect();
            const ballRect = ball.getBoundingClientRect();

            if (
                ballRect.left < brickRect.right &&
                ballRect.right > brickRect.left &&
                ballRect.top < brickRect.bottom &&
                ballRect.bottom > brickRect.top
            ) {
                scoree += 20
                score.innerHTML = scoree;
                dy = -dy;
                brick.classList.add("brick-destroyed");
                bricks.splice(i, 1);
                break;
            }
        }
    } else {
        gameMessage.style.display = "block"
        container.style.opacity = 0
        gameMessage.innerHTML = `
        <div>You Win! 🎉</div>
                    <div class="start-message">Score: ${scoree}</div>
                    <div class="start-message">Press ESC to play again</div>`
    }

}

function moveball() {
    const ballRadius = ball.offsetWidth / 2;
    const gameWidth = gameArea.offsetWidth;
    const gameHeight = gameArea.offsetHeight;

    if (ballX + dx < 0 || ballX + dx > gameWidth - ball.offsetWidth) {
        dx = -dx;
    }

    if (ballY + dy < 0) {
        dy = -dy;
    }

    const paddleTop = paddle.offsetTop;
    const paddleLeft = paddle.offsetLeft;
    const paddleRight = paddleLeft + paddle.offsetWidth;
    const paddleBottom = paddleTop + paddle.offsetHeight;

    const ballBottom = ballY + ball.offsetHeight;
    const ballCenterX = ballX + ballRadius;

    if (
        ballBottom >= paddleTop &&
        ballY <= paddleBottom &&
        ballCenterX >= paddleLeft &&
        ballCenterX <= paddleRight
    ) {
        dy = -dy;
        ballY = paddleTop - ball.offsetHeight;
    }

    if (ballY + dy > gameHeight) {
        restLifes--
        lives.innerHTML = restLifes
        if (restLifes == 0) {
            gameMessage.style.display = "block"
            container.style.opacity = 0.1
            gameMessage.innerHTML = `<div>Game Over!</div>
        <div class="start-message">Final Score: ${scoree}</div>
        <div class="start-message">Press ESC to restart</div>`
            return
        }
        resetBall();
        return;
    }

    ballX += dx;
    ballY += dy;

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    handleBrickCollision();
}

function gameloop() {
    movepaddle();
    moveball();
    requestAnimationFrame(gameloop);
}
function generateStars(count = 100) {
    const container = document.getElementById("starsBackground");
    const colors = ["#ffffff", "#ccc", "#aaffff", "#ffe0ff"];

    for (let i = 0; i < count; i++) {
        const star = document.createElement("div");
        const size = Math.random() * 2 + 1;

        star.classList.add("star");
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];
        star.style.animationDuration = `${10 + Math.random() * 20}s`;

        container.appendChild(star);
    }
}

gameloop();
generateStars(300)