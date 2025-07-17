function GameLoop() {
    const ball = document.getElementById("ball")
    const paddle = document.getElementById("paddle")
    const gameMessage = document.getElementById("gameMessage")
    const bricksContainer = document.getElementById("bricksContainer")
    const timeValue = document.querySelector(".time-value")

    let brickesrow = 6
    let brickescol = 10
    let brickeswidth = 52
    let brickesheight = 15
    const time = {
        interval: null,
        sec: 0,
        min: 0
    }
    let gameStart = false
    let gamePause = false


    const gameState = {
        gameStart,
        gamePause
    }
    if (!gameState.gameStart || gameState.gamePause) {
        gameMessage.style.display = "block"
    }


    let brickesColor = ["brick-red", "brick-orange", "brick-yellow", "brick-green", "brick-blue", "brick-purple"]


    createbrickes(brickesrow, brickescol, brickeswidth, brickesheight, brickesColor, bricksContainer)







    document.addEventListener("keydown", (e) => {
        if (e.key === " ") {
            if (!gameState.gameStart) {

                gameState.gameStart = true
                gameState.gamePause = false
                start(gameMessage)
                creatTime(timeValue, time, gameState)
            } else {

                gameState.gamePause = true
                gameState.gameStart = false
                creatTime(timeValue, time, gameState)
                Pause(gameMessage, gameState)
            }
        }
    })




}



function createbrickes(brickesrow, brickescol, brickeswidth, brickesheight, brickesColor, bricksContainer) {


    for (let row = 0; row < brickesrow; row++) {
        for (let col = 0; col < brickescol; col++) {


            const div =
                document.createElement("div")
            div.classList = `brick ${brickesColor[row]}`
            div.style.width = `${brickeswidth}px`
            div.style.height = `${brickesheight}px`
            bricksContainer.appendChild(div)

        }
    }

}

function creatTime(timeValue, time, gameState) {
    if (gameState.gameStart && time.interval === null) {
        time.interval = setInterval(() => {
            time.sec++
            if (time.sec === 60) {
                time.min++
                time.sec = 0
            }
            timeValue.innerHTML = `${String(time.min).padStart(2, "0")}:${String(time.sec).padStart(2, "0")}`
        }, 1000)
    } else if (gameState.gamePause) {
        clearInterval(time.interval)
        time.interval = null
    }
}

function start(gameMessage) {
    gameMessage.style.display = "none"
}
function Pause(gameMessage) {
    gameMessage.style.display = "block"

}
GameLoop()


