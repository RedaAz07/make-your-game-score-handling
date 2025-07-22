export function setupInput(cursors) {
  document.body.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") cursors.rightPressed = true;
    if (e.key === "ArrowLeft") cursors.leftPressed = true;
  });
  document.body.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") cursors.rightPressed = false;
    if (e.key === "ArrowLeft") cursors.leftPressed = false;
  });
}

export function movePaddle(cursors, paddle, cvs) {
  if (cursors.rightPressed)
    paddle.x = Math.min(paddle.x + 5, cvs.width - paddle.width - 2);
  if (cursors.leftPressed) paddle.x = Math.max(paddle.x - 5, 0);
}
