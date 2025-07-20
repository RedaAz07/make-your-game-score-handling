function GameLoop() {
  const ballDive = document.getElementById("ball");
  const paddleDive = document.getElementById("paddle");
  const bricksContainer = document.getElementById("bricksContainer");
  const container = document.getElementById("gameArea");

  const cvs = { width: 0, height: 0 };
  updateCanvasSize();

  let cursors = { rightPressed: false, leftPressed: false };

  const paddle = {
    element: paddleDive,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  const BALL_RADIUS = 8;
  const ball = {
    x: 0,
    y: 0,
    width: ballDive.clientWidth,
    height: ballDive.clientHeight,
    radius: BALL_RADIUS,
    speed: 4,
    dx: 4,
    dy: -4,
  };

  const brick = {
    rows: 6,
    cols: 5,
    gap: 10,
    width: 0,
    height: 0,
    colors: [
      "brick-red",
      "brick-orange",
      "brick-yellow",
      "brick-green",
      "brick-blue",
      "brick-purple",
    ],
  };

  const bricksPositions = [];
  console.log(ball, paddle);

  setupSizes();
  createBricks();
  setupInput();
  console.log(ball, paddle);

  window.addEventListener("resize", () => {
    updateCanvasSize();
    setupSizes();
  });

  loop();

  function updateCanvasSize() {
    cvs.width = container.clientWidth;
    cvs.height = container.clientHeight;
  }
  console.log(cvs);

  function setupSizes() {
    paddle.width = cvs.width * 0.15;
    paddle.height = cvs.height * 0.03;
    paddle.x = cvs.width / 2 - paddle.width / 2;
    paddle.y = cvs.height - paddle.height - 40;
    paddleDive.style.width = `${paddle.width}px`;
    paddleDive.style.height = `${paddle.height}px`;

    ball.x = paddle.x + paddle.width / 2 - ball.width / 2;
    ball.y = paddle.y - ball.height;

    brick.width = (cvs.width - (brick.cols + 1) * brick.gap) / brick.cols;
    brick.height = cvs.height * 0.05;
  }

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
  console.log(bricksPositions);

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
      console.log(collidePoint);
      collidePoint = Math.floor((collidePoint / (paddle.width / 2)) * 10) / 10;
      console.log(collidePoint);

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
        // Mark brick as destroyed
        b.status = false;
        b.element.style.opacity = 0;

        // Determine collision side (compare overlap distances)
        const overlapLeft = ballRight - brickLeft;
        const overlapRight = brickRight - ballLeft;
        const overlapTop = ballBottom - brickTop;
        const overlapBottom = brickBottom - ballTop;

        const minOverlapX = Math.min(overlapLeft, overlapRight);
        const minOverlapY = Math.min(overlapTop, overlapBottom);

        if (minOverlapX < minOverlapY) {
          ball.dx *= -1; // horizontal bounce
        } else {
          ball.dy *= -1; // vertical bounce
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
