const bird = document.getElementById("bird");
const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");

let birdY = 200;
let velocity = 0;
let gravity = 0.5;
let isGameOver = false;
let score = 0;
let pipeSpeed = 2;
let level = 1;
let shieldActive = false;
let slowMotionActive = false;
const gap = 150;

// 🕹 Jump function (Works on keyboard & touch)
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

// 🎯 Create Pipes with Upper & Lower Obstacles
function createPipes() {
    if (isGameOver) return;

    let pipeHeight = Math.random() * 150 + 100;
    let upperPipeHeight = 500 - pipeHeight - gap;

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

        // ❌ Collision Detection (With Shield Support)
        if (pipeX >= 350 && pipeX <= 400) {
            if (birdY < upperPipeHeight || birdY + 40 > 500 - pipeHeight) {
                if (shieldActive) {
                    shieldActive = false;
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
            }
        }
    }, 20);
}

// 🔄 Update Game Loop
function updateGame() {
    if (isGameOver) return;

    birdY += velocity;
    velocity += gravity;

    if (birdY > 460 || birdY < 0) {
        endGame();
    }

    bird.style.top = birdY + "px";
}

// 🚨 End Game Function
function endGame() {
    isGameOver = true;
    alert("Game Over! Score: " + score + "\nLevel: " + level);
    location.reload();
}

// 🛡 Shield Skill Activation
function useShield() {
    if (!shieldActive) {
        shieldActive = true;
        alert("🛡 Shield Activated! You can survive one hit.");
    }
}

// 🐢 Slow Motion Skill Activation
function useSlowMotion() {
    if (!slowMotionActive) {
        slowMotionActive = true;
        alert("🐢 Slow Motion Activated! Pipes will move slower for 5 seconds.");
        setTimeout(() => {
            slowMotionActive = false;
        }, 5000);
    }
}

// ✅ Start Game Loops
setInterval(updateGame, 20);
setInterval(createPipes, 1500);