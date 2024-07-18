document.addEventListener("DOMContentLoaded", () => {
    showWindow('titleWindow');
    initGame();
});

function showWindow(id) {
    const windows = document.querySelectorAll('.window');
    windows.forEach(win => win.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    if (id === 'gameOverWindow') {
        document.getElementById('gameOverScore').innerText = `Score: ${game.score}`;
    } else if (id === 'gameClearWindow') {
        document.getElementById('gameClearScore').innerText = `Score: ${game.score}`;
    }
}


let game = {
    player: {
        x: 50,
        y: 300,
        width: 50,
        height: 50,
        speed: 2.5,
        jumpPower: 13,
        velocityY: 0,
        gravity: 0.5,
        onGround: false,
        canShoot: false
    },
    keys: {},
    bullets: [],
    coins: [
        {x: 150, y: 300, width: 30, height: 30},
        {x: 200, y: 300, width: 30, height: 30},
        {x: 300, y: 300, width: 30, height: 30},
        {x: 400, y: 250, width: 30, height: 30},
        {x: 500, y: 250, width: 30, height: 30},
        {x: 600, y: 300, width: 30, height: 30},
        {x: 700, y: 300, width: 30, height: 30},
        {x: 800, y: 300, width: 30, height: 30},
        {x: 900, y: 200, width: 30, height: 30},
        {x: 1000, y: 250, width: 30, height: 30},
        {x: 1100, y: 150, width: 30, height: 30},
        {x: 1200, y: 250, width: 30, height: 30},
        {x: 1300, y: 200, width: 30, height: 30},
        {x: 1400, y: 200, width: 30, height: 30},
        {x: 1500, y: 150, width: 30, height: 30},
        {x: 1600, y: 200, width: 30, height: 30},
        {x: 1700, y: 200, width: 30, height: 30},
        {x: 1800, y: 200, width: 30, height: 30},
        {x: 1900, y: 250, width: 30, height: 30},
        {x: 2000, y: 350, width: 30, height: 30},
        {x: 2100, y: 300, width: 30, height: 30},
        {x: 2200, y: 350, width: 30, height: 30},
        {x: 2300, y: 300, width: 30, height: 30},
        {x: 2400, y: 250, width: 30, height: 30},
        {x: 2500, y: 350, width: 30, height: 30},
        {x: 2650, y: 250, width: 30, height: 30},
        {x: 2700, y: 300, width: 30, height: 30},
        {x: 2800, y: 300, width: 30, height: 30},
        {x: 2900, y: 250, width: 30, height: 30},
        {x: 3000, y: 300, width: 30, height: 30},
        {x: 3100, y: 300, width: 30, height: 30},
        {x: 3200, y: 300, width: 30, height: 30},
        {x: 3300, y: 250, width: 30, height: 30},
        {x: 3400, y: 300, width: 30, height: 30},
        {x: 3500, y: 250, width: 30, height: 30},
        {x: 3600, y: 250, width: 30, height: 30},
        {x: 3700, y: 200, width: 30, height: 30},
        {x: 3800, y: 150, width: 30, height: 30}
    ],
    enemies: [
        {x: 900, y: 320, width: 40, height: 40, type: 'enemy1'},
        {x: 1150, y: 270, width: 40, height: 40, type: 'enemy2'},
        {x: 1580, y: 225, width: 40, height: 40, type: 'enemy3'},
        {x: 2100, y: 340, width: 40, height: 40, type: 'enemy1'},
        {x: 2500, y: 340, width: 40, height: 40, type: 'enemy2'},
        {x: 2850, y: 320, width: 40, height: 40, type: 'enemy3'},
        {x: 3500, y: 320, width: 40, height: 40, type: 'enemy1'},
        {x: 3800, y: 270, width: 40, height: 40, type: 'enemy2'}
    ],
    ground: [
        {x: 0, y: 380, width: 420, height: 20},
        {x: 450, y: 350, width: 500, height: 20},
        {x: 900, y: 300, width: 400, height: 20},
        {x: 1350, y: 250, width: 400, height: 20},
        {x: 1800, y: 380, width: 800, height: 20},
        {x: 2700, y: 350, width: 850, height: 20},
        {x: 3500, y: 300, width: 900, height: 20}
    ],
    holes: [
        {x: 423, y: 380, width: 1385, height: 20},
        {x: 1600, y: 380, width: 50, height: 20},
        {x: 2620, y: 380, width: 1000, height: 20},
        {x: 3400, y: 380, width: 800, height: 20}
    ],
    powerups: [
        {x: 600, y: 320, width: 30, height: 30},
        {x: 1500, y: 180, width: 30, height: 30},
        {x: 3300, y: 320, width: 30, height: 30}
    ],
    images: {},
    score: 0,
    gameOver: false
};

function loadImages(sources, callback) {
    let loadedImages = 0;
    let numImages = sources.length;

    for (let i = 0; i < numImages; i++) {
        let img = new Image();
        img.src = sources[i].src;
        img.onload = () => {
            if (++loadedImages >= numImages) {
                callback();
            }
        };
        game.images[sources[i].name] = img;
    }
}

function initGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 400;

    resetGame();

    window.addEventListener("keydown", (e) => game.keys[e.key] = true);
    window.addEventListener("keyup", (e) => game.keys[e.key] = false);

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Player controls
        if (game.keys['ArrowRight'] && game.player.x < 3950) game.player.x += game.player.speed;
        if (game.keys['ArrowLeft'] && game.player.x > 50) game.player.x -= game.player.speed;
        if (game.keys[' '] && game.player.onGround) {
            game.player.velocityY = -game.player.jumpPower;
            game.player.onGround = false;
        }

        game.player.velocityY += game.player.gravity;
        game.player.y += game.player.velocityY;

        // Ground collision
        game.player.onGround = false;
        game.ground.forEach(ground => {
            if (checkCollision({x: game.player.x, y: game.player.y + game.player.height, width: game.player.width, height: 1}, ground)) {
                game.player.onGround = true;
                game.player.y = ground.y - game.player.height;
                game.player.velocityY = 0;
            }
        });

        // Prevent the player from falling through the bottom of the canvas
        if (game.player.y + game.player.height > canvas.height) {
            game.player.y = canvas.height - game.player.height;
            game.player.velocityY = 0;
            game.player.onGround = true;
        }

        // Shooting bullets
        if (game.keys['z'] && game.player.canShoot) {
            shootBullet();
        }

        game.bullets.forEach((bullet, index) => {
            bullet.x += bullet.speed;
            if (bullet.x > canvas.width + game.player.x) {
                game.bullets.splice(index, 1);
            }
        });

        // Check bullet collisions with enemies
        game.bullets.forEach((bullet, bulletIndex) => {
            game.enemies.forEach((enemy, enemyIndex) => {
                if (checkCollision(bullet, enemy)) {
                    game.bullets.splice(bulletIndex, 1);
                    game.enemies.splice(enemyIndex, 1);
                }
            });
        });

        // Draw ground
        ctx.fillStyle = 'green';
        game.ground.forEach(ground => ctx.fillRect(ground.x - game.player.x + 50, ground.y, ground.width, ground.height));

        // Draw holes
        ctx.fillStyle = 'black';
        game.holes.forEach(hole => ctx.fillRect(hole.x - game.player.x + 50, hole.y, hole.width, hole.height));

        // Draw goal
        ctx.drawImage(game.images.goal, 3950 - game.player.x + 50, 200, 100, 100);

        // Draw player
        ctx.drawImage(game.images.player, 50, game.player.y, game.player.width, game.player.height);

        // Draw bullets
        game.bullets.forEach(bullet => ctx.drawImage(game.images.bullet, bullet.x - game.player.x + 50, bullet.y, bullet.width, bullet.height));

        // Draw coins
        game.coins.forEach(coin => ctx.drawImage(game.images.coin, coin.x - game.player.x + 50, coin.y, coin.width, coin.height));

        // Draw enemies
        game.enemies.forEach(enemy => ctx.drawImage(game.images[enemy.type], enemy.x - game.player.x + 5, enemy.y, enemy.width, enemy.height));

        // Draw power-ups
        game.powerups.forEach(powerup => ctx.drawImage(game.images.powerup, powerup.x - game.player.x + 50, powerup.y, powerup.width, powerup.height));

        // Check collisions
        game.coins.forEach((coin, index) => {
            if (checkCollision({x: game.player.x + 50, y: game.player.y, width: game.player.width, height: game.player.height}, coin)) {
                game.coins.splice(index, 1);
                game.score += 10;
            }
        });

        game.enemies.forEach(enemy => {
            if (checkCollision({x: game.player.x + 50, y: game.player.y, width: game.player.width, height: game.player.height}, enemy)) {
                showWindow('gameOverWindow');
                game.gameOver = true;
            }
        });

        game.holes.forEach(hole => {
            if (checkCollision({x: game.player.x + 50, y: game.player.y, width: game.player.width, height: game.player.height}, hole)) {
                showWindow('gameOverWindow');
                game.gameOver = true;
            }
        });

        game.powerups.forEach((powerup, index) => {
            if (checkCollision({x: game.player.x + 50, y: game.player.y, width: game.player.width, height: game.player.height}, powerup)) {
                game.powerups.splice(index, 1);
                game.player.canShoot = true;
            }
        });

        // Draw score
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText('Score: ' + game.score, 10, 20);

        if (game.gameOver) {
            return;
        }

        if (game.player.x >= 3950) {
            showWindow('gameClearWindow');
            return;
        }

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}

