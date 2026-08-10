<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useTheme } from '@/composables/useTheme';
import type { ThemeName } from '@/composables/useTheme';

const route = useRoute();
const { currentTheme, toggleTheme, applyTheme, themes } = useTheme();
const showThemeMenu = ref(false);
const delayOnMobile = 5000;
const startupDelayOnMobile = 5000;

const selectTheme = (name: string) => {
  applyTheme(name as ThemeName);
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

const activeLink = (linkTo: string) => {
  if (linkTo === '/') {
    return route.path === linkTo;
  }
  return route.path.startsWith(linkTo);
};

const handleClick = () => {
  const navShell = document.querySelector('.nav-shell') as HTMLElement;
  if (!navShell) return;
  navShell.classList.toggle('collapsed-nav');
  if(!navShell.classList.contains('collapsed-nav'))
    hideAfterDelayOnMobile(delayOnMobile)
};

const hideAfterDelayOnMobile = (delay : number) => {
  if (window.innerWidth <= 640) {
    const navShell = document.querySelector('.nav-shell') as HTMLElement;
    if (!navShell) return;
    setTimeout(() => {
      navShell.classList.add('collapsed-nav');
    }, delay);
  }
}

onMounted(() => {
  hideAfterDelayOnMobile(startupDelayOnMobile);
});
</script>

<template>
  <div class="theme-wrapper">
    <button
      class="theme-toggle"
      @click="showThemeMenu = !showThemeMenu"
      :aria-expanded="showThemeMenu"
      :title="`Theme: ${currentTheme}`"
    >
      <span class="theme-icon">◑</span>
    </button>
    <div
      v-if="showThemeMenu"
      class="theme-menu"
      @keydown.esc="showThemeMenu = false"
    >
      <button
        v-for="t in themes"
        :key="t.name"
        class="theme-item"
        :class="{ active: currentTheme === t.name }"
        @click="selectTheme(t.name)"
      >
        <span
          class="swatch"
          :style="{ background: t.colors ? t.colors.accent : 'transparent' }"
        ></span>
        <span class="label">{{ t.label }}</span>
      </button>
    </div>
  </div>

  <header class="nav-shell">
    <nav class="nav-bar">
      <div class="brand" @click="handleClick">
        <span class="brand-mark">T</span>
        <span class="brand-text">
          <span>
            <strong>The Alumnus Project</strong>
            <small>portfolio prototype</small>
          </span>
        </span>
      </div>
      <div class="nav-links">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          :class="{ 'router-link-active': activeLink(link.to) }"
        >
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
  top: 1rem;
  right: 1rem;
  width: fit-content;
  max-width: min(1280px, calc(100vw - 2rem));
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
  flex-shrink: 0;
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
  flex-shrink: 0;
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
  min-height: 2.4rem;
  overflow: hidden;
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
  white-space: nowrap;
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

/* Collapsed state */
.collapsed-nav .nav-bar {
  gap: 0;
  width: 20rem !important;
}

.collapsed-nav .nav-links {
  height: 0;
  min-height: 0;
  opacity: 0;
  width: 0;
  pointer-events: none;
}

.collapsed-nav .nav-link {
  opacity: 0;
}

/* Theme toggle */
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
  cursor: pointer;
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

/* ========== Responsive ========== */

@media (max-width: 900px) {
  .nav-bar {
    right: 0.75rem;
    padding: 0.85rem 1rem;
    gap: 0.75rem;
  }

  .brand {
    gap: 0.65rem;
  }

  .brand strong {
    font-size: 0.85rem;
  }

  .brand small {
    font-size: 0.65rem;
  }

  .brand-mark {
    width: 2.15rem;
    height: 2.15rem;
  }

  .nav-links {
    gap: 0.35rem;
    min-height: 2.15rem;
    height: auto;
  }

  .nav-link {
    height: 2.15rem;
    padding: 0.55rem 0.75rem;
    font-size: 0.85rem;
  }

  .theme-toggle {
    width: 2.15rem;
    height: 2.15rem;
    font-size: 1.1rem;
  }

  .theme-wrapper {
    top: 3.25rem;
  }
  .collapsed-nav .nav-bar {
  gap: 0;
  width: auto !important;
}
}

@media (max-width: 640px) {
  .nav-bar {
    right: 0.5rem;
    left: auto;
    padding: 0.7rem 0.85rem;
    gap: 0.6rem;
    max-width: calc(100vw - 1rem);
  }

  .brand {
    gap: 0.5rem;
  }

  .brand strong {
    font-size: 0.78rem;
    letter-spacing: 0.06em;
  }

  .brand small {
    font-size: 0.6rem;
    letter-spacing: 0.12em;
  }

  .brand-mark {
    width: 2rem;
    height: 2rem;
    font-size: 0.9rem;
  }

  .nav-links {
    gap: 0.25rem;
    min-height: 2rem;
  }

  .nav-link {
    height: 2rem;
    padding: 0.4rem 0.6rem;
    font-size: 0.76rem;
  }

  .collapsed-nav .nav-bar {
    width: auto !important;
  }

  .theme-toggle {
    top: 0.75rem;
    left: 0.75rem;
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
  }

  .theme-wrapper {
    top: 3rem;
    left: 0.75rem;
  }

  .theme-menu {
    min-width: 9rem;
    padding: 0.4rem;
  }

  .theme-item {
    padding: 0.4rem 0.5rem;
  }

  .label {
    font-size: 0.85rem;
  }
}

@media (max-width: 420px) {
  .nav-bar {
    right: 0.4rem;
    padding: 0.6rem 0.7rem;
  }

  /* Hide brand text on very small screens to prevent overflow */
  .brand-text {
    display: none;
  }

  .brand-mark {
    width: 1.9rem;
    height: 1.9rem;
  }

  .nav-links {
    min-height: 1.9rem;
    flex-direction: column;
  }

  .nav-link {
    height: 1.9rem;
    padding: 0.35rem 0.5rem;
    font-size: 0.5rem;
  }

  .collapsed-nav .nav-bar {
    width: auto !important;
    padding: 0.55rem;
  }
}
</style>