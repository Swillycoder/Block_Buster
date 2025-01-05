const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
//const backgroundMusic = document.getElementById('music');

canvas.width = 500;
canvas.height = 500;

const bullets = []

class Player {
    constructor() {
        this.pos = {x: 250, y: 450}
        this.vel = {x: 0, y: 0}

        this.width = 50
        this.height = 40
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.pos.x - this.width / 2, this.pos.y + this.height);
        ctx.lineTo(this.pos.x + this.width / 2, this.pos.y + this.height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(this.pos.x + 6, this.pos.y + 10);
        ctx.lineTo(this.pos.x - this.width / 4, this.pos.y + this.height);
        ctx.lineTo(this.pos.x, this.pos.y + this.height);
        ctx.lineTo(this.pos.x + 12, this.pos.y + 20);
        ctx.closePath();
        ctx.fill();
    }
    shoot() {
        bullets.push(new Bullet(this.pos.x-2.5, this.pos.y, { x: 0, y: -5 }));
    }
    update() {
        this.pos.x += this.vel.x
        this.draw()
    }
}

class Enemy {
    constructor(x, y, color, hitpoints) {
        this.x = x,
        this.y = y

        this.vel = {
            x: 0,
            y: 0
        }
        this.width = 25
        this.height = 25
        this.color = color
        this.hitpoints = hitpoints
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    update() {
        this.draw()
    }
}

class Bullet {
    constructor(x, y, velocity) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.width = 5;
        this.height = 10;
    }
    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
        this.y += this.velocity.y;
        this.draw(ctx);
    }
    isOffScreen(canvasHeight) {
        return this.y < 0 || this.y > canvasHeight;
    }
}

const keys = {
    a: {pressed: false},
    d: {pressed: false},
    space: {pressed: false},
    arrowl: {pressed: false},
    arrowr: {pressed: false},
    space: {pressed: false},
    enter: {pressed: false},
    p: {pressed: false},
}

const player = new Player()
const enemySpacing = 15;
let enemyVerticalSpacing = 15;
const rows = 3;
const enemiesPerRow = 10;

let score = 0;
let wave = 1;
let enemySpeed = 30;
let redEnemies = [];
let greenEnemies = [];
let blueEnemies = [];

function generateEnemies(colorArray, color, rowIndex, hitpoints) {
    let offsetX = 50;
    for (let i = 0; i < enemiesPerRow; i++) {
        let x = offsetX + i * (25 + enemySpacing);
        let y = rowIndex * (25 + enemyVerticalSpacing) + 25;
        colorArray.push(new Enemy(x, y, color, hitpoints));
    }
}

generateEnemies(redEnemies, 'red', 0, 5);
generateEnemies(greenEnemies, 'green', 1, 10);
generateEnemies(blueEnemies, 'blue', 2, 15);

function checkForNextWave() {
    if (redEnemies.length === 0 && greenEnemies.length === 0 && blueEnemies.length === 0) {
        wave++;
        direction = 'right'
        generateEnemies(redEnemies, 'red', 0, 5);
        generateEnemies(greenEnemies, 'green', 1, 10);
        generateEnemies(blueEnemies, 'blue', 2, 15);
    }}

function bulletCollision() {
    bullets.forEach((bullet, bulletIndex) => {
        redEnemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {

                enemy.hitpoints -= 1;
                enemy.height -= 4.5
                bullets.splice(bulletIndex, 1);

                if (enemy.hitpoints <= 0) {
                    redEnemies.splice(enemyIndex, 1);
                    score += 10
                }
            }
        });

        greenEnemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                enemy.hitpoints -= 1;
                enemy.height -= 2.25
                bullets.splice(bulletIndex, 1);

                if (enemy.hitpoints <= 0) {
                    greenEnemies.splice(enemyIndex, 1);
                    score += 20
                }
            }
        });

        blueEnemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                enemy.hitpoints -= 1;
                enemy.height -= 1.2
                bullets.splice(bulletIndex, 1);

                if (enemy.hitpoints <= 0) {
                    blueEnemies.splice(enemyIndex, 1);
                    score += 30
                }
            }
        });
    });
}

let direction = 'right';
const stepSize = 5;

function moveEnemies() {
    let moveDown = false;

    if (direction === 'right') {
        redEnemies.forEach(enemy => enemy.x += stepSize);
        greenEnemies.forEach(enemy => enemy.x += stepSize);
        blueEnemies.forEach(enemy => enemy.x += stepSize);

        const rightmostEnemy = Math.max(
            ...redEnemies.map(enemy => enemy.x + enemy.width),
            ...greenEnemies.map(enemy => enemy.x + enemy.width),
            ...blueEnemies.map(enemy => enemy.x + enemy.width)
        );
        if (rightmostEnemy >= canvas.width) {
            direction = 'down-right';
            moveDown = true;
        }
    } else if (direction === 'left') {
        redEnemies.forEach(enemy => enemy.x -= stepSize);
        greenEnemies.forEach(enemy => enemy.x -= stepSize);
        blueEnemies.forEach(enemy => enemy.x -= stepSize);

        const leftmostEnemy = Math.min(
            ...redEnemies.map(enemy => enemy.x),
            ...greenEnemies.map(enemy => enemy.x),
            ...blueEnemies.map(enemy => enemy.x)
        );
        if (leftmostEnemy <= 0) {
            direction = 'down-left';
            moveDown = true;
        }
    }

    if (direction === 'down-right' || direction === 'down-left') {
        redEnemies.forEach(enemy => enemy.y += stepSize * wave);
        greenEnemies.forEach(enemy => enemy.y += stepSize * wave);
        blueEnemies.forEach(enemy => enemy.y += stepSize * wave);
        direction = direction === 'down-right' ? 'left' : 'right';
    }
}

