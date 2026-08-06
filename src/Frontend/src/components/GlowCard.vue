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
    <slot />
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
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease;
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

.glow-card::after {
  content: '';
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  background: linear-gradient(135deg, var(--surface-strong), var(--surface));
  z-index: 1;
}

.glow-card > * {
  position: relative;
  z-index: 2;
}

@keyframes rotateGlow {
  to {
    --angle: 360deg;
  }
}
</style>
