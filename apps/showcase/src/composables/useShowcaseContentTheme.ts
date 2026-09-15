import { inject, onMounted, provide, ref, watch, type InjectionKey, type Ref } from 'vue';
import { applyTheme, getPreferredTheme, type ThemeMode } from '@/stubs/eds-components';

const STORAGE_KEY = 'evergreen-theme';

export type ShowcaseContentThemeContext = {
  theme: Ref<ThemeMode>;
  toggleTheme: () => void;
  contentRef: Ref<HTMLElement | null>;
};

export const showcaseContentThemeKey: InjectionKey<ShowcaseContentThemeContext> =
  Symbol('showcaseContentTheme');

function readStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';

  const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  if (stored === 'light' || stored === 'dark') return stored;

  return getPreferredTheme();
}

function pinChromeThemeLight() {
  applyTheme('light');
}

export function provideShowcaseContentTheme() {
  const theme = ref<ThemeMode>(
    typeof window === 'undefined' ? 'light' : readStoredTheme(),
  );
  const contentRef = ref<HTMLElement | null>(null);

  onMounted(() => {
    pinChromeThemeLight();
  });

  watch(
    theme,
    (next) => {
      pinChromeThemeLight();
      localStorage.setItem(STORAGE_KEY, next);
    },
    { immediate: true },
  );

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  }

  const context: ShowcaseContentThemeContext = {
    theme,
    toggleTheme,
    contentRef,
  };

  provide(showcaseContentThemeKey, context);
  return context;
}

export function useShowcaseContentTheme() {
  const context = inject(showcaseContentThemeKey);
  if (!context) {
    throw new Error('useShowcaseContentTheme must be used within ShowcaseLayout');
  }
  return context;
}
