import * as config from "./config.js";

export function creatTime() {
  if (config.gameState.gameStart && config.time.interval === null) {
    config.time.interval = setInterval(() => {
      config.time.sec++;
      if (config.time.sec === 60) {
        config.time.min++;
        config.time.sec = 0;
      }
      config.timeValue.textContent = `${String(config.time.min).padStart(
        2,
        "0"
      )}:${String(config.time.sec).padStart(2, "0")}`;
    }, 1000);
  } else if (config.gameState.gamePause) {
    clearInterval(config.time.interval);
    config.time.interval = null;
  }
}

export function clearAnimation() {
  if (config.requestID.id) {
    cancelAnimationFrame(config.requestID.id);
    config.requestID.id = null;
  }
}
export function draw() {
  config.gameStatus.scoreValue.textContent = config.gameStatus.score;
  config.gameStatus.lifeValue.textContent = config.gameStatus.lifes;
  config.ballDive.style.transform = `translate3d(${config.ball.x}px, ${config.ball.y}px,0)`;
  config.paddleDive.style.transform = `translate3d(${config.paddle.x}px, ${config.paddle.y}px, 0)`;
}

export function createBricks() {
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
export function setupSizes() {
  config.paddle.width = config.cvs.width * 0.16;
  config.paddle.height = config.cvs.height * 0.04;
  config.paddle.x = config.cvs.width / 2 - config.paddle.width / 2;
  config.paddle.y = config.cvs.height - config.paddle.height - 40;
  config.paddleDive.style.width = `${config.paddle.width}px`;
  config.paddleDive.style.height = `${config.paddle.height}px`;

  config.ball.x =
    config.paddle.x + config.paddle.width / 2 - config.ball.width / 2;
  config.ball.y = config.paddle.y - config.ball.height;
  config.ball.width = config.ballDive.clientWidth;
  config.ball.height = config.ballDive.clientHeight;
  config.brick.width =
    (config.cvs.width - (config.brick.cols + 1) * config.brick.gap) /
    config.brick.cols;
  config.brick.height = config.cvs.height * 0.05;
}

export function updateGameAreaSize() {
  config.cvs.width = config.container.clientWidth;
  config.cvs.height = config.container.clientHeight;
}
