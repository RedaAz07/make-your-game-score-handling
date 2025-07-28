import *  as config from "./config.js";
import { clearAnimation } from "./helpers.js";
import { ScoreHandler } from "./score.js";


export function gameWin() {

   config.gameState.gameStart = false;
  config.gameState.gamePause = true;
  clearAnimation();
  clearInterval(config.time.interval);
  config.time.interval = null;
  config.gameContainer.style.opacity = "0,3";  
  ScoreHandler("Game Win")

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
 

  // Stop timer
  clearInterval(config.time.interval);
  config.time.interval = null;
  ScoreHandler("Game Over")

}







export function Restart() {
  window.location.reload();
}