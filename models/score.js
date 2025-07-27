import *  as config from "./config.js"
export function ScoreHandler() {

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
        await getDAta()
    } catch (error) {

    }
}

export async function getDAta() {
    try {
        let res = await fetch("http://localhost:8080/scores")

        let data = await res.json()

 data = data.sort((a,b)=>b.score-a.score)
 console.log(data);
 
        let tableHTML = `
          <table style="width: 100%; border-collapse: collapse; color: white;">
            <tr style="border-bottom: 1px solid red;">
              <th style="padding: 10px;">Ranc</th>
              <th style="padding: 10px;">Name</th>
              <th style="padding: 10px;">Score</th>
              <th style="padding: 10px;">Time</th>
            </tr>
        `;

        data.forEach((score,index) => {
            tableHTML += `
            <tr>
              <td style="padding: 10px; text-align: center;">${index+1}</td>
              <td style="padding: 10px; text-align: center;">${score.name}</td>
              <td style="padding: 10px; text-align: center;">${score.score}</td>
              <td style="padding: 10px; text-align: center;">${score.time}</td>
            </tr>
          `;
        });

        tableHTML += `</table>`;

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