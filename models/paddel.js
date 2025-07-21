export function setupInput() {
  document.body.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") config.cursors.rightPressed = true;
    if (e.key === "ArrowLeft") config.cursors.leftPressed = true;
  });
  document.body.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") config.cursors.rightPressed = false;
    if (e.key === "ArrowLeft") config.cursors.leftPressed = false;
  });
}