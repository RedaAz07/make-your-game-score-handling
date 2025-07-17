function GameLoop() {
    const ball = document.getElementById("ball")
    const paddle = document.getElementById("paddle")
    const gameMessage = document.getElementById("gameMessage")
    const bricksContainer = document.getElementById("bricksContainer")
    const timeValue = document.querySelector(".time-value")



    const brick = {

        brickesrow: 6,
        brickescol: 10,
        brickeswidth: 52,
        brickesheight: 15,
        brickesColor: ["brick-red", "brick-orange", "brick-yellow", "brick-green", "brick-blue", "brick-purple"]
    }
    const bricksPositions = []

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




    createbrickes(brick, bricksContainer, bricksPositions)




    console.log(bricksPositions);



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



function createbrickes(brick, bricksContainer, bricksPositions) {


    for (let row = 0; row < brick.brickesrow; row++) {
        for (let col = 0; col < brick.brickescol; col++) {


            const div =
                document.createElement("div")
            div.classList = `brick ${brick.brickesColor[row]}`
            div.style.width = `${brick.brickeswidth}px`
            div.style.height = `${brick.brickesheight}px`

            bricksContainer.appendChild(div)
            let position = div.getBoundingClientRect()
            bricksPositions.push({
                brickX: position.x,
                bricky: position.y,
                brickeswidth: brick.brickeswidth,
                brickesheight: brick.brickesheight,
            })

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


