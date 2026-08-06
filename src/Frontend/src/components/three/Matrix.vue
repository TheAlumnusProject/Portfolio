<script lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useTheme } from '@/composables/useTheme';

const { currentTheme, themes } = useTheme();

export default {
  setup() {
    onMounted(() => {
      console.log('Matrix.vue mounted');
      initGame();
      requestAnimationFrame(gameLoop);
      window.addEventListener('resize', () => {
        initGame();
      });
    });

    onUnmounted(() => {
      console.log('Matrix.vue unmounted');
      window.removeEventListener('resize', () => {
        initGame();
      });
    });
  },
};

const TARGET_FPS = 24;
const REFRESH_INTERVAL = 1000 / TARGET_FPS;
const matrixTheme = themes.find((theme) => theme.name === 'matrix');
const matrixColors = matrixTheme?.colors;
const COLOR_PALETTE = matrixColors;

// const COLOR_PALETTE = {
//   BLACK: '#000',
//   WHITE: '#fff',
//   GRAY: '#888',
//   RED: '#f00',
//   GREEN: '#0f0',
//   BLUE: '#00f',
//   CYAN: '#0ff',
//   MAGENTA: '#f0f',
//   YELLOW: '#ff0',
// };
const COLOR_VALUES: string[] = [];
for (const key in matrixColors) {
  if (Object.prototype.hasOwnProperty.call(matrixColors, key)) {
    const colorValue = matrixColors[key as keyof typeof matrixColors];
    if (typeof colorValue === 'string') {
      COLOR_VALUES.push(colorValue);
    }
  }
}

const FONT_SIZE = 16;
const ALPHABETS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const LETTERS = ALPHABETS.split('');
const MAX_TIMER = 3;

/* -STATE- */
type RenderState = {
  lastTime: number;
  mainCtx: CanvasRenderingContext2D | null;
  columns: number;
  rains: {
    drop: number[];
    color: string[];
    timer: number[];
    current: string[];
    prev: string[];
  };
};

const state: RenderState = {
  lastTime: 0,
  mainCtx: null,
  columns: 0,
  rains: {
    drop: [] as number[],
    color: [] as string[],
    timer: [] as number[],
    current: [] as string[],
    prev: [] as string[],
  },
};

/* -INITIALIZE- */

function initScreen() {
  const mainCanvas = document.getElementById('matrix-canvas') as HTMLCanvasElement | null;

  const screen_W = window.innerWidth;
  const screen_H = window.innerHeight;

  state.columns = Math.floor(screen_W / FONT_SIZE);

  if (mainCanvas) {
    mainCanvas.width = screen_W;
    mainCanvas.height = screen_H;
    state.mainCtx = mainCanvas.getContext('2d');
  }
}

function initRain() {
  state.rains.drop = [];
  state.rains.color = [];
  state.rains.timer = [];
  state.rains.current = [];
  state.rains.prev = [];

  for (let i = 0; i < state.columns; i++) {
    state.rains.drop[i] = 0;
    state.rains.color[i] = COLOR_VALUES[Math.floor(Math.random() * COLOR_VALUES.length - 3) + 3] || '#0f0';
    state.rains.timer[i] = 0;
    state.rains.current[i] = LETTERS[Math.floor(Math.random() * LETTERS.length)] || '';
    state.rains.prev[i] = state.rains.current[i] || '';
  }
}

function initGame() {
  initScreen();
  initRain();
}

/* -DRAW- */
function drawRainFall() {
  const ctx = state.mainCtx as CanvasRenderingContext2D;
  if (!ctx) return;

  ctx.fillStyle = `rgba(0,0,0,0.25)`;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.font = `${FONT_SIZE}px monospace`;

  for (let i = 0; i < state.columns; i++) {
    if ((state.rains.timer[i] as number) >= MAX_TIMER) {
      state.rains.prev[i] = state.rains.current[i] || '';
      state.rains.current[i] = LETTERS[Math.floor(Math.random() * LETTERS.length)] || '';
      state.rains.timer[i] = 0;
    }
    ctx.fillStyle = state.rains.color[i] || '#0f0';
    ctx.fillText(state.rains.prev[i] || '', i * FONT_SIZE, state.rains.drop[i] as number);
    ctx.fillStyle = `#fff`;
    ctx.fillText(state.rains.current[i] || '', i * FONT_SIZE, (state.rains.drop[i] as number) + FONT_SIZE);

    state.rains.drop[i]! += FONT_SIZE;

    if ((state.rains.drop[i] as number) >= ctx.canvas.height && Math.random() >= 0.975) {
      state.rains.drop[i] = 0;
      state.rains.color[i] = COLOR_VALUES[Math.floor(Math.random() * COLOR_VALUES.length - 3) + 3] || '#0f0';
    }

    state.rains.timer[i]!++;
  }
}

function drawScreen() {
  drawRainFall();
}

function gameLoop(timestamp: number) {
  requestAnimationFrame(gameLoop);
  const elapsed = timestamp - state.lastTime;

  if (elapsed > REFRESH_INTERVAL) {
    state.lastTime = timestamp - (elapsed % REFRESH_INTERVAL);
    drawScreen();
  }
}
</script>

<template>
  <canvas id="matrix-canvas"></canvas>
</template>

<style scoped>
#matrix-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
