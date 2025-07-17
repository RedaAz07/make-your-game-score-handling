const ball = {
  x: cvs.width / 2,
  y: paddle.y - BALL_RADIUS,
  radius: BALL_RADIUS,
  speed: 3,
  dx: 3,
  dy: -3,
};
function resetBall() {
  ball.x = cvs.width / 2;
  ball.y = paddle.y - ball.radius;
  ball.dx = ball.speed * (Math.random() * 2 - 1);
  ball.dy = -ball.speed;
}
function ballPaddleCollision() {
  if (
    ball.y === paddle.y &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    let collidePoint = ball.x - (paddle.x + paddle.width / 2);
    collidePoint = collidePoint / (paddle.width / 2);
    let angle = collidePoint * (Math.PI / 3);
    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
  }
  if (
    ball.y > paddle.y &&
    ball.y < pabble.y + paddle.height &&
    (ball.x === paddle.x || ball.x === paddle.x + paddle.width)
  ) {
    ball.dx *= -1;
  }
}
function ballWallCollision() {
  if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
    ball.dx *= -1;
  }
  if (ball.y - ball.radius < 0) {
    ball.y *= -1;
  }
  if (ball.y + ball.radius > cvs.height) {
    life--;
    resetBall();
  }
}

function name(params) {}