function gameStart() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'center';
    ctx.font = '50px Orbitron';
    ctx.fillStyle = 'lime';
    ctx.fillText('BLOCK BUSTER', canvas.width / 2, 100);
    ctx.font = '25px Orbitron';
    ctx.fillStyle = 'white';
    ctx.fillText('Controls: Arrow Keys to move', canvas.width / 2, 150);
    ctx.fillText('Space to shoot', canvas.width / 2, 200);
    ctx.fillText('Press Enter to Start', canvas.width / 2, 250);
}

document.fonts.ready.then(() => {
    gameStart();
});

function gameOverMessage () {
    ctx.fillStyle = 'white';
    ctx.fillRect(50, 200, 400, 75);
    ctx.strokeStyle = 'blue';
    ctx.strokeRect(50, 200, 400, 75);
    ctx.font = '50px Orbitron';
    ctx.fillStyle = 'red';
    ctx.fillText('GAME OVER', 70, 245);
    ctx.font = '25px Orbitron';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 180, 270);
    ctx.fillStyle = 'lime'
    ctx.fillText('Hit P to play again', 130, 320);
}

function gameOverConditions() {
    for (let red of redEnemies) {
        if (red.y >= 425) {
            console.log('Game Over');
            gameOverMessage();
            gameOver = true
            return;
        }
    }

    for (let green of greenEnemies) {
        if (green.y >= 425) {
            console.log('Game Over');
            gameOverMessage();
            gameOver = true
            return;
        }
    }

    for (let blue of blueEnemies) {
        if (blue.y >= 425) {
            console.log('Game Over');
            gameOverMessage();
            gameOver = true
            return;
        }
    }
}

let enemyMoveTime = 500 * wave
setInterval(moveEnemies, enemyMoveTime);
let enemyMoveCounter = 0;

function text() {
    ctx.textAlign = 'left';
    ctx.font = '50px Orbitron';
    ctx.fillStyle = 'lime';
    ctx.fillText('BLOCK BUSTER', 20, 490);
}

function waveText() {
    ctx.font = '20px Orbitron';
    ctx.fillStyle = 'white';
    ctx.fillText(`Wave: ${wave}`, 20, 20);
}

function scoreText() {
    ctx.font = '20px Orbitron';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 340, 20);
}

let gameOver = true

function animate() {
    if (!gameOver)
        requestAnimationFrame(animate)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        text();
        waveText();
        scoreText();
        player.update()

        bullets.forEach((bullet, index) => {
            bullet.update();
            if (bullet.isOffScreen(canvas.height)) {
                bullets.splice(index, 1);
            }
        });

        redEnemies.forEach(enemy => enemy.update());
        greenEnemies.forEach(enemy => enemy.update());
        blueEnemies.forEach(enemy => enemy.update());

        bulletCollision();
        checkForNextWave();
        gameOverConditions();

        enemyMoveCounter++;
        if (enemyMoveCounter * wave % enemySpeed === 0) {
            moveEnemies();
        }

        if (keys.arrowl.pressed && 
            player.pos.x - player.width/2 >= 0 ) {
            player.vel.x = -5
        } else if (keys.arrowr.pressed && 
            player.pos.x + 
            player.width/2 <= canvas.width) {
            player.vel.x = 5
        } else {
            player.vel.x = 0
        }
}

gameStart();

addEventListener('keydown', ({key}) => {
    switch (key) {
        case 'a':
            keys.a.pressed = true
            break
        case 'ArrowLeft':
            keys.arrowl.pressed = true
            break
        case 'd':
            keys.d.pressed = true
            break
        case 'ArrowRight':
            keys.arrowr.pressed = true
            break
        case ' ':
            keys.space.pressed = true
            player.shoot()
            break
        case 'Enter':
            keys.enter.pressed = true
           // const backgroundMusic = new Audio('audio/techno.mp3');
            //backgroundMusic.loop = true;
            //backgroundMusic.play();
            if (gameOver) {
                gameOver = false;
                animate();
            }
            break
            case 'p':
                keys.p.pressed = true
                location.reload();
                
                break
    }
})

addEventListener('keyup', ({key}) => {
    switch (key) {
        case 'a':
            keys.a.pressed = false
            break
        case 'ArrowLeft':
            keys.arrowl.pressed = false
            break

        case 'd':
            keys.d.pressed = false
            break
        case 'ArrowRight':
            keys.arrowr.pressed = false
            break
        
        case ' ':
            keys.space.pressed = false
            break
        case 'Enter':
            keys.enter.pressed = false
            break
        case 'p':
            keys.p.pressed = false
            break
    }
})
