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
  if (config.gameState.gameStart && !config.wait.status) {
    update();
    draw();
    clearAnimation(config.requestID.id);
    config.requestID.id = requestAnimationFrame(loop);
  }
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
    config.gameStatus.lifes--;

    if (config.gameStatus.lifes === 0) {
      config.gameState.gameOver = true;
      config.gameState.gameStart = false;
      gameOver();
      return;
    }
    config.wait.status = true;
    setTimeout(() => {
      config.wait.status = false;
      loop()
    }, 3000);
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

    if (collidePoint >= 0 && collidePoint <= 0.2) {
      collidePoint = 0.2;
    }
    if (collidePoint >= -0.2 && collidePoint < 0) {
      collidePoint = -0.2;
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
        config.gameStatus.score += 20;
      } else if (minOverlapX < minOverlapY) {
        // side collision
        config.ball.dx *= -1;
        config.gameStatus.score += 20;
      } else {
        // top/bottom collision
        config.ball.dy *= -1;
        config.gameStatus.score += 20;
      }

      break;
    }
  }
  const allBricksBroken = config.bricksPositions.every(
    (b) => b.status === false
  );
  if (
    allBricksBroken &&
    !config.gameState.gameOver &&
    !config.gameState.gameWine
  ) {
    config.gameState.gameWine = true;
    config.gameState.gameStart = false;
    gameWin();
    return;
  }
}
function gameWin() {
  config.gameState.gameStart = false;
  config.gameState.gamePause = true;

  config.gameMessage.innerText = "🎉 You Win! Press Space to Restart";
  config.gameMessage.style.display = "block";

  clearInterval(config.time.interval);
  config.time.interval = null;
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
  window.location.reload();
}
function resetBall() {
  config.ball.x =
    config.paddle.x + config.paddle.width / 2 - config.ball.width / 2;
  config.ball.y = config.paddle.y - config.ball.height;
  config.ball.dy = -config.ball.speed;
  config.ball.dx = config.ball.speed * Math.random();
  config.ball.dy = -config.ball.speed;
}
function gameOver() {
  // Stop game
  config.gameState.gameStart = false;
  config.gameState.gamePause = true;
  console.log(config.requestID);

  clearAnimation();
  config.gameMessage.innerText = "💀 Game Over! Press Space to Restart";
  config.gameMessage.style.display = "block";

  // Stop timer
  clearInterval(config.time.interval);
  config.time.interval = null;
}
function creatTime() {
  if (config.gameState.gameStart && config.time.interval === null) {
    config.time.interval = setInterval(() => {
      config.time.sec++;
      if (config.time.sec === 60) {
        config.time.min++;
        config.time.sec = 0;
      }
      config.timeValue.innerHTML = `${String(config.time.min).padStart(
        2,
        "0"
      )}:${String(config.time.sec).padStart(2, "0")}`;
    }, 1000);
  } else if (config.gameState.gamePause) {
    clearInterval(config.time.interval);
    config.time.interval = null;
  }
}

function clearAnimation() {
  if (config.requestID.id) {
    cancelAnimationFrame(config.requestID.id);
  }
}

function GameLoop() {
  config.introScreen.classList.add("image");

  config.pauseBtn.addEventListener("click", () => {
    if (config.gameState.gameStart && !config.gameState.gamePause) {
      config.pauseIcon.innerHTML = "▶️ Continue";
      config.gameState.gameStart = false;
      config.gameState.gamePause = true;
      clearAnimation();
      creatTime();
      Pause();
    } else if (
      !config.gameState.gameStart &&
      config.gameState.gamePause &&
      !config.gameState.gameOver &&
      !config.gameState.gameWine
    ) {
      config.pauseIcon.innerHTML = "⏸️ pause";
      config.gameState.gameStart = true;
      config.gameState.gamePause = false;
      start();
      clearAnimation();
      creatTime();
      loop();
    }
  });

  config.continueBtn.addEventListener("click", () => {
    config.pauseIcon.innerHTML = "⏸️ pause";
    config.gameState.gameStart = true;
    config.gameState.gamePause = false;
    start();
    creatTime();
    clearAnimation();
    loop();
  });

  config.restartBtn.addEventListener("click", () => {
    Restart();
  });

  document.body.addEventListener("keydown", (event) => {
    event.preventDefault();
    if (event.key === " ") {
      if (
        (config.gameState.gameOver || config.gameState.gameWine) &&
        config.gameState.gamePause
      ) {
        Restart();
      } else if (!config.gameState.gameStart && !config.gameState.gamePause) {
        config.introScreen.classList.add("hidden");
        config.pauseIcon.innerHTML = "⏸️ pause";
        config.gameState.gameStart = true;
        config.gameState.gamePause = false;
        start();
        creatTime();
        clearAnimation();
        loop();
      } else if (config.gameState.gameStart && !config.gameState.gamePause) {
        config.pauseIcon.innerHTML = "▶️ Continue";
        config.gameState.gamePause = true;
        config.gameState.gameStart = false;
        clearAnimation();
        creatTime();
        Pause();
      } else if (
        !config.gameState.gameStart &&
        config.gameState.gamePause &&
        !config.gameState.gameOver &&
        !config.gameState.gameWine
      ) {
        // Resume after pause
        config.pauseIcon.innerHTML = "⏸️ pause";
        config.gameState.gameStart = true;
        config.gameState.gamePause = false;
        start();
        creatTime();
        clearAnimation();
        loop();
      }
    }
  });

  updateCanvasSize();
  setupSizes();
  createBricks();
  setupInput();

  window.addEventListener("resize", () => {
    updateCanvasSize();
    setupSizes();
    Restart();
  });
}
function generateStars(count = 100) {
  const container = document.getElementById("starsBackground");

  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    const size = Math.random() * 2 + 1;
    star.classList.add("star");
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;

    star.style.animationDuration = `${10 + Math.random() * 20}s`;

    container.appendChild(star);
  }
}
generateStars(300)
GameLoop();
