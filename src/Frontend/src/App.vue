<script setup lang="ts">
import { RouterView } from 'vue-router';
import { onMounted, onUnmounted } from 'vue';
import NavBar from '@/components/layout/NavBar.vue';
import { useTheme } from '@/composables/useTheme';

// Initialize theme
useTheme();

const HandleScroll = () => {
  const navShell = document.querySelector('.nav-shell') as HTMLElement;
  if (!navShell) return;

  const scrollY = window.scrollY || window.pageYOffset;

  if (scrollY > 50) {
    navShell.classList.add('collapsed-nav');
  } else {
    navShell.classList.remove('collapsed-nav');
  }
};

onMounted(() => {
  window.addEventListener('scroll', HandleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', HandleScroll);
});
</script>

<template>
  <div class="app-shell">
    <NavBar />
    <main class="page-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  padding: 0 1rem 2rem;
}

.page-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.25rem 0 2rem;
}
</style>
