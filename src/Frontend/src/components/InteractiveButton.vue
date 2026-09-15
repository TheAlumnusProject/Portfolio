<script setup lang="ts">
import { RouterLink } from 'vue-router';

interface Props {
  to?: string;
  href?: string;
  external?: boolean;
  type?: 'button' | 'submit' | 'reset';
  size?: 'default' | 'compact';
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  size: 'default',
  external: false,
});
</script>

<template>
  <RouterLink v-if="to" :to="to" class="interactive-button" :class="size">
    <span><slot /></span>
  </RouterLink>
  <a v-else-if="href" :href="href" :target="external ? '_blank' : undefined" :rel="external ? 'noopener noreferrer' : undefined" class="interactive-button" :class="size">
    <span><slot /></span>
  </a>
  <button v-else :type="type" class="interactive-button" :class="size">
    <span><slot /></span>
  </button>
</template>

<style scoped>
.interactive-button {
  position: relative;
  overflow: hidden;
  display: inline-block;
  border: none;
  background-color: color-mix(in srgb, var(--accent) 82%, black);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.3);
  filter: drop-shadow(0 6px 16px var(--accent-weak));
  color: var(--bg);
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: filter 200ms ease;
}

.interactive-button:hover {
  filter: drop-shadow(0 8px 22px var(--accent-weak));
}

.interactive-button.default {
  padding: 0.7rem 1.3rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%);
}

.interactive-button.compact {
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
}

.interactive-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: color-mix(in srgb, var(--accent3) 82%, black);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 260ms cubic-bezier(0.65, 0, 0.35, 1);
}

.interactive-button:hover::before {
  transform: scaleX(1);
}

.interactive-button span {
  position: relative;
  z-index: 1;
}
</style>
