const car = document.getElementById("car");
const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const bgMusic = document.getElementById("bgmusic");

let carY = 200;
let velocity = 0;
let gravity = 0.5;
let isGameOver = false;
let score = 0;
let pipeSpeed = 2;
let level = 1;
let shieldActive = false;
let slowMotionActive = false;
let pipeInterval = 1500;
const gap = 150;

// 🎮 Jump function (Keyboard & Touch Support)
function jump() {
    if (!isGameOver) {
        velocity = -7;
    }
}

// Event Listeners
document.addEventListener("keydown", (event) => {
    if (event.key === " ") jump();
    if (event.key === "s") useShield();
    if (event.key === "d") useSlowMotion();
});

document.addEventListener("click", jump);
document.addEventListener("touchstart", jump);

// 🎯 Create Pipes (Upper & Lower Obstacles)
function createPipes() {
    if (isGameOver) return;

    let pipeHeight = Math.random() * 150 + 100;
    let upperPipeHeight = 400 - pipeHeight - gap;

    let upperPipe = document.createElement("div");
    let lowerPipe = document.createElement("div");

    upperPipe.classList.add("pipe", "upper-pipe");
    lowerPipe.classList.add("pipe", "lower-pipe");

    upperPipe.style.height = upperPipeHeight + "px";
    lowerPipe.style.height = pipeHeight + "px";

    upperPipe.style.right = "0px";
    lowerPipe.style.right = "0px";

    gameContainer.appendChild(upperPipe);
    gameContainer.appendChild(lowerPipe);

    let pipeMove = setInterval(() => {
        if (isGameOver) {
            clearInterval(pipeMove);
            return;
        }

        let pipeX = parseInt(window.getComputedStyle(upperPipe).right);
        let speed = slowMotionActive ? 1 : pipeSpeed;

        upperPipe.style.right = pipeX + speed + "px";
        lowerPipe.style.right = pipeX + speed + "px";

        let carTop = carY;
        let carBottom = carY + 70;

        // ❌ Proper Collision Detection
        if (pipeX >= 350 && pipeX <= 400) {
            if (carTop < upperPipeHeight || carBottom > 500 - pipeHeight) {
                if (shieldActive) {
                    shieldActive = false;
                    car.classList.remove("blue-glow");
                    upperPipe.remove();
                    lowerPipe.remove();
                } else {
                    endGame();
                }
            }
        }

        // ✅ Score & Difficulty Increase
        if (pipeX > 400) {
            clearInterval(pipeMove);
            upperPipe.remove();
            lowerPipe.remove();
            score++;
            scoreDisplay.textContent = "Score: " + score;

            if (score % 5 === 0) {
                pipeSpeed += 0.5;
                level++;
                
                if (pipeInterval > 800) {
                    pipeInterval -= 100;
                    restartPipeGeneration();
                }
            }
        }
    }, 20);
}

// 🔄 Update Game Loop
function updateGame() {
    if (isGameOver) return;

    carY += velocity;
    velocity += gravity;

    if (carY > 460 || carY < 0) {
        endGame();
    }

    car.style.top = carY + "px";
}

// 🛡 Shield Skill
function useShield() {
    if (!shieldActive) {
        shieldActive = true;
        car.classList.add("blue-glow");

        setTimeout(() => {
            shieldActive = false;
            car.classList.remove("blue-glow");
        }, 5000);
    }
}

// 🐢 Slow Motion Skill
function useSlowMotion() {
    if (!slowMotionActive) {
        slowMotionActive = true;
        car.classList.add("green-glow");

        setTimeout(() => {
            slowMotionActive = false;
            car.classList.remove("green-glow");
        }, 5000);
    }
}

// 🎮 Game Over Function
function endGame() {
    if (isGameOver) return;
    isGameOver = true;
    bgMusic.pause();
    alert("Game Over! Score: " + score + "\nLevel: " + level);
    location.reload();
}

// ✅ Start Game Loops
setInterval(updateGame, 20);
setInterval(createPipes, pipeInterval);