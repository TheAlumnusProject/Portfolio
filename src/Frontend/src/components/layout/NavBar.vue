<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ref } from 'vue';
import { useTheme } from '@/composables/useTheme';

const { currentTheme, toggleTheme, applyTheme, themes } = useTheme();
const showThemeMenu = ref(false);

const selectTheme = (name: string) => {
  applyTheme(name as any);
  showThemeMenu.value = false;
};

const links = [
  { label: 'Home', to: '/' },
  { label: 'Utility Hub', to: '/utility-hub' },
  { label: 'AI Studio', to: '/ai-studio' },
  { label: 'Showcase', to: '/showcase' },
  { label: 'People', to: '/people' },
  { label: 'Contact', to: '/contact' },
];
const width = links.length * 6.5 + 1.5; // 6.5rem per link + 1.5rem padding

const HandleClick = () => {
  const navShell = document.querySelector('.nav-shell') as HTMLElement;
  if (!navShell) return;

  navShell.classList.toggle('collapsed-nav');
};
</script>

<template>
  <div class="theme-wrapper">
    <button class="theme-toggle" @click="showThemeMenu = !showThemeMenu" :aria-expanded="showThemeMenu" :title="`Theme: ${currentTheme}`">
      <span class="theme-icon">◑</span>
    </button>

    <div v-if="showThemeMenu" class="theme-menu" @keydown.esc="showThemeMenu = false">
      <button v-for="t in themes" :key="t.name" class="theme-item" :class="{ active: currentTheme === t.name }" @click="selectTheme(t.name)">
        <span class="swatch" :style="{ background: t.colors ? t.colors.accent : 'transparent' }"></span>
        <span class="label">{{ t.label }}</span>
      </button>
    </div>
  </div>
  <header class="nav-shell">
    <nav class="nav-bar" :style="{ width: width + 'rem' }">
      <div class="brand" @click="HandleClick">
        <span class="brand-mark">T</span>
        <span class="brand-text">
          <span>
            <strong>The Alumnus Project</strong>
            <small>portfolio prototype</small>
          </span>
        </span>
      </div>

      <div class="nav-links">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="nav-link">
          {{ link.label }}
        </RouterLink>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.nav-shell {
  z-index: 20;
  padding: 1rem 0 0;
}

.nav-bar {
  position: fixed;
  z-index: 20;
  right: 0;
  max-width: 1280px;
  padding: 1rem 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  backdrop-filter: blur(24px);
  background: var(--surface-strong);
  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.45);
  transition:
    all 500ms ease,
    width 500ms ease 500ms;
  overflow: hidden;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  color: #f8fbff;
}
.brand:hover {
  cursor: pointer;
  opacity: 0.9;
  color: var(--accent);
}
.brand:hover .brand-mark {
  box-shadow: 0 0 50px var(--accent-weak);
}

.brand strong {
  display: block;
  font-size: 0.94rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.brand small {
  display: block;
  color: #8da2d4;
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.brand-mark {
  position: relative;
  display: grid;
  place-items: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  font-weight: 700;
  color: #06070c;
  background: linear-gradient(135deg, var(--accent), var(--accent2), var(--accent3));
  box-shadow: 0 0 30px var(--accent-weak);
}

.nav-links {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  transition:
    height 500ms ease,
    width 500ms ease 500ms;
  width: 100%;
  height: 2.4rem;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2.4rem;
  padding: 0.7rem 0.95rem;
  border-radius: 999px;
  font-size: 0.92rem;
  color: var(--muted);
  transition:
    all 180ms ease,
    opacity 500ms ease 800ms;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  inset: auto 0.7rem 0.4rem;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 180ms ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--text);
  background: var(--accent-weak);
  box-shadow: inset 0 0 0 1px var(--accent-ghost);
}

.nav-link.router-link-active::after {
  transform: scaleX(1);
}

.collapsed-nav .nav-bar {
  gap: 0;
  width: 20rem !important;
}
.collapsed-nav .nav-links {
  height: 0;
  opacity: 0;
  width: 0;
}
.collapsed-nav .nav-link {
  opacity: 0;
}
.theme-toggle {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 30;
  display: grid;
  place-items: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  font-size: 1.2rem;
  color: var(--text);
  background: var(--surface-strong);
  border: 1px solid var(--accent-ghost);
}

.theme-wrapper {
  position: fixed;
  top: 3.5rem;
  left: 1rem;
  z-index: 40;
}

.theme-menu {
  margin-top: 0.6rem;
  display: grid;
  gap: 0.35rem;
  padding: 0.5rem;
  background: var(--surface);
  border: 1px solid var(--accent-ghost);
  border-radius: 0.6rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  min-width: 10rem;
}

.theme-item {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  padding: 0.45rem 0.6rem;
  background: transparent;
  border: none;
  color: var(--text);
  cursor: pointer;
  border-radius: 0.45rem;
}

.theme-item:hover {
  background: var(--accent-weak);
}

.theme-item.active {
  outline: 2px solid var(--accent);
}

.swatch {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 1px solid var(--accent-ghost);
}

.label {
  font-size: 0.9rem;
  color: var(--text);
}
</style>
