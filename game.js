if (typeof PIXI === 'undefined') {
    alert('ГРЕШКА: Pixi.js не е зареден! Провери интернет връзката.');
    throw new Error('PIXI is not defined');
}

console.log('Pixi.js версия:', PIXI.VERSION);


const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x2d2d2d
});


const gameContainer = document.getElementById('game-container');
if (!gameContainer) {
    alert('ГРЕШКА: Не намирам game-container елемента!');
    throw new Error('game-container not found');
}
gameContainer.appendChild(app.view);

console.log('Canvas добавен успешно!');


let player;
let obstacles = [];
let gameSpeed = 5;
let gravity = 0.5;
let jumpPower = -12;
let isJumping = false;
let gameOver = false;
let gameStarted = false;
let score = 0;


const ground = new PIXI.Graphics();
ground.beginFill(0x000000);
ground.drawRect(0, 550, 800, 50);
ground.endFill();
app.stage.addChild(ground);


function createPlayer() {
    player = new PIXI.Graphics();


    player.beginFill(0xFFFFFF);
    player.drawCircle(20, 8, 8);
    player.endFill();

    player.lineStyle(3, 0xFFFFFF);
    player.moveTo(20, 16);
    player.lineTo(20, 28);


    player.moveTo(20, 20);
    player.lineTo(14, 24);
    player.moveTo(20, 20);
    player.lineTo(26, 24);


    player.moveTo(20, 28);
    player.lineTo(14, 36);
    player.moveTo(20, 28);
    player.lineTo(26, 36);

    player.x = 100;
    player.y = 510;
    player.vy = 0; // Вертикална скорост
    app.stage.addChild(player);
}

function createObstacle() {
    const obstacle = new PIXI.Graphics();
    obstacle.beginFill(0x808080); // Сив цвят


    const height = Math.random() * 40 + 30;
    obstacle.drawRect(0, 0, 30, height);
    obstacle.endFill();

    obstacle.x = 800;
    obstacle.y = 550 - height;

    app.stage.addChild(obstacle);
    obstacles.push(obstacle);
}


function checkCollision(obj1, obj2) {
    const bounds1 = obj1.getBounds();
    const bounds2 = obj2.getBounds();

    return bounds1.x < bounds2.x + bounds2.width &&
        bounds1.x + bounds1.width > bounds2.x &&
        bounds1.y < bounds2.y + bounds2.height &&
        bounds1.y + bounds1.height > bounds2.y;
}


const scoreText = new PIXI.Text('Score: 0', {
    fontFamily: 'Arial',
    fontSize: 22,
    fill: 0xFFFFFF,
    stroke: 0x000000,
    strokeThickness: 4
});
scoreText.x = 10;
scoreText.y = 10;
app.stage.addChild(scoreText);


const startText = new PIXI.Text('Press SPACE to start the game', {
    fontFamily: 'Arial',
    fontSize: 28,
    fill: 0xFFFFFF,
    stroke: 0x000000,
    strokeThickness: 4,
    align: 'center'
});
startText.anchor.set(0.5);
startText.x = 400;
startText.y = 300;
app.stage.addChild(startText);


const gameOverText = new PIXI.Text('GAME OVER\nPress SPACE to restart', {
    fontFamily: 'Arial',
    fontSize: 32,
    fill: 0xFFFFFF,
    stroke: 0x000000,
    strokeThickness: 4,
    align: 'center'
});
gameOverText.anchor.set(0.5);
gameOverText.x = 400;
gameOverText.y = 250;
gameOverText.visible = false;
app.stage.addChild(gameOverText);


window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();

        if (!gameStarted) {
            startText.visible = false;
            gameStarted = true;
            console.log('🎮 Играта започна!');
        } else if (gameOver) {

            restartGame();
        } else {

            if (!isJumping) {
                player.vy = jumpPower;
                isJumping = true;
            }
        }
    }
});


function restartGame() {
    gameOver = false;
    score = 0;
    gameSpeed = 5;
    player.y = 510;
    player.vy = 0;
    isJumping = false;
    gameOverText.visible = false;

    obstacles.forEach(obstacle => {
        app.stage.removeChild(obstacle);
    });
    obstacles = [];
}
/
let frameCount = 0;
app.ticker.add(() => {

    if (!gameStarted || gameOver) return;

    frameCount++;


    if (frameCount % 500 === 0) {
        gameSpeed += 0.5;
    }

    player.vy += gravity;
    player.y += player.vy;


    if (player.y >= 510) {
        player.y = 510;
        player.vy = 0;
        isJumping = false;
    }

    if (frameCount % 100 === 0) {
        createObstacle();
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.x -= gameSpeed;


        if (checkCollision(player, obstacle)) {
            gameOver = true;
            gameOverText.visible = true;
        }


        if (!obstacle.passed && obstacle.x + obstacle.width < player.x) {
            obstacle.passed = true;
            score++;
            scoreText.text = 'Score: ' + score;
            console.log(' Преминахте препятствие! Точки: ' + score);
        }


        if (obstacle.x + obstacle.width < 0) {
            app.stage.removeChild(obstacle);
            obstacles.splice(i, 1);
        }
    }
});


createPlayer();

console.log(' Всичко е заредено! Натисни SPACE за да започнеш.');
