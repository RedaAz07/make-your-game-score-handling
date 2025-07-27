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
  /*   config.gameMessage.innerText = `Game Over! \n Press Space to Restart \n your final score : ${config.gameStatus.score}`;
    config.gameMessage.style.display = "block"; */

  // Stop timer
  clearInterval(config.time.interval);
  config.time.interval = null;
  scoreee()
}


function scoreee() {

  content.innerHTML = `
 <div>
    write ur name :<input type="text" id="input">
    <button id="inputbutton" onclick="">click</button>
  </div>
`
const input = document.getElementById("input")
  const inputbutton = document.getElementById("inputbutton")

  inputbutton.addEventListener("click", (event) => {
   
postData(input)

})

}
async function postData(input) {
 const data = {
      name:input.value,
      score: config.gameStatus.score,
      time: `${}`
    };

    console.log(data);
    
  try {
    let res = await fetch("http://localhost:8080/addScore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
     await getDAta()
  } catch (error) {

  }
}

async function getDAta() {
  try {
    let res = await fetch("http://localhost:8080/scores")

    let data = await res.json()


      // جدول النتائج
        let tableHTML = `
          <table style="width: 100%; border-collapse: collapse; color: white;">
            <tr style="border-bottom: 1px solid red;">
              <th style="padding: 10px;">Name</th>
              <th style="padding: 10px;">Score</th>
              <th style="padding: 10px;">Time</th>
            </tr>
        `;

        data.forEach(score => {
          tableHTML += `
            <tr>
              <td style="padding: 10px; text-align: center;">${score.name}</td>
              <td style="padding: 10px; text-align: center;">${score.score}</td>
              <td style="padding: 10px; text-align: center;">${score.time}</td>
            </tr>
          `;
        });

        tableHTML += `</table>`;

        // نعرضو فـ div ديالنا
        config.gameContainer.innerHTML = `
          <div style="
            background-color: black;
            border: 3px solid red;
            color: white;
            padding: 20px;
            width: 80%;
            max-width: 600px;
            margin: 50px auto;
            text-align: center;
            border-radius: 10px;
            font-family: Arial, sans-serif;
          ">
            <h2 style="color: red;">🏆 Scoreboard</h2>
            ${tableHTML}
          </div>
        `;

  } catch (error) {
    console.log(error);

  }

}



export function Restart() {
  window.location.reload();
}