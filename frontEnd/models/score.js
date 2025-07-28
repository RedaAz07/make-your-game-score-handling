import * as config from "./config.js";
export function ScoreHandler() {
  content.innerHTML = `
    <div >
      write ur name : <input type="text" id="input">
      <button id="inputbutton" type="button">click</button>
    </div>
  `;

  const input = document.getElementById("input");
  const inputbutton = document.getElementById("inputbutton");
  inputbutton.addEventListener("click", () => {
    if (input.value.length <= 0) {
      return
    }
    postData(input);
  });
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

    await getDAta(); // refresh scoreboard
  } catch (error) {
    console.log(error);
  }
}

// pagination control
let start = 0;
let end = 5;
let next = 5
let fullData = []; // store full scoreboard data

function reload(data) {
  // store data globally for pagination
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

  let tableHTML = `
    <table >
      <tr style="">
        <th >Ranc</th>
        <th >Name</th>
        <th >Score</th>
        <th >Time</th>
      </tr>
  `;

  sliced.forEach((score, index) => {
    tableHTML += `
      <tr>
        <td >${start + index + 1}</td>
        <td >${score.name}</td>
        <td >${score.score}</td>
        <td >${score.time}</td>
      </tr>
    `;
  });

  tableHTML += `</table>`;

  document.body.innerHTML = `
    <div id="scorboarddiv" >
      <h2 >🏆 Scoreboard</h2>
      ${tableHTML}
      <button id="prev"><<</button>
      <span id="current">${Math.floor(start / next) + 1}</span>
      <button id="next">>></button>
    </div>
  `;
  document.getElementById("next").addEventListener("click", () => {
    nextt();
  });

  document.getElementById("prev").addEventListener("click", () => {
    prevt();
  });
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

export async function getDAta() {
  try {
    let res = await fetch("http://localhost:8080/scores");
    let data = await res.json();
    reload(data);
  } catch (error) {
    console.log(error);
  }
}
