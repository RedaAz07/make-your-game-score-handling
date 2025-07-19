function GameLoop() {
  const introScreen = document.getElementById("introScreen");
  const ballDive = document.getElementById("ball");
  const paddleDive = document.getElementById("paddle");
  const gameMessage = document.getElementById("gameMessage");
  const bricksContainer = document.getElementById("bricksContainer");
  const timeValue = document.querySelector(".time-value");
  const container = document.getElementById("gameArea");
  const pauseIcon = document.querySelector(".pause-icon");
  const continueBtn = document.getElementById("continueBtn");
  const restartBtn = document.getElementById("restartBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const scoreValue = document.querySelector(".score-value");
  const lifeValue = document.querySelector(".lives-value");

  introScreen.classList.add("image");
  let toggle = 0;
  pauseBtn.addEventListener("click", () => {
    if (toggle === 0) {
      pauseIcon.innerHTML = "▶️ Continue";
      Pause(gameMessage);
      gameState.gameStart = false;
      gameState.gamePause = true;
      toggle++;
    } else {
      pauseIcon.innerHTML = "⏸️ pause";
      start(gameMessage);
      gameState.gameStart = true;
      gameState.gamePause = false;
      toggle = 0;
    }
  });

  continueBtn.addEventListener("click", () => {
    pauseIcon.innerHTML = "⏸️ pause";
    gameState.gameStart = true;
    gameState.gamePause = false;
    start(gameMessage);
  });

  restartBtn.addEventListener("click", () => {
    gameState.gameStart = false;
    gameState.gamePause = false;
    Restart(
      brick,
      bricksContainer,
      bricksPositions,
      time,
      paddle,
      ball,
      ballDive,
      timeValue,
      container,
      dakchi
    );
  });

  // paddel
  let cursors = {
    rightPressed: false,
    leftPressed: false,
  };
  const cvs = {
    width: container.offsetWidth,
    height: container.offsetHeight,
  };
  const paddle = {
    element: paddleDive,
    x: container.offsetWidth / 2 - paddleDive.offsetWidth / 2,
    y: container.offsetHeight - 30,
    width: paddleDive.offsetWidth,
    height: paddleDive.offsetHeight,
  };
  const BALL_RADIUS = 8;
  const ball = {
    x: container.offsetWidth / 2 - paddleDive.offsetWidth / 2,
    y: container.offsetHeight - 60,
    radius: BALL_RADIUS,
    speed: 3,
    dx: 3,
    dy: -3,
  };
  const time = {
    interval: null,
    sec: 0,
    min: 0,
  };
  const gameState = {
    gameStart: false,
    gamePause: false,
  };
  if (!gameState.gameStart || gameState.gamePause) {
    gameMessage.style.display = "block";
  }

  const brick = {
    brickesrow: 6,
    brickescol: 5,
    brickeswidth: 102,
    brickesheight: 25,
    brickesColor: [
      "brick-red",
      "brick-orange",
      "brick-yellow",
      "brick-green",
      "brick-blue",
      "brick-purple",
    ],
  };
  const bricksPositions = [];
  createbrickes(brick, bricksContainer, bricksPositions);
  // keydown listener
  document.body.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key == "Escape" || event.key == "p") {
      if (!gameState.gameStart) {
        introScreen.classList.add("hidden");
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
      cursors.rightPressed = true;
    } else if (event.key === "ArrowLeft") {
      cursors.leftPressed = true;
    }
  });

  document.body.addEventListener("keyup", (event) => {
    if (event.key === "ArrowRight") {
      cursors.rightPressed = false;
    } else if (event.key === "ArrowLeft") {
      cursors.leftPressed = false;
    }
  });

  const dakchi = {
    lifes: 3,
    score: 0,
    scoreValue: scoreValue,
    lifeValue: lifeValue,
  };

  loop(
    ball,
    paddle,
    bricksPositions,
    cvs,
    ballDive,
    cursors,
    gameState,
    dakchi
  );
}

function loop(
  ball,
  paddle,
  bricksPositions,
  cvs,
  ballDive,
  cursors,
  gameState,
  dakchi
) {
  if (gameState.gameStart) {
    movepaddle(paddle, cursors);
    draw(ball, ballDive, paddle, dakchi);

    update(ball, paddle, bricksPositions, cvs, dakchi);
  }
  requestAnimationFrame(() =>
    loop(
      ball,
      paddle,
      bricksPositions,
      cvs,
      ballDive,
      cursors,
      gameState,
      dakchi
    )
  );
}
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

// start  handler
function start(gameMessage) {
  gameMessage.style.display = "none";
}
// pause handler
function Pause(gameMessage) {
  gameMessage.style.display = "block";
}

function Restart(
  brick,
  bricksContainer,
  bricksPositions,
  time,
  paddle,
  ball,
  ballDive,
  timeValue,
  container,
  dakchi
) {
  bricksContainer.innerHTML = "";
  bricksPositions.length = 0;
  dakchi.scoreValue.innerHTML = 0;
  dakchi.score = 0;
  dakchi.lifes = 3;
  createbrickes(brick, bricksContainer, bricksPositions);

  paddle.x = container.offsetWidth / 2 - paddle.width / 2;
  paddle.element.style.transform = `translate(${paddle.x}px)`;

  ball.x = container.offsetWidth / 2 - ball.radius;
  ball.y = paddle.y - ball.radius;
  ball.dx = 3;
  ball.dy = -3;
  ball.speed = 3;
  ballDive.style.transform = `translate(${ball.x}px, ${ball.y}px)`;

  clearInterval(time.interval);
  time.interval = null;
  time.sec = 0;
  time.min = 0;
  timeValue.innerHTML = "00:00";
}

