import * as config from "./config.js";



export function resetBall() {
  config.ball.x =
    config.paddle.x + config.paddle.width / 2 - config.ball.width / 2;
  config.ball.y = config.paddle.y - config.ball.height;
  config.ball.dy = -config.ball.speed;
  config.ball.dx = config.ball.speed * Math.random();
}

