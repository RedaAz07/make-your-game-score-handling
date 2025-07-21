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
    config.brick.brick.cols;
  config.brick.height = config.cvs.height * 0.05;
}
function GameLoop() {
  updateCanvasSize();
  setupSizes();
  createBricks();
  setupInput();

  window.addEventListener("resize", () => {
    updateCanvasSize();
    setupSizes();
  });

  loop();

  function setupInput() {
    document.body.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") cursors.rightPressed = true;
      if (e.key === "ArrowLeft") cursors.leftPressed = true;
    });
    document.body.addEventListener("keyup", (e) => {
      if (e.key === "ArrowRight") cursors.rightPressed = false;
      if (e.key === "ArrowLeft") cursors.leftPressed = false;
    });
  }

  function createBricks() {
    bricksContainer.innerHTML = "";
    bricksPositions.length = 0;

    for (let row = 0; row < brick.rows; row++) {
      for (let col = 0; col < brick.cols; col++) {
        const div = document.createElement("div");
        div.classList.add("brick", brick.colors[row]);
        div.style.width = `${brick.width}px`;
        div.style.height = `${brick.height}px`;

        const x = brick.gap + col * (brick.width + brick.gap);
        const y = brick.gap + row * (brick.height + brick.gap);
        div.style.transform = `translate(${x}px, ${y}px)`;

        bricksContainer.appendChild(div);
        bricksPositions.push({
          element: div,
          x,
          y,
          width: brick.width,
          height: brick.height,
          status: true,
        });
      }
    }
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  function update() {
    if (cursors.rightPressed)
      paddle.x = Math.min(paddle.x + 5, cvs.width - paddle.width);
    if (cursors.leftPressed) paddle.x = Math.max(paddle.x - 5, 0);

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x <= 0 || ball.x + ball.width >= cvs.width) {
      ball.dx *= -1;
      return;
    }
    if (ball.y <= 0) {
      ball.dy *= -1;
      return;
    }
    if (ball.y >= cvs.height) {
      ball.x = paddle.x + paddle.width / 2 - ball.width / 2;
      ball.y = paddle.y - ball.height;
      ball.dy = -ball.speed;
      return;
    }

    // Collision with paddle
    if (
      ball.y + ball.height >= paddle.y &&
      ball.y <= paddle.y + paddle.height / 2 &&
      ball.x + ball.width >= paddle.x &&
      ball.x <= paddle.x + paddle.width
    ) {
      let collidePoint =
        ball.x + ball.width / 2 - (paddle.x + paddle.width / 2);
      collidePoint = Math.floor((collidePoint / (paddle.width / 2)) * 10) / 10;

      if (collidePoint >= 0 && collidePoint <= 0.4) {
        collidePoint = 0.4;
      }
      if (collidePoint >= -0.4 && collidePoint < 0) {
        collidePoint = -0.4;
      }

      let angle = collidePoint * (Math.PI / 3);

      ball.dx = (ball.speed + 1) * Math.sin(angle);
      ball.dy = -(ball.speed + 1) * Math.cos(angle);
      return;
    }

    // Collision with bricks
    for (let b of bricksPositions) {
      if (!b.status) continue;

      const ballLeft = ball.x;
      const ballRight = ball.x + ball.width;
      const ballTop = ball.y;
      const ballBottom = ball.y + ball.height;

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
          ball.dx *= -1;
          ball.dy *= -1;
        } else if (minOverlapX < minOverlapY) {
          // side collision
          ball.dx *= -1;
        } else {
          // top/bottom collision
          ball.dy *= -1;
        }

        break;
      }
    }
  }

  function draw() {
    ballDive.style.transform = `translate(${ball.x}px, ${ball.y}px)`;
    paddleDive.style.transform = `translate(${paddle.x}px, ${paddle.y}px)`;
  }
}

GameLoop();
