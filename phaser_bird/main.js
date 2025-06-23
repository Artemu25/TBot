const CONFIG = {
    type: Phaser.AUTO,
    parent: 'game',
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: window.innerWidth,
        height: window.innerHeight
    },
    backgroundColor: '#70c5ce',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: { preload, create, update }
};

let bird;
let pipes;
let pipeTimer;
let gameOverText;
let started = false;

const PIPE_SPEED = -200;
const PIPE_GAP = 150;
const PIPE_INTERVAL = 1500;
const PIPE_WIDTH = 60;
const BIRD_SIZE = 30;

new Phaser.Game(CONFIG);

function preload() {}

function create() {
    const { width, height } = this.scale;

    bird = this.add.rectangle(100, height / 2, BIRD_SIZE, BIRD_SIZE, 0xffff00);
    this.physics.add.existing(bird);
    bird.body.setCollideWorldBounds(true);

    pipes = this.physics.add.group();

    gameOverText = this.add.text(width / 2, height / 2, 'Click to Start', {
        fontSize: '32px',
        color: '#ffffff'
    }).setOrigin(0.5);

    this.input.on('pointerdown', startGame, this);
    this.input.keyboard.on('keydown-SPACE', flap, this);

    this.physics.add.overlap(bird, pipes, hitPipe, null, this);
}

function startGame() {
    if (started) {
        flap();
        return;
    }
    started = true;
    gameOverText.setText('');
    bird.body.setVelocity(0);
    bird.y = this.scale.height / 2;

    pipes.clear(true, true);

    pipeTimer = this.time.addEvent({
        delay: PIPE_INTERVAL,
        callback: addPipes,
        callbackScope: this,
        loop: true
    });
    addPipes.call(this);
}

function flap() {
    if (!started) return;
    bird.body.setVelocityY(-300);
}

function addPipes() {
    const { width, height } = this.scale;
    const topHeight = Phaser.Math.Between(50, height - PIPE_GAP - 50);
    const bottomHeight = height - topHeight - PIPE_GAP;

    const top = this.add.rectangle(width, 0, PIPE_WIDTH, topHeight, 0x00ff00).setOrigin(0, 0);
    const bottom = this.add.rectangle(width, height - bottomHeight, PIPE_WIDTH, bottomHeight, 0x00ff00).setOrigin(0, 0);

    this.physics.add.existing(top);
    this.physics.add.existing(bottom);

    top.body.setVelocityX(PIPE_SPEED);
    top.body.immovable = true;
    top.body.allowGravity = false;

    bottom.body.setVelocityX(PIPE_SPEED);
    bottom.body.immovable = true;
    bottom.body.allowGravity = false;

    pipes.add(top);
    pipes.add(bottom);
}

function hitPipe() {
    gameOverText.setText('Game Over - Click to Restart');
    started = false;
    pipeTimer.remove(false);
    bird.body.setVelocity(0);
    Phaser.Actions.Call(pipes.getChildren(), function (pipe) {
        pipe.body.setVelocityX(0);
    });
}

function update() {
    if (!started) return;

    Phaser.Actions.Call(pipes.getChildren(), function (pipe) {
        if (pipe.getBounds().right < 0) {
            pipe.destroy();
        }
    });

    if (bird.y >= this.scale.height || bird.y < 0) {
        hitPipe.call(this);
    }
}
