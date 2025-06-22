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
let lastTime = 0;
let lastPipe = 0;

const GRAVITY = 0.3;
const PIPE_SPEED = 1.5;
const PIPE_GAP = 160;
const PIPE_INTERVAL = 2000;
const FLAP_STRENGTH = -6;

app.mount('#app');

function setupControls(app) {
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') flap();
  });
  canvas = document.getElementById('gameCanvas');
  canvas.addEventListener('click', flap);
}

function start(app) {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  bird = { x: 50, y: canvas.height / 2, w: 20, h: 20, v: 0 };
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
      bird.x < p.x + 50 &&
      bird.x + bird.w > p.x &&
      (bird.y < p.top || bird.y + bird.h > p.bottom)
    ) {
      app.running = false;
      app.gameOver = true;
    }
    if (p.x + 50 < 0) {
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
  ctx.fillStyle = '#FF0';
  ctx.fillRect(bird.x, bird.y, bird.w, bird.h);
  ctx.fillStyle = '#0F0';
  for (const p of pipes) {
    ctx.fillRect(p.x, 0, 50, p.top);
    ctx.fillRect(p.x, p.bottom, 50, canvas.height - p.bottom);
  }
}
