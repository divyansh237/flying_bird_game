const car = document.getElementById("car");
const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const bgMusic = document.getElementById("bg-music");

let carY = 200;
let velocity = 0;
let gravity = 0.5;
let isGameOver = false;
let score = 0;
let pipeSpeed = 2;
let level = 1;
let shieldActive = false;
let slowMotionActive = false;
let pipeInterval = 1500; // ⏳ Pipe generation interval
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

        // ❌ Collision Detection (With Shield Support)
        if (pipeX >= 350 && pipeX <= 400) {
            if (birdY < upperPipeHeight || birdY + 40 > 500 - pipeHeight) {
                if (shieldActive) {
                    shieldActive = false;
                    removeGlow();
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
                
                if (pipeInterval > 800) { // ⏳ Pipe generate speed bhi increase hogi
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

// 🚨 End Game Function
function endGame() {
    isGameOver = true;
    alert("Game Over! Score: " + score + "\nLevel: " + level);
    location.reload();
}

// 🛡 Shield Skill Activation (🔵 Blue Glow)
function useShield() {
    if (!shieldActive) {
        shieldActive = true;
        car.classList.add("blue-glow"); // 🔵 Blue Glow Effect
        alert("🛡 Shield Activated! You can survive one hit.");

        setTimeout(() => {
            shieldActive = false;
            removeGlow(); // ❌ Glow Remove
        }, 5000);
    }
}

// 🐢 Slow Motion Skill Activation (🟢 Green Glow)
function useSlowMotion() {
    if (!slowMotionActive) {
        slowMotionActive = true;
        car.classList.add("green-glow"); // 🟢 Green Glow Effect
        alert("🐢 Slow Motion Activated! Pipes will move slower for 5 seconds.");

        setTimeout(() => {
            slowMotionActive = false;
            removeGlow(); // ❌ Glow Remove
        }, 5000);
    }
}

// ❌ Remove Glow After Skill Ends
function removeGlow() {
    car.classList.remove("blue-glow");
    car.classList.remove("green-glow");
}

// 🔄 Dynamic Pipe Generation (Restart on Interval Change)
let pipeGeneration;
function restartPipeGeneration() {
    clearInterval(pipeGeneration);
    pipeGeneration = setInterval(createPipes, pipeInterval);
}


function startMusic() {
    bgMusic.volume = 0.5;  // 🔊 Volume Set (0.0 to 1.0)
    bgMusic.play();
}

// 🛑 Game Over Par Music Band Ho Jaye
function endGame() {
    isGameOver = true;
    bgMusic.pause();
    alert("Game Over! Score: " + score + "\nLevel: " + level);
    location.reload();
}

// 🎮 First Jump Par Music Start Ho (Autoplay Issue Fix)
document.addEventListener("click", startMusic, { once: true });
document.addEventListener("touchstart", startMusic, { once: true });

// ✅ Start Game Loops
setInterval(updateGame, 20);
restartPipeGeneration();