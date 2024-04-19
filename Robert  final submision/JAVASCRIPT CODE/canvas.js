const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 800;
canvas.style.backgroundColor = "transparent";
canvas.style.backgroundSize = "cover";
canvas.style.backgroundRepeat = "no-repeat";
canvas.style.backgroundPosition = "center";
canvas.style.backgroundAttachment = "fixed";

const keys = {};


//The car is the UFO // 
let score = 0;
let gameOver = false;
let timeFactor = 1;
let baseCarSpeed = 4;
let carSpeed = baseCarSpeed;
let currentLevel = 1;
let levelChanged = false;
const projectileWidth = 10;
let levelUpInterval;

const carImage = new Image();
carImage.src = '../IMAGES/UFO_sprite_001.webp';



const coinImage = new Image();
coinImage.src = '../IMAGES/coinsprite1.jpg.png';

const divineInterventionImage = new Image();
divineInterventionImage.src = '../IMAGES/divine2.png';

const ZhonyasHourGlassimage = new Image();
ZhonyasHourGlassimage.src = '../IMAGES/zhonyashourglass.png';

const healthPackImage = new Image();
healthPackImage.src = '../IMAGES/heartpack.png';

let divineProtectionActive = false;
const divineProtectionDuration = 5000;

//this is the function that handles the projectiles//
function handleProjectiles() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        projectiles[i].move();
        projectiles[i].draw();

        // Check for collision with obstacles
        for (let j = 0; j < obstacles.length; j++) {
            if (isColliding(projectiles[i], obstacles[j])) {
                obstacles[j].hit();
                projectiles.splice(i, 1);
                break;
            }
        }

        // Remove off-screen projectiles
        if (projectiles[i] && projectiles[i].y < 0) {
            projectiles.splice(i, 1);
        }
    }
}

function isColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y
    );
}

