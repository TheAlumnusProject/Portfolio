import { ref, watch, onMounted } from 'vue';

export type ThemeName = 'blue' | 'monochrome' | 'matrix' | 'persona';

interface Theme {
  name: ThemeName;
  label: string;
  colors: {
    bg: string;
    bg2: string;
    bgRadialColor1: string;
    bgRadialColor2: string;
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
  backgroundImage?: string;
  backgroundEffect?: string;
}

const themes: Record<ThemeName, Theme> = {
  blue: {
    name: 'blue',
    label: 'Blue',
    colors: {
      bg: '#04050b',
      bg2: '#0a1022',
      bgRadialColor1: 'rgba(110, 231, 255, 0.12)',
      bgRadialColor2: 'rgba(255, 122, 217, 0.16)',
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
      bg2: '#141414',
      bgRadialColor1: 'rgba(0, 0, 0, 0.12)',
      bgRadialColor2: 'rgba(255, 255, 255, 0.6)',
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
      bg2: '#141414',
      bgRadialColor1: 'rgba(0, 0, 0, 0.12)',
      bgRadialColor2: 'rgba(122, 255, 146, 0.16)',
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
    backgroundEffect: 'matrix-rain',
  },
  persona: {
    name: 'persona',
    label: 'Persona 5',
    colors: {
      bg: '#d92323',
      bg2: '#0d0d0d',
      bgRadialColor1: '#0d0d0d',
      bgRadialColor2: '#0d0d0d',

      surface: '#0d0d0d',
      surfaceStrong: '#0d0d0d',

      text: '#ffffff',
      muted: '#ffffff',

      accent: '#d92323',
      accent2: '#ffffff',
      accent3: '#732424',

      accentWeak: 'rgba(0, 0, 0, 0.22)',
      accentGhost: 'rgba(255, 255, 255, 0.4)',
    },

    backgroundEffect: 'persona-stars',
  },
};
const firstTheme = Object.keys(themes)[0] as ThemeName;

const currentTheme = ref<ThemeName>('blue');

const applyTheme = (themeName: ThemeName) => {
  const root = document.documentElement;

  if (themeName === firstTheme) {
    clearStyle(root);
    currentTheme.value = firstTheme;
    localStorage.removeItem('theme');
  } else {
    const theme = themes[themeName];
    setStyle(root, theme);
    currentTheme.value = themeName;
    localStorage.setItem('theme', themeName);
  }
};

const toggleTheme = () => {
  const allThemes = Object.keys(themes) as ThemeName[];
  const currentIndex = allThemes.indexOf(currentTheme.value);
  const nextIndex = (currentIndex + 1) % allThemes.length;
  const nextTheme = allThemes[nextIndex];
  if (nextTheme) applyTheme(nextTheme);
};

const initTheme = () => {
  const savedTheme = (localStorage.getItem('theme') as ThemeName) || 'blue';
  if (themes[savedTheme]) {
    applyTheme(savedTheme);
  }
};

const clearStyle = (root: HTMLElement) => {
  Object.keys(themes[firstTheme].colors).forEach((key) => {
    root.style.removeProperty(toCssVarName(key));
  });
};
const setStyle = (root: HTMLElement, theme: Theme) => {
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(toCssVarName(key), value);
  });
};

const toCssVarName = (key: string) => `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;

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
