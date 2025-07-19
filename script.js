function GameLoop() {
    // variables 
    const ball = document.getElementById("ball")
    const paddle = document.getElementById("paddle")
    const gameMessage = document.getElementById("gameMessage")
    const bricksContainer = document.getElementById("bricksContainer")
    const timeValue = document.querySelector(".time-value")
    const container = document.getElementById("gameArea")
    const restartBtn = document.getElementById("restartBtn")


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
    const gameState = {
        gameStart: false,
        gamePause: false,

    }
    const Pressed = {
        rightPressed: false,
        leftPressed: false,
        paddleX: container.offsetWidth / 2
    }
    // pause check 
    if (!gameState.gameStart || gameState.gamePause) {
        gameMessage.style.display = "block"
    }
    // create bricks 
    createbrickes(brick, bricksContainer, bricksPositions)


    //keydown listener 
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
        } else if (e.key === "ArrowRight") {
            Pressed.rightPressed = true
        } else if (e.key === "ArrowLeft") {
            Pressed.leftPressed = true
        }
    })


    // keyup listener ::: move all about move paddle 
    document.body.addEventListener('keyup', (event) => {
        if (event.key === "ArrowRight") {
            Pressed.rightPressed = false

        } else if (event.key === "ArrowLeft") {
            Pressed.leftPressed = false
        }
    });

    // restart listener 

    restartBtn.addEventListener("click", () => {
        restart(gameState, time, Pressed, container)
    })



    loop(Pressed, paddle, gameState)
}


// fuction that create break  and add class Name +  add the brick position 
function createbrickes(brick, bricksContainer, bricksPositions) {
    for (let row = 0; row < brick.brickesrow; row++) {
        for (let col = 0; col < brick.brickescol; col++) {
            const div =
                document.createElement("div")
            div.classList = `brick ${brick.brickesColor[row]}`
            div.style.width = `${brick.brickeswidth}px`
            div.style.height = `${brick.brickesheight}px`

            bricksContainer.appendChild(div)
            bricksPositions.push({
                brickX: 20 + 3 * col + col * brick.brickeswidth,
                bricky: 20 + 3 * row + row * brick.brickesheight,
                brickeswidth: brick.brickeswidth,
                brickesheight: brick.brickesheight,
            })

        }
    }

}
// function that handle the time 
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
// start  handler 
function start(gameMessage) {
    gameMessage.style.display = "none"
}
// pause handler 
function Pause(gameMessage) {
    gameMessage.style.display = "block"

}
/// paddke move handler 
function movepaddle(Pressed, paddle) {
    let brick_container = document.querySelector('.bricks-container')
    const paddleWidth = paddle.offsetWidth;
    const containerWidth = brick_container.offsetWidth


    if (Pressed.rightPressed) {
        Pressed.paddleX += 6;
    } else if (Pressed.leftPressed) {
        Pressed.paddleX -= 6;
    }
    if (Pressed.paddleX < 0) {
        Pressed.paddleX = 0
    }
    if (Pressed.paddleX > containerWidth - paddleWidth) {
        Pressed.paddleX = containerWidth - paddleWidth;
    }

    paddle.style.left = `${Pressed.paddleX}px`;
}


function restart(gameState, time, Pressed, container) {
    time.sec = 0
    time.min = 0
    clearInterval(time.interval)
    time.interval = null
    gameState.gameStart = false
    gameState.gamePause = false
    Pressed.rightPressed = false
    Pressed.leftPressed = false
    Pressed.paddleX = container.offsetWidth / 2
}


GameLoop()

// loop function that add the request animation 
function loop(Pressed, paddle, gameState) {
    if (gameState.gameStart) {
        movepaddle(Pressed, paddle)
    }
  /*   draw(ball, ballDive);
    movepaddle() */
/*     update(ball, paddle, bricksPositions, cvs);
 */    requestAnimationFrame(() =>
        loop(Pressed, paddle, gameState)
    );
}



