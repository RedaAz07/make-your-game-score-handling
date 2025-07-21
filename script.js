import * as config from "./config.js";
function updateCanvasSize() {
  config.cvs.width = config.container.clientWidth;
  config.cvs.height = config.container.clientHeight;
}
function setupSizes() {
  config.paddle.width = config.cvs.width * 0.15;
  config.paddle.height = config.cvs.height * 0.03;
  config.paddle.x = config.cvs.width / 2 - config.paddle.width / 2;
  config.paddle.y = config.cvs.height - config.paddle.height - 40;
  config.paddleDive.style.width = `${config.paddle.width}px`;
  config.paddleDive.style.height = `${config.paddle.height}px`;

  config.ball.x =
    config.paddle.x + config.paddle.width / 2 - config.ball.width / 2;
  config.ball.y = config.paddle.y - config.ball.height;

  config.brick.width =
    (config.cvs.width - (config.brick.cols + 1) * config.brick.gap) /
    config.brick.cols;
  config.brick.height = config.cvs.height * 0.05;
}
function createBricks() {
  config.bricksContainer.innerHTML = "";
  config.bricksPositions.length = 0;

  for (let row = 0; row < config.brick.rows; row++) {
    for (let col = 0; col < config.brick.cols; col++) {
      const div = document.createElement("div");
      div.classList.add("brick", config.brick.colors[row]);
      div.style.width = `${config.brick.width}px`;
      div.style.height = `${config.brick.height}px`;

      const x =
        config.brick.gap + col * (config.brick.width + config.brick.gap);
      const y =
        config.brick.gap + row * (config.brick.height + config.brick.gap);
      div.style.transform = `translate(${x}px, ${y}px)`;

      config.bricksContainer.appendChild(div);
      config.bricksPositions.push({
        element: div,
        x,
        y,
        width: config.brick.width,
        height: config.brick.height,
        status: true,
      });
    }
  }
}
function setupInput() {
  document.body.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") config.cursors.rightPressed = true;
    if (e.key === "ArrowLeft") config.cursors.leftPressed = true;
  });
  document.body.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") config.cursors.rightPressed = false;
    if (e.key === "ArrowLeft") config.cursors.leftPressed = false;
  });
}
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
function update() {
  if (config.cursors.rightPressed)
    config.paddle.x = Math.min(
      config.paddle.x + 5,
      config.cvs.width - config.paddle.width - 2
    );
  if (config.cursors.leftPressed)
    config.paddle.x = Math.max(config.paddle.x - 5, 0);

  config.ball.x += config.ball.dx;
  config.ball.y += config.ball.dy;

  if (
    config.ball.x <= 0 ||
    config.ball.x + config.ball.width >= config.cvs.width
  ) {
    config.ball.dx *= -1;
    return;
  }
  if (config.ball.y <= 0) {
    config.ball.dy *= -1;
    return;
  }
  if (config.ball.y >= config.cvs.height) {
    config.ball.x =
      config.paddle.x + config.paddle.width / 2 - config.ball.width / 2;
    config.ball.y = config.paddle.y - config.ball.height;
    config.ball.dy = -config.ball.speed;
    resetBall();
    return;
  }

  // Collision with paddle
  if (
    config.ball.y + config.ball.height >= config.paddle.y &&
    config.ball.y <= config.paddle.y + config.paddle.height / 2 &&
    config.ball.x + config.ball.width >= config.paddle.x &&
    config.ball.x <= config.paddle.x + config.paddle.width
  ) {
    let collidePoint =
      config.ball.x +
      config.ball.width / 2 -
      (config.paddle.x + config.paddle.width / 2);
    collidePoint =
      Math.floor((collidePoint / (config.paddle.width / 2)) * 10) / 10;

    if (collidePoint >= 0 && collidePoint <= 0.4) {
      collidePoint = 0.4;
    }
    if (collidePoint >= -0.4 && collidePoint < 0) {
      collidePoint = -0.4;
    }

    let angle = collidePoint * (Math.PI / 3);

    config.ball.dx = (config.ball.speed + 1) * Math.sin(angle);
    config.ball.dy = -(config.ball.speed + 1) * Math.cos(angle);
    return;
  }

  // Collision with bricks
  for (let b of config.bricksPositions) {
    if (!b.status) continue;

    const ballLeft = config.ball.x;
    const ballRight = config.ball.x + config.ball.width;
    const ballTop = config.ball.y;
    const ballBottom = config.ball.y + config.ball.height;

    const brickLeft = b.x;
    const brickRight = b.x + b.width;
    const brickTop = b.y;
    const brickBottom = b.y + b.height;

    const isColliding =
      ballRight > brickLeft &&
      ballLeft < brickRight &&
      ballBottom > brickTop &&
      ballTop < brickBottom;

    if (isColliding) {
      b.status = false;
      b.element.style.opacity = 0;

      // Calculate how deep the ball overlaps on each side
      const overlapLeft = ballRight - brickLeft;
      const overlapRight = brickRight - ballLeft;
      const overlapTop = ballBottom - brickTop;
      const overlapBottom = brickBottom - ballTop;

      const minOverlapX = Math.min(overlapLeft, overlapRight);
      const minOverlapY = Math.min(overlapTop, overlapBottom);

      const threshold = 4; // corner sensitivity in pixels

      if (Math.abs(minOverlapX - minOverlapY) < threshold) {
        config.ball.dx *= -1;
        config.ball.dy *= -1;
      } else if (minOverlapX < minOverlapY) {
        // side collision
        config.ball.dx *= -1;
      } else {
        // top/bottom collision
        config.ball.dy *= -1;
      }

      break;
    }
  }
}
function draw() {
  config.gameStatus.scoreValue.innerHTML = config.gameStatus.score;
  config.gameStatus.lifeValue.innerHTML = config.gameStatus.lifes;
  config.ballDive.style.transform = `translate(${config.ball.x}px, ${config.ball.y}px)`;
  config.paddleDive.style.transform = `translate(${config.paddle.x}px, ${config.paddle.y}px)`;
}
function start() {
  config.gameMessage.style.display = "none";
}

