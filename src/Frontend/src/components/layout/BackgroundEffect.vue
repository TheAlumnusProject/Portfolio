<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
import { ref, watch } from 'vue';
import Matrix from '@/components/three/Matrix.vue';
import PersonaStars from '@/components/PersonaStars.vue';
const { currentTheme, themes } = useTheme();

let effect = ref<string | undefined>(undefined);

const ThemeToFollow = watch(currentTheme, (newTheme) => {
  console.log('Theme changed to:', newTheme);
  const activeTheme = themes.find((theme) => theme.name === newTheme);
  effect.value = activeTheme?.backgroundEffect;
    console.log('Theme changed, effect set to:', effect.value);
});
</script>

<template>
  <div class="background">
    <Matrix v-if="effect === 'matrix-rain'" />
    <PersonaStars v-if="effect === 'persona-stars'" />
  </div>
</template>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -5;
  overflow: hidden;
}
</style>