function movepaddle(paddle, cursors) {
  let brick_container = document.querySelector(".bricks-container");

  const paddleWidth = paddle.width;
  const containerWidth = brick_container.offsetWidth;
  console.log(cursors.rightPressed);

  if (cursors.rightPressed) {
    paddle.x += 6;
  } else if (cursors.leftPressed) {
    paddle.x -= 6;
  }
  if (paddle.x < 0) {
    paddle.x = 0;
  }
  if (paddle.x > containerWidth - paddleWidth) {
    paddle.x = containerWidth - paddleWidth;
  }
}

function createbrickes(brick, bricksContainer, bricksPositions) {
  let count = 0;
  for (let row = 0; row < brick.brickesrow; row++) {
    for (let col = 0; col < brick.brickescol; col++) {
      const div = document.createElement("div");
      div.classList = `brick ${brick.brickesColor[row]}`;
      div.style.width = `${brick.brickeswidth}px`;
      div.style.height = `${brick.brickesheight}px`;
      div.id = count;

      bricksContainer.appendChild(div);

      bricksPositions.push({
        id: count,
        element: div,
        x: col * (10 + brick.brickeswidth) + 25,
        y: row * (10 + brick.brickesheight) + 25,
        brickeswidth: brick.brickeswidth,
        brickesheight: brick.brickesheight,
        status: true,
      });
      count++;
    }
  }
}

GameLoop();
generateStars(300);

function update(ball, paddle, bricksPositions, cvs, dakchi) {
  ballPaddleCollision(ball, paddle);
  ballWallCollision(ball, paddle, cvs, dakchi);
  ballBrikCollision(ball, bricksPositions, dakchi);
  ball.x += ball.dx;
  ball.y += ball.dy;
}

function draw(ball, divBall, paddle, dakchi) {
  dakchi.scoreValue.innerHTML = dakchi.score;

  dakchi.lifeValue.innerHTML = dakchi.lifes;

  divBall.style.transform = `translate(${ball.x + ball.dx}px,${
    ball.y + ball.dy
  }px)`;
  console.log(paddle.x);

  paddle.element.style.transform = `translate(${paddle.x}px)`;
}

function resetBall(ball, paddle, cvs) {
  ball.x = cvs.width / 2;
  ball.y = paddle.y - ball.radius;
  ball.dx = ball.speed * (Math.random() * 2 - 1);
  ball.dy = -ball.speed;
}
function ballPaddleCollision(ball, paddle) {
  if (
    ball.y + ball.radius >= paddle.y &&
    ball.y + ball.radius < paddle.y + paddle.height &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    let collidePoint = ball.x - (paddle.x + paddle.width / 2);
    collidePoint = collidePoint / (paddle.width / 2);
    let angle = collidePoint * (Math.PI / 3);
    ball.dx = ball.speed * Math.sin(angle);
    console.log(ball.dx);

    ball.dy = -ball.speed * Math.cos(angle);
    console.log(ball.dy);
  }
  if (
    ball.y >= paddle.y &&
    ball.y + ball.radius <= paddle.y + paddle.height &&
    ((ball.x + ball.radius >= paddle.x &&
      ball.x + ball.radius <= paddle.x + 5) ||
      (ball.x <= paddle.x + paddle.width &&
        ball.x >= paddle.x + paddle.width - 5))
  ) {
    ball.dx *= -1;
  }
}
function ballWallCollision(ball, paddle, cvs, dakchi) {
  if (ball.x + ball.radius >= cvs.width || ball.x - ball.radius <= 0) {
    ball.dx *= -1;
  }
  if (ball.y - ball.radius <= 0) {
    ball.dy *= -1;
  }
  if (ball.y - ball.radius >= cvs.height) {
    dakchi.lifes--;
    resetBall(ball, paddle, cvs);
  }
}

function ballBrikCollision(ball, bricks, dakchi) {
  for (let i = 0; i < bricks.length; i++) {
    if (bricks[i].status) {
      // console.log("ball = ", ball.x, ball.y);
      // console.log("brick =", bricks[i].x, bricks[i].y);

      if (
        ball.x >= bricks[i].x &&
        ball.x <= bricks[i].x + bricks[i].brickeswidth &&
        ((ball.y - ball.radius <= bricks[i].y + bricks[i].brickesheight &&
          ball.y - ball.radius > bricks[i].y) ||
          (ball.y + ball.radius >= bricks[i].y &&
            ball.y + ball.radius < bricks[i].y + bricks[i].brickesheight))
      ) {
        console.log(55);
        bricks[i].status = false;
        bricks[i].element.style.opacity = 0;
        ball.dy *= -1;
        dakchi.score += 20;
      } else if (
        ball.y >= bricks[i].y &&
        ball.y <= bricks[i].y + bricks[i].brickesheight &&
        ((ball.x + ball.radius >= bricks[i].x &&
          ball.x + ball.radius < bricks[i].x + bricks[i].brickeswidth) ||
          (ball.x - ball.radius <= bricks[i].x + bricks[i].brickeswidth &&
            ball.x - ball.radius > bricks[i].x))
      ) {
        console.log(66);

        bricks[i].status = false;
        bricks[i].element.style.opacity = 0;
        ball.dx *= -1;
        dakchi.score += 20;
      }
    }
  }
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
