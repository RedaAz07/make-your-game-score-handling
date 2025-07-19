function GameLoop() {
  const ballDive = document.getElementById("ball");
  const paddleDive = document.getElementById("paddle");
  // const gameMessage = document.getElementById("gameMessage");
  const bricksContainer = document.getElementById("bricksContainer");
  // const timeValue = document.querySelector(".time-value");
  const container = document.getElementById("gameArea");
  let cursors = {
    rightPressed: false,
    leftPressed: false
  }

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
    x: cvs.width / 2 - BALL_RADIUS,
    y: paddle.y - BALL_RADIUS,
    radius: BALL_RADIUS,
    speed: 3,
    dx: 3,
    dy: -3,
  };
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
  document.body.addEventListener('keydown', (event) => {
    if (event.key === "ArrowRight") {
      cursors.rightPressed = true
    } else if (event.key === "ArrowLeft") {
      cursors.leftPressed = true
    }
  });

  document.body.addEventListener('keyup', (event) => {
    if (event.key === "ArrowRight") {
      cursors.rightPressed = false

    } else if (event.key === "ArrowLeft") {
      cursors.leftPressed = false
    }
  });
  loop(ball, paddle, bricksPositions, cvs, ballDive, cursors);
}
function loop(ball, paddle, bricksPositions, cvs, ballDive, cursors) {
  movepaddle(paddle, cursors)
  draw(ball, ballDive, paddle);

  update(ball, paddle, bricksPositions, cvs);
  requestAnimationFrame(() =>
    loop(ball, paddle, bricksPositions, cvs, ballDive, cursors)
  );
}


function movepaddle(paddle, cursors) {
  let brick_container = document.querySelector('.bricks-container')
  
  const paddleWidth = paddle.width;
  const containerWidth = brick_container.offsetWidth
  console.log(cursors.rightPressed);


  if (cursors.rightPressed) {
    paddle.x += 6
  } else if (cursors.leftPressed) {
    paddle.x -= 6;
  }
  if (paddle.x < 0) {
    paddle.x = 0
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

function update(ball, paddle, bricksPositions, cvs) {
  ballPaddleCollision(ball, paddle);
  ballWallCollision(ball, paddle, cvs);
  ballBrikCollision(ball, bricksPositions);
  ball.x += ball.dx;
  ball.y += ball.dy;
}

function draw(ball, divBall, paddle) {
  divBall.style.transform = `translate(${ball.x + ball.dx}px,${ball.y + ball.dy
    }px)`;
  paddle.element.style.transform = `translate(${paddle.x}px)`
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
        // score += SCORE_UNIT;
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
        //   score += SCORE_UNIT;
      }
    }
  }
}
