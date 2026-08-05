<script setup lang="ts">
interface Props {
  color?: string;
  backgroundColor?: string;
}

defineProps<Props>();
</script>

<template>
  <span class="pill" :style="{ color: color || 'var(--accent)', backgroundColor: backgroundColor || 'var(--accent-weak)' }">
    <slot />
  </span>
</template>

<style scoped>
.pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  font-size: 0.92rem;
  /* border: 1px solid currentColor; */
  transition: all 200ms ease;
}
.pill::before {
  position: absolute;
  width: 100%;
  height: 100%;
  content: '';
  inset: 1px;
  border-radius: 999px;
  border: 1px solid var(--accent-ghost);
  opacity: 0.65;
  z-index: -1;
}

.pill:hover {
  opacity: 0.9;
}
</style>
