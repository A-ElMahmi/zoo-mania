let bg = [];
let boxes = [];
let data;
let currentLevelPoints = [];
let sign;
let bangersFont;
let nextBtn;
let nextBtnImg;
let currentLevel = 0;
let healthBar;
let healthBarImgHollow;
let healthBarImgFill;
let health = 1000;
let gameOverImg;
let gameOverBtnImg;
let gameOverBtn;
let endScreenImg;
let endScreenBtnImg;
let endScreenBtn;
let gameState = 'start';
let startScreenImg;
let startScreenBtnImg;
let startScreenBtn;
let successSound;
let errorSound;
let clickSound;
let bgMusic;

function preload() {    
    startScreenImg = loadImage('assets/images/start-screen.png', img => {
        img.resize(960, 0);
    });
    startScreenBtnImg = loadImage('assets/images/start-btn.png');

    data = loadJSON('js/data.json', data => {
        for (let i = 0; i < data.length; i++) {
            bg.push(loadImage('assets/images/level' + i + '.png'));
        }
    });

    sign = loadImage('assets/images/sign2.png');
    bangersFont = loadFont('assets/fonts/Bangers.ttf');
    nextBtnImg = loadImage('assets/images/right-arrow.png');
    healthBarImgHollow = loadImage('assets/images/bar-hollow.png');
    healthBarImgFill = loadImage('assets/images/bar-fill.png');
    gameOverImg = loadImage('assets/images/game-over.png', img => {
        img.resize(400, 0);
    });
    gameOverBtnImg = loadImage('assets/images/retry-btn.png');
    endScreenImg = loadImage('assets/images/end-screen.png', img => {
        img.resize(400, 0);
    });
    endScreenBtnImg = loadImage('assets/images/play-again-btn.png');

    successSound = loadSound('assets/sfx/success.mp3');
    errorSound = loadSound('assets/sfx/error.mp3');
    clickSound = loadSound('assets/sfx/click.mp3');
}

function setup() {
    createCanvas(960, 540);

    startScreenBtn = new Button(startScreenBtnImg, width / 2, 350, 300, 100);
    
    nextBtn = new Button(nextBtnImg, width - 40, height - 39, 60, 58);
    healthBar = new HealthBar((width / 2) - 202, 15);
    gameOverBtn = new Button(gameOverBtnImg, width / 2, 320, 300, 100);
    endScreenBtn = new Button(endScreenBtnImg, width / 2, 320, 300, 100);

    bgMusic = loadSound('assets/sfx/bg-music.mp3', song => {
        song.setVolume(0.15);
        song.loop();
    })
}

function draw() {
    background(220);
    
    if (gameState === 'start') {
        image(startScreenImg, 0, 0);
        startScreenBtn.show();
        return;
    }

    image(bg[currentLevel], 0, 0, width, height);

    if (gameState === 'dead') {
        image(gameOverImg, (width / 2) - 200, 50);
        gameOverBtn.show();
        return;
    }
    
    if (gameState === 'end') {
        image(endScreenImg, (width / 2) - 200, 50);

        push();
        textAlign(LEFT, CENTER);
        fill(255);
        textSize(70);
        textFont(bangersFont);
        text(round(health), (width / 2) + 30, 168);
        pop();

        endScreenBtn.show();
        return;
    }

    let totalSnapped = 0;

    for (let i = boxes.length - 1; i >= 0; i--) {
        boxes[i].update();
        boxes[i].over();

        if (boxes[i].snap(currentLevelPoints) === true) {
            totalSnapped++;
        }

        boxes[i].show();
    }

    if (totalSnapped === currentLevelPoints.length) {
        nextBtn.show();
    }

    health = constrain(health - 0.6, 10, 1000);
    healthBar.show(health / 1000);

    if (health <= 10) {
        gameState = 'dead';
    }
}

function mousePressed() {
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].pressed()) {
            boxes.unshift(boxes.splice(i, 1)[0]);
            return;
        }
    }

    if (gameState === 'start') {
        startScreenBtn.pressed();
    } else if (gameState === 'dead') {
        gameOverBtn.pressed();
    } else if (gameState === 'end') {
        endScreenBtn.pressed();
    } else {
        nextBtn.pressed();
    }
}

function mouseReleased() {
    // Quit dragging
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].released();
    }

    if (gameState === 'start') {
        if (startScreenBtn.released()) {
            gameState = 'playing';
            loadLevel(currentLevel);
        }

    } else if (gameState === 'dead') {
        if (gameOverBtn.released()) {
            resetGame();
        }

    } else if (gameState === 'end') {
        if (endScreenBtn.released()) {
            resetGame();
        }

    } else {
        if (nextBtn.released()) {
            let totalCorrect = 0;
            
            for (let i = 0; i < boxes.length; i++) {
                if (boxes[i].checkAnswer()) {
                    totalCorrect++;
                }
            }
            
            if (totalCorrect === boxes.length) {
                if (currentLevel === 4) {
                    gameState = 'end';
                } else {
                    currentLevel++;
                    health += 150;
                    loadLevel(currentLevel);
                }
            }
        }
    }
}

function loadLevel(level) {
    boxes = [];
    currentLevelPoints = [];

    for (let i = 0; i < data[level].length; i++) {
        let x = data[level][i].x;
        let y = data[level][i].y;

        let padding = data[level].length === 5 ? 170 : 95;

        boxes.push(new Label(data[level][i].name, padding + (i * 155), 85, x, y));
        currentLevelPoints.push(createVector(x, y));
    }
}

function resetGame() {
    console.log('Game reset');

    health = 1000;
    currentLevel = 0;
    gameState = 'playing';
    loadLevel(currentLevel);
}