function Pause() {
  config.gameMessage.style.display = "block";
}

function Restart() {
  config.gameState.gameOver = false;

  config.gameStatus.lifes = 3;
  config.gameStatus.score = 0;
  config.gameStatus.scoreValue.innerHTML = "0";
  config.gameStatus.lifeValue.innerHTML = "3";

  createBricks();
  setupSizes();
  draw();
  clearInterval(config.time.interval);
  config.time.interval = null;
  config.time.sec = 0;
  config.time.min = 0;
  config.timeValue.innerHTML = "00:00";
}
function resetBall() {
  ball.dx = ball.speed * Math.random();
  ball.dy = -ball.speed;
}

function GameLoop() {
  config.introScreen.classList.add("image");
  let toggle = 0;

  config.pauseBtn.addEventListener("click", () => {
    if (toggle === 0) {
      config.pauseIcon.innerHTML = "▶️ Continue";
      Pause();
      config.gameState.gameStart = false;
      config.gameState.gamePause = true;
      toggle++;
    } else {
      config.pauseIcon.innerHTML = "⏸️ pause";
      start();
      config.gameState.gameStart = true;
      config.gameState.gamePause = false;
      toggle = 0;
    }
  });

  config.continueBtn.addEventListener("click", () => {
    config.pauseIcon.innerHTML = "⏸️ pause";
    config.gameState.gameStart = true;
    config.gameState.gamePause = false;
    start();
  });

  config.restartBtn.addEventListener("click", () => {
    config.gameState.gameStart = false;
    config.gameState.gamePause = false;
    Restart();
  });

  if (!config.gameState.gameStart || config.gameState.gamePause) {
    config.gameMessage.style.display = "block";
  }
  updateCanvasSize();
  setupSizes();
  createBricks();
  setupInput();

  window.addEventListener("resize", () => {
    updateCanvasSize();
    setupSizes();
  });

  loop();
}

GameLoop();
