const app = Vue.createApp({
  data() {
    return {
      running: false,
      gameOver: false
    };
  },
  methods: {
    startGame() {
      this.running = true;
      this.gameOver = false;
      start(this);
    }
  },
  mounted() {
    setupControls(this);
  }
});

let ctx, canvas;
let bird;
let pipes;
const birdImg = new Image();
birdImg.src = 'bird.webp';
const pipeImg = new Image();
pipeImg.src = 'pipe.png';
let lastTime = 0;
let lastPipe = 0;

const GRAVITY = 0.1;
const PIPE_SPEED = 1.5;
const PIPE_GAP = 160;
const PIPE_INTERVAL = 2000;
const FLAP_STRENGTH = -3;
const PIPE_WIDTH = 50;

function setCanvasSize() {
  if (!canvas) {
    canvas = document.getElementById('gameCanvas');
  }
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

app.mount('#app');

function setupControls(app) {
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') flap();
  });
  canvas = document.getElementById('gameCanvas');
  canvas.addEventListener('click', flap);
  setCanvasSize();
  window.addEventListener('resize', setCanvasSize);
}

function start(app) {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  bird = { x: 50, y: canvas.height / 2, w: 40, h: 40, v: 0 };
  pipes = [];
  lastTime = performance.now();
  lastPipe = lastTime;
  requestAnimationFrame((ts) => gameLoop(ts, app));
}

function flap() {
  bird.v = FLAP_STRENGTH;
}

function gameLoop(timestamp, app) {
  if (!app.running) return;
  const delta = timestamp - lastTime;
  lastTime = timestamp;
  updateGame(timestamp, app);
  drawGame();
  if (app.running) {
    requestAnimationFrame((ts) => gameLoop(ts, app));
  }
}

function updateGame(timestamp, app) {
  bird.v += GRAVITY;
  bird.y += bird.v;

  if (bird.y + bird.h > canvas.height || bird.y < 0) {
    app.running = false;
    app.gameOver = true;
  }

  for (let i = pipes.length - 1; i >= 0; i--) {
    const p = pipes[i];
    p.x -= PIPE_SPEED;
    if (
      bird.x < p.x + PIPE_WIDTH &&
      bird.x + bird.w > p.x &&
      (bird.y < p.top || bird.y + bird.h > p.bottom)
    ) {
      app.running = false;
      app.gameOver = true;
    }
    if (p.x + PIPE_WIDTH < 0) {
      pipes.splice(i, 1);
    }
  }

  if (timestamp - lastPipe > PIPE_INTERVAL) {
    addPipe();
    lastPipe = timestamp;
  }
}

function addPipe() {
  const gap = PIPE_GAP;
  const min = 40;
  const max = canvas.height - gap - min;
  const top = Math.random() * (max - min) + min;
  pipes.push({ x: canvas.width, top, bottom: top + gap });
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(birdImg, bird.x, bird.y, bird.w, bird.h);
  for (const p of pipes) {
    ctx.drawImage(pipeImg, p.x, 0, PIPE_WIDTH, p.top);
    ctx.save();
    ctx.translate(p.x, p.bottom);
    ctx.scale(1, -1);
    ctx.drawImage(pipeImg, 0, 0, PIPE_WIDTH, canvas.height - p.bottom);
    ctx.restore();
  }
}
