<script setup lang="ts">
interface Props {
  heading: string;
  subheading: string;
  description: string;
}

defineProps<Props>();
</script>

<template>
  <div class="hero-copy">
    <h1>{{ heading }}</h1>
    <p class="subheading">{{ subheading }}</p>
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

h1 {
  font-size: clamp(2rem, 3.4vw, 3rem);
  line-height: 1.08;
  margin: 0;
  color: #f5f8ff;
}

.subheading {
  color: var(--accent);
  font-size: clamp(1.05rem, 1.6vw, 1.3rem);
  font-weight: 500;
  line-height: 1.3;
  margin: 0;
}

p {
  color: #9db0d8;
  margin: 0;
}
</style>
