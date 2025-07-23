import *  as config from "./config.js";
import { clearAnimation } from "./helpers.js";

export function gameWin() {
  config.gameState.gameStart = false;
  config.gameState.gamePause = true;
  config.gameMessage.innerText = `You Win! Press Space to Restart\n your final score : ${config.gameStatus.score}`;
  config.gameMessage.style.display = "block";
  clearAnimation();
  clearInterval(config.time.interval);
  config.time.interval = null;
}

export function start() {
  config.gameMessage.style.display = "none";
}

export function Pause() {
  config.gameMessage.style.display = "block";
}

export function gameOver() {
  // Stop game
  config.gameState.gameStart = false;
  config.gameState.gamePause = true;

  clearAnimation();
  config.gameMessage.innerText = `Game Over! \n Press Space to Restart \n your final score : ${config.gameStatus.score}`;
  config.gameMessage.style.display = "block";

  // Stop timer
  clearInterval(config.time.interval);
  config.time.interval = null;
}

export function Restart() {
  window.location.reload();
}