//This is the class for the projectiles//
class Projectile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 17; 
        this.height = 20;  
        this.speed = 3;
        this.pulse = 0;
    }

    move() {
        this.y -= this.speed;
    }

    //This is the function that draws the projectiles//
    draw() {
        this.pulse = (this.pulse + 1) % 30;
        const pulseEffect = Math.sin(this.pulse / 30 * Math.PI) * 0.2 + 0.8;

        ctx.save();
        ctx.fillStyle = `rgba(0, 255, 0, ${pulseEffect})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}

let currentEvent = '';



function healthRefreshEvent() {
    currentEvent = 'healthRefresh';
    car.health += 30; // Add 30 health to the car//
    drawHealth(car);
}

function moreMoneyEvent() {
    currentEvent = 'moreMoney';
    score += 1000; // Add 1000 to the score//
    drawScore();

}

function levelup() {
    currentEvent = '';
    currentLevel++;
    score += 340; // Add score for each level reached//
    obstacles.forEach(obstacle => obstacle.speedFactor += 0.1); 
    levelChanged = true;
    console.log("Level up! Current level: " + currentLevel);
    setTimeout(() => levelChanged = false, 2000);
    console.log("score: " + score);

    // 30% chance to trigger Health Refresh Event//
    if (Math.random() < 0.3) {
        healthRefreshEvent();
    } else if (Math.random() < 0.4) {
        moreMoneyEvent();
    }
}


let zhonyasHourGlassActive = false;
const ZhonyasHourGlassDuration = 5000;
//This is the class for the Zhonyas Hour Glass Power Up//
class ZhonyasHourGlass {
    constructor() {
        this.width = 60;
        this.height = 60;
        this.reset();
        this.startSpawning();
    }
    //This is the function that starts the spawning of the Zhonyas Hour Glass Power Up//
    startSpawning() {
        this.spawnInterval = setInterval(() => {
            if (Math.random() < 0.09) {
                this.reset();
            }
        }, 1000);
    }
    //This is the function that resets the Zhonyas Hour Glass Power Up//
    reset() {
        this.x = Math.random() * (canvas.width - this.width);
        this.y = 0 - this.height;
        this.isActive = true;

    }
    //This is the function that moves the Zhonyas Hour Glass Power Up//
    move() {
        if (this.isActive) {
            this.y += carSpeed * 0.4;
            if (this.y >= canvas.height) {
                this.isActive = false;
            }
        }
    }
    //This is the function that checks for collision with the Zhonyas Hour Glass Power Up//
    checkCollision(car) {
        if (this.isActive && car.isCollidingWith(this)) {
            console.log("Zhonyas Hour Glass Activated!");
            zhonyasHourGlassActive = true;
            carSpeed = baseCarSpeed / 2;
            setTimeout(() => {
                zhonyasHourGlassActive = false;
                carSpeed = baseCarSpeed;
                console.log("Zhonyas Hour Glass Ended!");
            }, ZhonyasHourGlassDuration);
            this.isActive = false;
        }
    }
    stopSpawning() {
        clearInterval(this.spawnInterval);
    }

    draw() {
        if (this.isActive) {
            ctx.drawImage(ZhonyasHourGlassimage, this.x, this.y, this.width, this.height);
        }
    }
}


// This is the class for the Health Pack Power Up//

class HealthPack {
    constructor() {
        this.width = 60;
        this.height = 60;
        this.reset();
        this.startSpawning();
    }
    // This is the function that starts the spawning of the Health Pack Power Up//
    startSpawning() {
        this.spawnInterval = setInterval(() => {
            if (Math.random() < 0.11) {
                this.reset();
            }
        }, 1000);

    }
    reset() {
        this.x = Math.random() * (canvas.width - this.width);
        this.y = 0 - this.height;
        this.isActive = true;
    }
    move() {
        if (this.isActive) {
            this.y += carSpeed * 0.5;
            if (this.y >= canvas.height) {
                this.isActive = false;
            }
        }
    }
    checkCollision(car) {
        if (this.isActive && car.isCollidingWith(this)) {
            console.log("Health Pack Collected!");
            car.health += 20;
            this.isActive = false;
        }
    }
    stopSpawning() {
        clearInterval(this.spawnInterval);
    }

    draw() {
        if (this.isActive) {
            ctx.drawImage(healthPackImage, this.x, this.y, this.width, this.height);
        }
    }

}

// This is the class for the Divine Intervention Power Up//
class DivineIntervention {
    constructor() {
        this.width = 60;
        this.height = 60;
        this.reset();
        this.startSpawning();
    }

    startSpawning() {
        this.spawnInterval = setInterval(() => {
            if (Math.random() < 0.09) {
                this.reset();
            }
        }, 1000);
    }

    reset() {
        this.x = Math.random() * (canvas.width - this.width);
        this.y = 0 - this.height;
        this.isActive = true;
    }

    move() {
        if (this.isActive) {
            this.y += carSpeed * 0.5;
            if (this.y >= canvas.height) {
                this.isActive = false;
            }
        }
    }
    //This is the function that checks for collision with the Divine Intervention Power Up//
    checkCollision(car) {
        if (this.isActive && car.isCollidingWith(this)) {
            console.log("Divine Protection Activated!");
            divineProtectionActive = true;
            setTimeout(() => {
                divineProtectionActive = false;
                console.log("Divine Protection Ended!");
            }, divineProtectionDuration);
            this.isActive = false;
        }
    }
    stopSpawning() {
        clearInterval(this.spawnInterval);
    }
    draw() {
        if (this.isActive) {
            ctx.drawImage(divineInterventionImage, this.x, this.y, this.width, this.height);
        }
    }
}


// This is the class for the coins//
class Coin {
    constructor() {
        this.width = 60;
        this.height = 60;
        this.reset();
        this.startDropping();
    }

    startDropping() {
        this.dropInterval = setInterval(() => {
            if (Math.random() < 0.05) {
                this.reset();
            }
        }, 100);
    }

    reset() {
        this.x = Math.random() * (canvas.width - this.width);
        this.y = 0 - this.height;
        this.isActive = true;
    }

    move() {
        if (this.isActive) {
            this.y += carSpeed * 0.8;
            if (this.y >= canvas.height) {
                this.isActive = false;
            }
        }
    }

    //This is the function that checks for collision with the coins//
    checkCollision(car) {
        if (this.isActive && car.isCollidingWith(this)) {
            console.log("Coin collected!");
            score += 200;
            this.isActive = false;
        }
    }
    stopDropping() {
        clearInterval(this.dropInterval);
    }
    draw() {
        if (this.isActive) {
            ctx.drawImage(coinImage, this.x, this.y, this.width, this.height);
        }
    }
}

// This is the function that handles the shooting of the projectiles//
let shootProjectile = false;
document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !keys[event.code]) {
        keys[event.code] = true;
        shootProjectile = true;  // Set flag for shooting
    } else {
        keys[event.code] = true;
    }
});

document.addEventListener("keyup", (event) => {
    keys[event.code] = false;
});



function handleKeyDown(event) {
    keys[event.key] = true;
}

function handleKeyUp(event) {
    keys[event.key] = false;
}

// Set up the event listeners once when the script loads
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);


// This is the class for the ufo//
class Car {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height - 150;
        this.width = 90;
        this.height = 90;
        this.health = 100;
        this.hitboxPaddingX = 15;
        this.hitboxPaddingY = 10;
        this.scoreInterval = setInterval(this.incrementScore.bind(this), 1000);
    }


    incrementScore() {
        score += 23;
    }

    //This is the function that moves the ufo//
    move() {

        if (keys["ArrowLeft"] && this.x > 0) {
            this.x -= carSpeed;
        }
        if (keys["ArrowRight"] && this.x < canvas.width - this.width) {
            this.x += carSpeed;
        }
        if (keys["ArrowUp"] && this.y > 0) {
            this.y -= carSpeed;
        }
        if (keys["ArrowDown"] && this.y < canvas.height - this.height) {
            this.y += carSpeed;
        }
    }

    deductHealth(amount) {
        if (!divineProtectionActive) {
            this.health -= amount;
            if (this.health <= 0) {
                this.health = 0;
                endGame();
            }
        }
    }

    isCollidingWith(obstacle) {
        return (
            obstacle.x < this.x + this.width - this.hitboxPaddingX &&
            obstacle.x + obstacle.width > this.x + this.hitboxPaddingX &&
            obstacle.y < this.y + this.height - this.hitboxPaddingY &&
            obstacle.y + obstacle.height > this.y + this.hitboxPaddingY
        );
    }

    draw() {
        ctx.drawImage(carImage, this.x, this.y, this.width, this.height);
    }
//This is the function that draws the shield//
    drawShield() {
        if (divineProtectionActive) {
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, Math.max(this.width, this.height) / 2 + 10, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(0, 191, 255, 0.4)';
            ctx.fill();
            ctx.lineWidth = 5;
            ctx.strokeStyle = '#00BFFF';
            ctx.stroke();
        }
        if (zhonyasHourGlassActive) {
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, Math.max(this.width, this.height) / 2 + 10, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(0, 191, 255, 0.4)';
            ctx.fill();
            ctx.lineWidth = 5;
            ctx.strokeStyle = '#85754e';
            ctx.stroke();
        }
    }
}
// This is the class for the obstacles//
class Obstacle {
    constructor(speedFactor = 1, imageSrc = '../IMAGES/aster.png') {
        this.width = 100;
        this.height = 100;
        this.speedFactor = speedFactor;
        this.hitCount = 0;
        this.image = new Image();
        this.image.src = imageSrc;
        this.reset();
    }
    //This is the function that resets the obstacles//
    reset() {
        this.x = Math.random() * (canvas.width - this.width);
        this.y = 0 - this.height;
    }

    //This is the function that moves the obstacles//
    move() {
        this.y += carSpeed * this.speedFactor;
        if (this.y >= canvas.height) {
            this.reset();
        }
    }


    //This is the function that checks for collision with the ufo//
    checkCollision(car) {
        if (car.isCollidingWith(this)) {
            console.log("Collision!");
            car.deductHealth(10);
            this.reset();
        }
    }

    //This is the function that checks for collision with the projectile//
    hit() {
        this.hitCount++;
        if (this.hitCount >= 2) {
            this.reset();
        }
    }
    //this is the function that draws the obstacles//
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}


const car = new Car();
const obstacles = [
    new Obstacle(0.4, '../IMAGES/aster2.png'),
    new Obstacle(0.4, '../IMAGES/aster2.png'),
    new Obstacle(0.5, '../IMAGES/aster2.png'),
    new Obstacle(0.3, '../IMAGES/aster2.png'),
    new Obstacle(0.1),
    new Obstacle(0.3),
    new Obstacle(0.1),
    new Obstacle(0.1),
    new Obstacle(0.2),
];
const coin = new Coin();
const divineIntervention = new DivineIntervention();
const ZhonyasHourGlassInstance = new ZhonyasHourGlass();
const healthPack = new HealthPack();

//This is the function that handles the game loop//
function gameLoop() {
    if (gameStarted && !gameOver) {
        clearCanvas();

        coin.move();
        coin.checkCollision(car);
        handleProjectiles();

        if (shootProjectile) {
            const projectileX = car.x + car.width / 2 - projectileWidth / 2;
            projectiles.push(new Projectile(projectileX, car.y));
            shootProjectile = false; 
        }

        coin.draw();
        divineIntervention.move();
        divineIntervention.checkCollision(car);
        divineIntervention.draw();

        ZhonyasHourGlassInstance.move();
        ZhonyasHourGlassInstance.checkCollision(car);
        ZhonyasHourGlassInstance.draw();

        healthPack.move();
        healthPack.checkCollision(car);
        healthPack.draw();

        drawHealth(car);

        obstacles.forEach(obstacle => {
            obstacle.move();
            obstacle.checkCollision(car);
            obstacle.draw();
        });

        car.move();
        car.drawShield();
        drawHealth(car);
        drawScore();
        car.draw();

        if (levelChanged) {
            displayLevelChange();
        }

        requestAnimationFrame(gameLoop);
    } else if (!gameStarted) {
        showMenu();
        requestAnimationFrame(gameLoop);
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//This is the function that draws the health bar//
function drawHealth(car) {
    // Health bar properties
    const barWidth = 200;
    const barHeight = 20;
    const x = 10;
    const y = 20;
    const maxHealth = 100;
    const healthPercentage = car.health / maxHealth;

    // Draw health bar background
    ctx.fillStyle = '#111'; // Dark background for the health bar
    ctx.fillRect(x, y, barWidth, barHeight);

    // Gradient for the health bar foreground
    let gradient = ctx.createLinearGradient(x, y, x + barWidth * healthPercentage, y);
    gradient.addColorStop(0, '#00ff00');
    gradient.addColorStop(0.5, '#ffff00');
    gradient.addColorStop(1, '#ff0000');


    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth * healthPercentage, barHeight);

    // Glow effect to the health bar
    ctx.shadowBlur = 20;
    ctx.shadowColor = car.health > 20 ? 'limegreen' : 'red';
    ctx.fillRect(x, y, barWidth * healthPercentage, barHeight);

    // Reset shadow after drawing
    ctx.shadowBlur = 0;

    // Draw health text
    ctx.fillStyle = 'white';
    ctx.font = '16px Orbitron';
    ctx.fillText(`Health: ${car.health}`, x, y - 5);
}


//This is the function that draws the score//
function drawScore() {
    const scoreX = 10;
    const scoreY = canvas.height - 20;

    ctx.fillStyle = "white";
    ctx.font = "30px Orbitron";
    ctx.fillText("Score: " + score, scoreX, scoreY);
}

//This is the function that ends the game//
function endGame() {
    gameOver = true;
    currentLevel = 0;
    carSpeed = baseCarSpeed;
    clearInterval(levelUpInterval);
    clearInterval(car.scoreInterval);
    ZhonyasHourGlassInstance.stopSpawning();
    healthPack.stopSpawning();
    divineIntervention.stopSpawning();
    coin.stopDropping();
    displayGameOverMenu();

    // Get the current user, default to 'Guest' if no user is logged in
    const currentUser = localStorage.getItem('currentUser') || 'Guest';

    // If it's a guest, create a temporary user object. If it's a registered user, get their data from localStorage
    const userData = (currentUser !== 'Guest') ? JSON.parse(localStorage.getItem(currentUser)) : { score: 0 };

    // Update the score if the current score is greater than the stored score
    if (score > userData.score) {
        userData.score = score;
        localStorage.setItem(currentUser, JSON.stringify(userData));
    }

    // Update the leaderboard with the new score
    updateLeaderboard(currentUser, score);
}

// This is the function that displays the level change//
function displayLevelChange() {
    ctx.fillStyle = 'yellow';
    ctx.font = '40px Orbitron';
    ctx.fillText('Level ' + currentLevel, canvas.width / 2 - 60, canvas.height / 2);
    if (currentEvent) {
        ctx.fillStyle = 'lightblue';
        ctx.font = '30px Orbitron';
        ctx.fillText(currentEvent, canvas.width / 2 - 60, canvas.height / 2 + 40);
    }
}


//This is the function that updates the leaderboard//
function updateLeaderboard(user, newScore) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    let userExists = false;

    for (let entry of leaderboard) {
        if (entry.user === user) {
            userExists = true;
            if (newScore > entry.score) {
                entry.score = newScore;
            }
            break;
        }
    }

    if (!userExists) {
        leaderboard.push({ user: user, score: newScore });
    }

    // Sort the leaderboard
    leaderboard.sort((a, b) => b.score - a.score);

    // Save it back to localStorage
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}


//This is the function that displays the game over menu//
function displayGameOverMenu() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '50px Orbitron';
    ctx.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2 - 50);
    ctx.font = '30px Orbitron';
    ctx.fillText('Score: ' + score, canvas.width / 2 - 50, canvas.height / 2);
    ctx.font = '25px Orbitron';
    ctx.fillText('Click to play again', canvas.width / 2 - 125, canvas.height / 2 + 50);
    canvas.onclick = restartGame;
}

function restartGame() {
    // Refresh the page
    window.location.reload();
}


let gameStarted = false;

//This is the function that shows the menu//
function showMenu() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '50px Orbitron';
    ctx.fillText('Racer X Racer  ', canvas.width / 2 - 150, canvas.height / 2 - 50);
    ctx.font = '30px Orbitron';
    ctx.fillText('Click to start', canvas.width / 2 - 100, canvas.height / 2);

}
canvas.onclick = function () {
    if (!gameStarted) {
        startGame();
    }

};


//This is the function that starts the game//
function startGame() {
    gameStarted = true;
    currentLevel = 1;
    carSpeed = baseCarSpeed;
    score = 0;
    levelUpInterval = setInterval(levelup, 10000);
    gameLoop();

}



gameLoop();

let projectiles = [];

//This is the function that displays the current user//
function displayCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const userDisplayElement = document.getElementById('userDisplay');
        if (userDisplayElement) {
            userDisplayElement.innerText = `Current user : ${currentUser}`;
        }
    }
}

window.onload = function () {
    displayCurrentUser();
}