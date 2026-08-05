<script setup lang="ts">
interface Props {
  eyebrow: string;
  heading: string;
  description: string;
}

defineProps<Props>();
</script>

<template>
  <div class="hero-copy">
    <p class="eyebrow">{{ eyebrow }}</p>
    <h1>{{ heading }}</h1>
    <p>{{ description }}</p>
    <slot />
  </div>
</template>

<style scoped>
.hero-copy {
  display: grid;
  gap: 0.75rem;
  max-width: 760px;
}

.eyebrow {
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.76rem;
  margin: 0;
}

h1 {
  font-size: clamp(2rem, 3.4vw, 3rem);
  line-height: 1.08;
  margin: 0;
  color: #f5f8ff;
}

p {
  color: #9db0d8;
  margin: 0;
}
</style>