function shootBullet() {
    game.bullets.push({
        x: game.player.x + game.player.width + 50,
        y: game.player.y + game.player.height / 2 - 5,
        width: 10,
        height: 10,
        speed: 5
    });
}

function resetGame() {
    game.player.x = 50;
    game.player.y = 300;
    game.player.velocityY = 0;
    game.player.canShoot = false;
    game.player.speed = 2.5; // プレイヤーの移動速度を初期化
    game.score = 0;
    game.gameOver = false;
    game.coins = [
        {x: 150, y: 300, width: 30, height: 30},
        {x: 200, y: 300, width: 30, height: 30},
        {x: 300, y: 300, width: 30, height: 30},
        {x: 400, y: 250, width: 30, height: 30},
        {x: 500, y: 250, width: 30, height: 30},
        {x: 600, y: 300, width: 30, height: 30},
        {x: 700, y: 300, width: 30, height: 30},
        {x: 800, y: 300, width: 30, height: 30},
        {x: 900, y: 200, width: 30, height: 30},
        {x: 1000, y: 250, width: 30, height: 30},
        {x: 1100, y: 150, width: 30, height: 30},
        {x: 1200, y: 250, width: 30, height: 30},
        {x: 1300, y: 200, width: 30, height: 30},
        {x: 1400, y: 200, width: 30, height: 30},
        {x: 1500, y: 150, width: 30, height: 30},
        {x: 1600, y: 200, width: 30, height: 30},
        {x: 1700, y: 200, width: 30, height: 30},
        {x: 1800, y: 200, width: 30, height: 30},
        {x: 1900, y: 250, width: 30, height: 30},
        {x: 2000, y: 350, width: 30, height: 30},
        {x: 2100, y: 300, width: 30, height: 30},
        {x: 2200, y: 350, width: 30, height: 30},
        {x: 2300, y: 300, width: 30, height: 30},
        {x: 2400, y: 250, width: 30, height: 30},
        {x: 2500, y: 350, width: 30, height: 30},
        {x: 2650, y: 250, width: 30, height: 30},
        {x: 2700, y: 300, width: 30, height: 30},
        {x: 2800, y: 300, width: 30, height: 30},
        {x: 2900, y: 250, width: 30, height: 30},
        {x: 3000, y: 300, width: 30, height: 30},
        {x: 3100, y: 300, width: 30, height: 30},
        {x: 3200, y: 300, width: 30, height: 30},
        {x: 3300, y: 250, width: 30, height: 30},
        {x: 3400, y: 300, width: 30, height: 30},
        {x: 3500, y: 250, width: 30, height: 30},
        {x: 3600, y: 250, width: 30, height: 30},
        {x: 3700, y: 200, width: 30, height: 30},
        {x: 3800, y: 150, width: 30, height: 30}
    ];
    game.enemies = [
        {x: 900, y: 320, width: 40, height: 40, type: 'enemy1'},
        {x: 1150, y: 270, width: 40, height: 40, type: 'enemy2'},
        {x: 1580, y: 225, width: 40, height: 40, type: 'enemy3'},
        {x: 2100, y: 340, width: 40, height: 40, type: 'enemy1'},
        {x: 2500, y: 340, width: 40, height: 40, type: 'enemy2'},
        {x: 2850, y: 320, width: 40, height: 40, type: 'enemy3'},
        {x: 3500, y: 320, width: 40, height: 40, type: 'enemy1'},
        {x: 3800, y: 270, width: 40, height: 40, type: 'enemy2'}
    ];
    game.powerups = [
        {x: 600, y: 320, width: 30, height: 30},
        {x: 1500, y: 180, width: 30, height: 30},
        {x: 3300, y: 320, width: 30, height: 30}
    ];
    game.holes = [
        {x: 423, y: 380, width: 1385, height: 20},
        {x: 1600, y: 380, width: 50, height: 20},
        {x: 2620, y: 380, width: 1000, height: 20},
        {x: 3400, y: 380, width: 800, height: 20}
    ];
    game.ground = [
        {x: 0, y: 380, width: 420, height: 20},
        {x: 450, y: 350, width: 500, height: 20},
        {x: 900, y: 300, width: 400, height: 20},
        {x: 1350, y: 250, width: 400, height: 20},
        {x: 1800, y: 380, width: 800, height: 20},
        {x: 2700, y: 350, width: 850, height: 20},
        {x: 3500, y: 300, width: 900, height: 20}
    ];
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function retry() {
    showWindow('mainWindow');
    resetGame();
    initGame();
}

function restart() {
    resetGame();
    showWindow('titleWindow');
}



loadImages([
    {name: 'player', src: 'images/player.png'},
    {name: 'coin', src: 'images/coin.png'},
    {name: 'enemy1', src: 'images/enemy1.png'},
    {name: 'enemy2', src: 'images/enemy2.png'},
    {name: 'enemy3', src: 'images/enemy3.png'},
    {name: 'goal', src: 'images/goal.png'},
    {name: 'powerup', src: 'images/powerup.png'},
    {name: 'bullet', src: 'images/bullet.png'}
], initGame);
