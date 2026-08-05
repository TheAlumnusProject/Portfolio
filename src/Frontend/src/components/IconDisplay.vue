<script setup lang="ts">
interface Props {
  icon: string;
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}

withDefaults(defineProps<Props>(), {
  size: 'md',
});

const sizeClass = {
  sm: 'icon-sm',
  md: 'icon-md',
  lg: 'icon-lg',
};

const getIconPath = (icon: string) => {
  return new URL(`../assets/icons/${icon}.svg`, import.meta.url).href;
};
</script>

<template>
  <img :src="getIconPath(icon)" :alt="icon" :class="[sizeClass[size], 'icon', $attrs.class]" />
</template>

<style scoped>
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: currentColor;
}

.icon-sm {
  width: 1rem;
  height: 1rem;
}

.icon-md {
  width: 1.5rem;
  height: 1.5rem;
}

.icon-lg {
  width: 2.5rem;
  height: 2.5rem;
}
</style>
