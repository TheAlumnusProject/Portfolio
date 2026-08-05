import { ref, watch, onMounted } from 'vue';

export type ThemeName = 'blue' | 'monochrome' | 'matrix';

interface Theme {
  name: ThemeName;
  label: string;
  colors: {
    bg: string;
    bgSecondary: string;
    surface: string;
    surfaceStrong: string;
    text: string;
    muted: string;
    accent: string;
    accent2: string;
    accent3: string;
    accentWeak?: string;
    accentGhost?: string;
  };
}

const themes: Record<ThemeName, Theme> = {
  blue: {
    name: 'blue',
    label: 'Blue',
    colors: {
      bg: '#04050b',
      bgSecondary: '#0a1022',
      surface: 'rgba(8, 13, 28, 0.9)',
      surfaceStrong: 'rgba(13, 20, 39, 0.96)',
      text: '#f5f8ff',
      muted: '#96a5c8',
      accent: '#6ee7ff',
      accent2: '#ff7ad9',
      accent3: '#8b5cf6',
      accentWeak: 'rgba(110, 231, 255, 0.12)',
      accentGhost: 'rgba(110, 231, 255, 0.06)',
    },
  },
  monochrome: {
    name: 'monochrome',
    label: 'Monochrome',
    colors: {
      bg: '#0a0a0a',
      bgSecondary: '#141414',
      surface: 'rgba(15, 15, 15, 0.9)',
      surfaceStrong: 'rgba(20, 20, 20, 0.96)',
      text: '#f0f0f0',
      muted: '#808080',
      accent: '#e5e5e5',
      accent2: '#d0d0d0',
      accent3: '#c0c0c0',
      accentWeak: 'rgba(229, 229, 229, 0.08)',
      accentGhost: 'rgba(229, 229, 229, 0.04)',
    },
  },
  matrix: {
    name: 'matrix',
    label: 'Matrix',
    colors: {
      bg: '#0a0a0a',
      bgSecondary: '#141414',
      surface: 'rgba(15, 15, 15, 0.9)',
      surfaceStrong: 'rgba(20, 20, 20, 0.96)',
      text: '#00ff00',
      muted: '#008000',
      accent: '#00ff00',
      accent2: '#00cc00',
      accent3: '#009900',
      accentWeak: 'rgba(0, 255, 0, 0.08)',
      accentGhost: 'rgba(0, 255, 0, 0.04)',
    },
  },
};

const currentTheme = ref<ThemeName>('blue');

const applyTheme = (themeName: ThemeName) => {
  const theme = themes[themeName];
  const root = document.documentElement;

  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssVar, value);
  });

  currentTheme.value = themeName;
  localStorage.setItem('theme', themeName);
};

const toggleTheme = () => {
  const nextTheme = currentTheme.value === 'blue' ? 'monochrome' : currentTheme.value === 'monochrome' ? 'matrix' : 'blue';
  applyTheme(nextTheme);
};

const initTheme = () => {
  const savedTheme = (localStorage.getItem('theme') as ThemeName) || 'blue';
  if (themes[savedTheme]) {
    applyTheme(savedTheme);
  }
};

export const useTheme = () => {
  onMounted(() => {
    initTheme();
  });

  return {
    currentTheme,
    applyTheme,
    toggleTheme,
    themes: Object.values(themes),
  };
};
