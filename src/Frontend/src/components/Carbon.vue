<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

interface Props {
  glowRadius?: number;
  rasterDensity?: number;
}

const props = withDefaults(defineProps<Props>(), {
  glowRadius: 170,
  rasterDensity: 100,
});

const rootElement = ref<HTMLElement | null>(null);

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let rafId = 0;

const BLOB_POINT_COUNT = 32;
const BLOB_VIEWBOX = 280;
const BLOB_CENTER = 140;
const BLOB_BASE_RADIUS = 80;
const BLOB_RADIUS_MIN = 60;
const BLOB_RADIUS_MAX = 150;
const BLOB_WALK_STEPS = 60; // forward steps; the walk then undoes them in reverse, so it closes into a loop
const BLOB_MOVE_STEP = 15; // max radius shifted from one vertex to another per step
const BLOB_DURATION = '20s';

const radiiToPoints = (radii: number[]) =>
  radii
    .map((radius, i) => {
      const angle = (i / BLOB_POINT_COUNT) * Math.PI * 2;
      const x = (BLOB_CENTER + radius * Math.cos(angle)).toFixed(1);
      const y = (BLOB_CENTER + radius * Math.sin(angle)).toFixed(1);
      return `${x},${y}`;
    })
    .join(' ');

// grows radii[i] by delta and shrinks radii[j] by the same amount, so the sum of all radii
// (the blob's "mass") never changes -- clamped to stay within range, returning what was
// actually applied so the move can be undone exactly later, even if it got clamped
const applyMove = (radii: number[], i: number, j: number, delta: number) => {
  const clamped = Math.min(BLOB_RADIUS_MAX, Math.max(BLOB_RADIUS_MIN, radii[i]! + delta));
  const actualDelta = clamped - radii[i]!;
  radii[i] = clamped;
  radii[j] = Math.min(BLOB_RADIUS_MAX, Math.max(BLOB_RADIUS_MIN, radii[j]! - actualDelta));
  return actualDelta;
};

// walks forward through BLOB_WALK_STEPS small mass-conserving moves, then undoes each move
// in reverse order -- so the path returns exactly to its starting shape, giving a long,
// gradually-drifting, seamlessly-looping sequence instead of independent random keyframes
const buildWalkFrames = () => {
  const radii: number[] = new Array(BLOB_POINT_COUNT).fill(BLOB_BASE_RADIUS);
  const frames: number[][] = [radii.slice()];
  const moves: { i: number; j: number; delta: number }[] = [];

  for (let step = 0; step < BLOB_WALK_STEPS; step++) {
    const i = Math.floor(Math.random() * BLOB_POINT_COUNT);
    let j = Math.floor(Math.random() * BLOB_POINT_COUNT);
    if (j === i) j = (j + 1) % BLOB_POINT_COUNT;
    const delta = (Math.random() - 0.5) * 2 * BLOB_MOVE_STEP;
    const actualDelta = applyMove(radii, i, j, delta);
    moves.push({ i, j, delta: actualDelta });
    frames.push(radii.slice());
  }

  for (let step = moves.length - 1; step >= 0; step -= 1) {
    const move = moves[step]!;
    radii[move.i] = radii[move.i]! - move.delta;
    radii[move.j] = radii[move.j]! + move.delta;
    frames.push(radii.slice());
  }

  return frames; // frames[0] === frames[frames.length - 1], a closed loop
};

// starts playback partway through the walk instead of always at frame 0 -- with this many
// frames in the loop, a random starting point is enough that the fixed path underneath isn't obvious
const rotateToRandomStart = (frames: number[][]) => {
  const period = frames.length - 1;
  const start = Math.floor(Math.random() * period);
  return [...frames.slice(start, period), ...frames.slice(0, start + 1)];
};

const setBlobMask = () => {
  const frames = rotateToRandomStart(buildWalkFrames()).map(radiiToPoints);
  const keyTimes = frames.map((_, i) => (i / (frames.length - 1)).toFixed(4)).join(';');

  rootElement.value?.style.setProperty(
    '--hex-spot',
    `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${BLOB_VIEWBOX} ${BLOB_VIEWBOX}'>` +
    `<polygon points='${frames[0]}' fill='white'>` +
    `<animate attributeName='points' values='${frames.join(';')}' dur='${BLOB_DURATION}' ` +
    `keyTimes='${keyTimes}' calcMode='linear' repeatCount='indefinite'/>` +
    `</polygon></svg>")`,
  );
};

