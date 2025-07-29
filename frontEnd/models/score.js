import * as config from "./config.js";

// pagination control
let start = 0;
let end = 5;
let next = 5;
let fullData = [];
let errorspa = null
const content = document.getElementById("content");

//  Main handler
export function ScoreHandler(value) {
  document.body.innerHTML = `
    <div class="game-over-container">
        <h1 class="game-over-title">${value}</h1>
        <div class="score-display">
            <div class="score-label">YOUR SCORE</div>
            <div class="current-score" id="currentScore">${config.gameStatus.score}</div>
        </div>
        <div class="save-score-section">
            <div class="save-title">💾 Save Your Score</div>
            <div class="input-container">
                <input type="text" class="username-input" id="usernameInput" placeholder="Enter your username" maxlength="20">
                <button class="save-button" id="inputbutton">SAVE</button>
            </div>
            <span id="error"></span>
            <div class="high-scores">
                <div class="scores-title">🏆 HIGH SCORES</div>
                <div class="scores-list" id="scoresList">
                    <!-- Scores will be populated here -->
                </div>
                <div class="pagination-controls">
                    <button class="pagination-btn" id="prevBtn">« PREV</button>
                    <div class="pagination-info" id="paginationInfo">${Math.floor(start / next) + 1}</div>
                    <button class="pagination-btn" id="nextBtn">NEXT »</button>
                </div>
            </div>
        </div>
        <div class="restart-info">
            Press <span class="restart-key">SPACE</span> to restart the game
        </div>
    </div>
  `;

  const input = document.getElementById("usernameInput");
  const inputbutton = document.getElementById("inputbutton");

  errorspa = document.getElementById("error")
  let ctr = 0

  inputbutton.addEventListener("click", () => {

    if (ctr >= 1) {
      return
    }

   

    if (input.value.trim() === "" || input.value.length <= 3 || input.value.length > 10) {
      errorspa.innerHTML = "your username must be more that 3 charts"
    }else {
      errorspa.innerHTML = ""
      postData(input).then(() => {
        start = 0
        end = 5;
      });
      input.value = ""
      ctr++
      inputbutton.disabled = true
    }
  });


  document.getElementById("nextBtn").addEventListener("click", () => {
    console.log("next");

    if (fullData.length <= 5) {
      document.getElementById("nextBtn").disabled = true
      return
    }
    nextt();
  });

  document.getElementById("prevBtn").addEventListener("click", () => {
    console.log("prev");

    if (fullData.length <= 5) {
      document.getElementById("prevBtn").disabled = true
      return
    }
    prevt();
  });

  getDAta();

  const socket = new WebSocket("ws://localhost:8080/ws");
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      start = 0;
      end = 5;
      reload(data);
    } catch (e) {
      console.error("Invalid data from WebSocket:", e);
    }
  };


}

export async function postData(input) {
  const data = {
    name: input.value,
    score: config.gameStatus.score,
    time: config.timeValue.textContent
  };

  try {
    let res = await fetch("http://localhost:8080/addScore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      let errmsg = await res.text()
      throw new Error(errmsg);
    }
  } catch (error) {
    errorspa.innerHTML = error
  }
}

export async function getDAta() {
  try {
    let res = await fetch("http://localhost:8080/scores");
    if (!res.ok) {
      let errmsg = await res.text()
      throw new Error(errmsg);
    }
    let data = await res.json();
    await reload(data);
  } catch (error) {
    errorspa.innerHTML = error
  }
}

async function reload(data) {
  fullData = data.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    } else {
      const timeA = Number(a.time.replace(":", ""));
      const timeB = Number(b.time.replace(":", ""));
      return timeA - timeB;
    }
  });

  const sliced = fullData.slice(start, end);
  const scoresList = document.getElementById("scoresList");
  scoresList.innerHTML = "";

  sliced.forEach((score, index) => {
    const scoreItem = document.createElement("div");
    scoreItem.className = "score-item";
    scoreItem.innerHTML = `
      <span class="score-rank">#${start + index + 1}</span>
      <span class="score-name">${score.name}</span>
      <span class="score-points">${score.score.toLocaleString()}</span>|
      <span >${score.time}</span>
    `;
    scoresList.appendChild(scoreItem);
  });

  document.getElementById("paginationInfo").innerText = Math.floor(start / next) + 1;
}

function nextt() {
  if (end < fullData.length) {
    start = end;
    end += next;
    reload(fullData);
  }
}

function prevt() {
  if (start - next >= 0) {
    end = start;
    start -= next;
    reload(fullData);
  }
}
