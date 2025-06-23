const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const PIPE_WIDTH = 52;
const PIPE_SPEED = -100;
const PIPE_GAP = 170; // Было 150, теперь шире проход
const PIPE_INTERVAL = 2400; // Было 2000, теперь трубы дальше друг от друга
const BIRD_SIZE = 34;
const GRAVITY = 420; // Было 500, теперь ещё мягче падение
const FLAP_STRENGTH = -240; // Было -270, теперь прыжок чуть слабее

let bird;
let pipes;
let score = 0;
let scoreText;
let gameOver = false;
let pipeTimer = 0;
let lastScoredPipeX = null; // Для отслеживания ближайшей трубы
let started = false; // Флаг: началась ли игра

const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#87ceeb',
    scale: {
        mode: Phaser.Scale.NONE,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

function preload() {
    this.load.image('background', 'assets/flappy_tropic_background_400x600.png');
    this.load.image('bird', 'assets/bombardino_crocodilo_96x69.png');
    this.load.image('pipe', 'assets/tiki_pipe_52x800.png'); // длинный тотем для crop
}

function create() {
    // Добавляем фон на задний план
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'background').setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
    // Сдвигаем крокодила выше центра
    bird = this.add.sprite(80, GAME_HEIGHT / 2 - 60, 'bird');
    bird.setDisplaySize(60, 44);
    bird.setOrigin(0.5, 0.5);
    bird.ySpeed = 0;
    bird.alive = true;

    pipes = this.add.group();
    score = 0;
    lastScoredPipeX = null;
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#000'
    });
    scoreText.setDepth(1);

    this.input.on('pointerdown', flap, this);
    this.input.keyboard.on('keydown-SPACE', flap, this);

    // Увеличиваем задержку для первой трубы (чтобы не было мгновенного столкновения)
    pipeTimer = PIPE_INTERVAL - 100; // чуть позже, чем раньше
    gameOver = false;
}

function update(time, delta) {
    if (gameOver) return;
    const fixedDelta = 1000 / 60;
    if (started) {
        bird.ySpeed += GRAVITY * (fixedDelta / 1000);
        bird.y += bird.ySpeed * (fixedDelta / 1000);
    }
    if (bird.y > GAME_HEIGHT || bird.y < 0) {
        endGame.call(this);
    }
    if (started) {
        pipeTimer += fixedDelta;
        let pipesWereAdded = false;
        while (pipeTimer > PIPE_INTERVAL) {
            addPipeRow.call(this);
            pipeTimer -= PIPE_INTERVAL;
            pipesWereAdded = true;
        }
    }
    const pipesArr = pipes.getChildren();
    const toRemove = [];
    for (let i = 0; i < pipesArr.length; i++) {
        const pipe = pipesArr[i];
        if (started) pipe.x += PIPE_SPEED * (fixedDelta / 1000);
        if (pipe.x + PIPE_WIDTH < 0) {
            toRemove.push(pipe);
        }
        if (
            pipe.flipY && !pipe.scored && bird.x > pipe.x + PIPE_WIDTH / 2
        ) {
            score++;
            scoreText.setText('Score: ' + score);
            pipe.scored = true;
        }
        // --- Исправленная ручная коллизия ---
        // Проверяем только видимую часть трубы (crop)
        if (
            bird.x + 26 > pipe.x - PIPE_WIDTH / 2 &&
            bird.x - 26 < pipe.x + PIPE_WIDTH / 2 &&
            bird.y + 18 > (pipe.cropY ?? (pipe.y - pipe.displayHeight / 2)) &&
            bird.y - 18 < (pipe.cropBottom ?? (pipe.y + pipe.displayHeight / 2))
        ) {
            endGame.call(this);
        }
    }
    toRemove.forEach(pipe => pipes.remove(pipe, true, true));
}

function flap() {
    if (gameOver) return;
    if (!started) started = true;
    bird.ySpeed = FLAP_STRENGTH;
}

function addPipeRow() {
    const MIN_PIPE_HEIGHT = 50;
    const PIPE_TEXTURE_HEIGHT = 800; // Высота PNG-тотема
    const MAX_PIPE_HEIGHT = PIPE_TEXTURE_HEIGHT;
    // Гарантируем, что gap не меньше минимального, чтобы обе трубы влезли
    const maxGap = GAME_HEIGHT - 2 * MIN_PIPE_HEIGHT;
    const safeGap = Math.max(PIPE_GAP, GAME_HEIGHT - 2 * MAX_PIPE_HEIGHT);
    const gap = Math.max(safeGap, Math.min(PIPE_GAP, maxGap));
    const gapStart = Phaser.Math.Between(MIN_PIPE_HEIGHT, GAME_HEIGHT - gap - MIN_PIPE_HEIGHT);
    // Верхняя труба
    let topPipeHeight = Math.min(gapStart, MAX_PIPE_HEIGHT);
    let topCropY = PIPE_TEXTURE_HEIGHT - topPipeHeight;
    if (topPipeHeight >= MIN_PIPE_HEIGHT) {
        const topPipe = this.add.sprite(GAME_WIDTH + PIPE_WIDTH / 2, topPipeHeight, 'pipe');
        topPipe.setOrigin(0.5, 1);
        topPipe.setCrop(0, topCropY, PIPE_WIDTH, topPipeHeight);
        topPipe.cropHeight = topPipeHeight; // для ручной коллизии
        topPipe.cropY = topPipe.y - topPipeHeight; // верхняя граница
        topPipe.cropBottom = topPipe.y; // нижняя граница
        pipes.add(topPipe);
    }
    // Нижняя труба
    let bottomPipeHeight = Math.min(GAME_HEIGHT - gapStart - gap, MAX_PIPE_HEIGHT);
    if (bottomPipeHeight >= MIN_PIPE_HEIGHT) {
        const bottomPipe = this.add.sprite(
            GAME_WIDTH + PIPE_WIDTH / 2,
            gapStart + gap,
            'pipe'
        );
        bottomPipe.setOrigin(0.5, 0);
        bottomPipe.setCrop(0, 0, PIPE_WIDTH, bottomPipeHeight);
        bottomPipe.cropHeight = bottomPipeHeight; // для ручной коллизии
        bottomPipe.cropY = bottomPipe.y; // верхняя граница
        bottomPipe.cropBottom = bottomPipe.y + bottomPipeHeight; // нижняя граница
        pipes.add(bottomPipe);
    }
}

function hitPipe() {
    endGame.call(this);
}

function endGame() {
    gameOver = true;
    this.add.text(GAME_WIDTH / 2 - 60, GAME_HEIGHT / 2, 'Game Over', { fontSize: '32px', fill: '#f00' });
    this.input.off('pointerdown', flap, this);
    this.input.keyboard.off('keydown-SPACE', flap, this);
    this.physics.pause();
}

new Phaser.Game(config);
