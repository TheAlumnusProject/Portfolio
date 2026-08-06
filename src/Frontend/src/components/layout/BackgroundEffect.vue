<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
import { ref, watch } from 'vue';
import Matrix from '@/components/three/Matrix.vue';

const { currentTheme, themes } = useTheme();

let effect = ref<string | undefined>(undefined);

const ThemeToFollow = watch(currentTheme, (newTheme) => {
  console.log('Theme changed to:', newTheme);
  const activeTheme = themes.find((theme) => theme.name === newTheme);
  effect.value = activeTheme?.backgroundEffect;
  if (effect.value == 'matrix-rain') {
    console.log('Matrix rain effect activated');
  }
});
</script>

<template>
  <div class="background">
    <Matrix v-if="effect === 'matrix-rain'" />
  </div>
</template>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
}
</style>
