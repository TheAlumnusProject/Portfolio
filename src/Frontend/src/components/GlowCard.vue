<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
  tiltStrength?: number;
}

const props = withDefaults(defineProps<Props>(), {
  tiltStrength: 10,
});

const cardStyle = ref<Record<string, string>>({
  '--tilt-x': '0deg',
  '--tilt-y': '0deg',
  '--pointer-x': '50%',
  '--pointer-y': '50%',
});

const handleMouseMove = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  const bounds = target.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width) * 100;
  const y = ((event.clientY - bounds.top) / bounds.height) * 100;
  // const rotateY = ((x - 50) / 50) * 10;
  // const rotateX = ((50 - y) / 50) * 10;
  const rotateY = ((50 - x) / 50) * props.tiltStrength;
  const rotateX = ((y - 50) / 50) * props.tiltStrength;

  cardStyle.value = {
    '--tilt-x': `${rotateX.toFixed(2)}deg`,
    '--tilt-y': `${rotateY.toFixed(2)}deg`,
    '--pointer-x': `${x.toFixed(2)}%`,
    '--pointer-y': `${y.toFixed(2)}%`,
  };
};

const reset = () => {
  cardStyle.value = {
    '--tilt-x': '0deg',
    '--tilt-y': '0deg',
    '--pointer-x': '50%',
    '--pointer-y': '50%',
  };
};

const styleObject = computed<Record<string, string>>(() => cardStyle.value);
</script>

<template>
  <article class="glow-card" :style="styleObject" @mousemove="handleMouseMove" @mouseleave="reset">
    <div class="card-fill"></div>
    <div class="card-texture"></div>
    <div class="card-content">
      <slot />
    </div>
  </article>
</template>

<style scoped>
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.glow-card {
  position: relative;
  width: 100%;
  border-radius: 1.4rem;
  padding: 1.2rem;
  transform: perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
  transition: transform 180ms ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.28);
  overflow: hidden;
}

.glow-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: conic-gradient(from var(--angle, 0deg), var(--accent) 0deg, var(--accent3) 140deg, var(--accent2) 220deg, var(--accent) 360deg);
  filter: blur(0.35rem);
  opacity: 0.85;
  animation: rotateGlow 8s linear infinite;
  z-index: 0;
}

.card-fill {
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  background-color: var(--surface);
  box-shadow: inset 0 0 0 1px var(--accent-ghost);
  transition: box-shadow 220ms ease;
  z-index: 1;
}

.glow-card:hover .card-fill {
  box-shadow: inset 0 0 0 1px var(--accent);
}

.card-texture {
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  pointer-events: none;
  background-color: var(--text);
  opacity: 0.05;
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='34.64'><defs><pattern id='h' width='60' height='34.64' patternUnits='userSpaceOnUse'><polygon points='20,0 10,17.32 -10,17.32 -20,0 -10,-17.32 10,-17.32' fill='none' stroke='white' stroke-width='1.2'/><polygon points='80,0 70,17.32 50,17.32 40,0 50,-17.32 70,-17.32' fill='none' stroke='white' stroke-width='1.2'/><polygon points='20,34.64 10,51.96 -10,51.96 -20,34.64 -10,17.32 10,17.32' fill='none' stroke='white' stroke-width='1.2'/><polygon points='80,34.64 70,51.96 50,51.96 40,34.64 50,17.32 70,17.32' fill='none' stroke='white' stroke-width='1.2'/><polygon points='50,17.32 40,34.64 20,34.64 10,17.32 20,0 40,0' fill='none' stroke='white' stroke-width='1.2'/></pattern></defs><rect width='100%25' height='100%25' fill='url(%23h)'/></svg>");
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='34.64'><defs><pattern id='h' width='60' height='34.64' patternUnits='userSpaceOnUse'><polygon points='20,0 10,17.32 -10,17.32 -20,0 -10,-17.32 10,-17.32' fill='none' stroke='white' stroke-width='1.2'/><polygon points='80,0 70,17.32 50,17.32 40,0 50,-17.32 70,-17.32' fill='none' stroke='white' stroke-width='1.2'/><polygon points='20,34.64 10,51.96 -10,51.96 -20,34.64 -10,17.32 10,17.32' fill='none' stroke='white' stroke-width='1.2'/><polygon points='80,34.64 70,51.96 50,51.96 40,34.64 50,17.32 70,17.32' fill='none' stroke='white' stroke-width='1.2'/><polygon points='50,17.32 40,34.64 20,34.64 10,17.32 20,0 40,0' fill='none' stroke='white' stroke-width='1.2'/></pattern></defs><rect width='100%25' height='100%25' fill='url(%23h)'/></svg>");
  mask-repeat: repeat;
  -webkit-mask-repeat: repeat;
  z-index: 2;
}

.card-content {
  position: relative;
  z-index: 3;
}

@keyframes rotateGlow {
  to {
    --angle: 360deg;
  }
}
</style>
