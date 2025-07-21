function GameLoop() {
  const ballDive = document.getElementById("ball");
  const paddleDive = document.getElementById("paddle");
  const gameMessage = document.getElementById("gameMessage");
  const bricksContainer = document.getElementById("bricksContainer");
  const timeValue = document.querySelector(".time-value");
  //const container = document.getElementById("gameArea");
  const cvs = {
    width: 606,
    height: 506,
  };
  const paddle = {
    x: 263,
    y: 456,
    width: 84,
    height: 15,
  };
  const BALL_RADIUS = 8;
  const ball = {
    x: cvs.width / 2 - BALL_RADIUS,
    y: paddle.y-18,
    radius: BALL_RADIUS,
    speed: 3,
    dx: 3,
    dy: -3,
  };
  const brick = {
    brickesrow: 6,
    brickescol: 10,
    brickeswidth: 54,
    brickesheight: 17,
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

  loop(ball, paddle, bricksPositions, cvs, ballDive);
}
function loop(ball, paddle, bricksPositions, cvs, ballDive) {
  draw(ball, ballDive);

  update(ball, paddle, bricksPositions, cvs);
  requestAnimationFrame(() =>
    loop(ball, paddle, bricksPositions, cvs, ballDive)
  );
}

function createbrickes(brick, bricksContainer, bricksPositions) {
  for (let row = 0; row < brick.brickesrow; row++) {
    for (let col = 0; col < brick.brickescol; col++) {
      const div = document.createElement("div");
      div.classList = `brick ${brick.brickesColor[row]}`;
      div.style.width = `${brick.brickeswidth}px`;
      div.style.height = `${brick.brickesheight}px`;

      bricksContainer.appendChild(div);

      bricksPositions.push({
        element: div,
        brickX: row * (5 + brick.brickeswidth) + 20,
        bricky: col * (5 + brick.brickesheight) + 20,
        brickeswidth: brick.brickeswidth,
        brickesheight: brick.brickesheight,
        status: true,
      });
    }
  }
}

GameLoop();

function update(ball, paddle, bricksPositions, cvs) {
  ballPaddleCollision(ball, paddle);
  ballWallCollision(ball, paddle, cvs);
  ball.x += ball.dx;
  ball.y += ball.dy;
}

function draw(ball, divBall) {
  divBall.style.transform = `translate(${ball.x + ball.dx}px,${
    ball.y + ball.dy
  }px)`;
}

function resetBall(ball, paddle, cvs) {
  ball.x = cvs.width / 2;
  ball.y = paddle.y - ball.radius;
  ball.dx = ball.speed * (Math.random() * 2 - 1);
  ball.dy = -ball.speed;
}
function ballPaddleCollision(ball, paddle) {
  if (
    ball.y+ ball.radius >= paddle.y &&
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
function ballWallCollision(ball, paddle, cvs) {
  if (ball.x + ball.radius >= cvs.width || ball.x - ball.radius <= 0) {
    ball.dx *= -1;
  }
  if (ball.y - ball.radius <= 0) {
    ball.dy *= -1;
  }
  if (ball.y - ball.radius >= cvs.height) {
    // life--;
    resetBall(ball, paddle, cvs);
  }
}

function ballBrikCollision(ball, bricks) {
  for (let i = 0; i < bricks.length; i++) {
    if (bricks[i].status) {
      console.log("ball =", ball.x - ball.radius);
      console.log("brick =", bricks[i].brickX);
      if (
        ball.x - ball.radius >= bricks[i].brickX &&
        ball.x + ball.radius <= bricks[i].brickX + bricks[i].brickeswidth &&
        (ball.y - ball.radius >= bricks[i].bricky + bricks.brickesheight ||
          ball.y + ball.radius <= bricks[i].bricky)
      ) {
        console.log(55);
        bricks[i].status = false;
        bricks[i].element.style.opacity = 0;
        ball.dy *= -1;
        // score += SCORE_UNIT;
      }
    } else if (
      ball.y - ball.radius >= bricks[i].y &&
      ball.y + ball.radius <= bricks[i].y + bricks.brickesheight &&
      (ball.x - ball.radius <= bricks[i].x + bricks[i].brickeswidth ||
        ball.x + ball.radius >= bricks[i].x)
    ) {
      bricks[i].status = false;
      bricks[i].element.style.opacity = 0;
      ball.dx *= -1;
      //   score += SCORE_UNIT;
    }
  }
}