const handleMouseMove = (event: MouseEvent) => {
  targetX = event.clientX;
  targetY = event.clientY;
};

const tick = () => {
  currentX += (targetX - currentX) * 0.15;
  currentY += (targetY - currentY) * 0.15;
  rootElement.value?.style.setProperty('--mx', `${currentX}px`);
  rootElement.value?.style.setProperty('--my', `${currentY}px`);
  rafId = requestAnimationFrame(tick);
};

onMounted(() => {
  targetX = currentX = window.innerWidth / 2;
  targetY = currentY = window.innerHeight / 2;
  rootElement.value?.style.setProperty('--glow-radius', `${props.glowRadius}px`);
  rootElement.value?.style.setProperty('--raster-density', `${props.rasterDensity}px`);
  setBlobMask();
  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  rafId = requestAnimationFrame(tick);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  cancelAnimationFrame(rafId);
});
</script>

<template>
  <div ref="rootElement" class="carbon-weave">
    <div class="weave-base"></div>
    <div class="weave-glow"></div>
  </div>
</template>

<style scoped>
.carbon-weave {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.weave-base,
.weave-glow {
  position: absolute;
  --hex-tile: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='34.64'><defs><pattern id='h' width='60' height='34.64' patternUnits='userSpaceOnUse'><polygon points='20,0 10,17.32 -10,17.32 -20,0 -10,-17.32 10,-17.32' fill='none' stroke='white' stroke-width='1.2'/><polygon points='80,0 70,17.32 50,17.32 40,0 50,-17.32 70,-17.32' fill='none' stroke='white' stroke-width='1.2'/><polygon points='20,34.64 10,51.96 -10,51.96 -20,34.64 -10,17.32 10,17.32' fill='none' stroke='white' stroke-width='1.2'/><polygon points='80,34.64 70,51.96 50,51.96 40,34.64 50,17.32 70,17.32' fill='none' stroke='white' stroke-width='1.2'/><polygon points='50,17.32 40,34.64 20,34.64 10,17.32 20,0 40,0' fill='none' stroke='white' stroke-width='1.2'/></pattern></defs><rect width='100%25' height='100%25' fill='url(%23h)'/></svg>");
  mask-image: var(--hex-tile);
  -webkit-mask-image: var(--hex-tile);
  mask-size: var(--raster-density, 26px) calc(var(--raster-density, 26px) * 0.57735);
  -webkit-mask-size: var(--raster-density, 26px) calc(var(--raster-density, 26px) * 0.57735);
  mask-repeat: repeat;
  -webkit-mask-repeat: repeat;
}

.weave-base {
  inset: -2px;
  background-color: var(--text);
  opacity: 0.05;
}

.weave-glow {
  /* --hex-spot is set once on mount from Carbon.vue's script: a many-point polygon that
     self-animates between randomly generated organic frames via native SVG <animate>,
     so the shape morphs without any per-frame JS/CSS reassignment (which caused flicker) */
  inset: -2px;
  background-color: var(--accent);
  mask-image: var(--hex-tile), var(--hex-spot);
  -webkit-mask-image: var(--hex-tile), var(--hex-spot);
  mask-size:
    var(--raster-density, 26px) calc(var(--raster-density, 26px) * 0.57735),
    calc(var(--glow-radius, 170px) * 2) calc(var(--glow-radius, 170px) * 2);
  -webkit-mask-size:
    var(--raster-density, 26px) calc(var(--raster-density, 26px) * 0.57735),
    calc(var(--glow-radius, 170px) * 2) calc(var(--glow-radius, 170px) * 2);
  mask-position:
    0 0,
    calc(var(--mx, 50%) - var(--glow-radius, 170px)) calc(var(--my, 50%) - var(--glow-radius, 170px));
  -webkit-mask-position:
    0 0,
    calc(var(--mx, 50%) - var(--glow-radius, 170px)) calc(var(--my, 50%) - var(--glow-radius, 170px));
  mask-repeat: repeat, no-repeat;
  -webkit-mask-repeat: repeat, no-repeat;
  mask-composite: intersect;
  -webkit-mask-composite: source-in;
}

@media (hover: none) {
  .weave-glow {
    display: none;
  }
}
</style>
