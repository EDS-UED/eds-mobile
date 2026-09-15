import { inject, provide, ref, watch, type InjectionKey, type Ref } from 'vue';
import { setShowcaseI18nLocale } from '@/data/i18n/showcaseI18nRegistry';
import {
  coerceShowcaseLocale,
  DEFAULT_SHOWCASE_LOCALE,
} from '@/data/i18n/showcaseI18nText';
import { getShowcaseLocaleDirection } from '@/data/i18n/showcaseLocaleCatalog';
import type { ShowcaseLocale } from '@/data/i18n/types';
import { showcaseI18nKey } from '@/composables/useShowcaseI18n';

const STORAGE_KEY = 'evergreen-mobile-showcase-locale';

export type ShowcaseLocaleContext = {
  locale: Ref<ShowcaseLocale>;
  setLocale: (next: ShowcaseLocale) => void;
};

export const showcaseLocaleKey: InjectionKey<ShowcaseLocaleContext> =
  Symbol('showcaseLocale');

function readStoredLocale(): ShowcaseLocale {
  if (typeof window === 'undefined') {
    return DEFAULT_SHOWCASE_LOCALE;
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return coerceShowcaseLocale(stored);
  }

  return DEFAULT_SHOWCASE_LOCALE;
}

function applyDocumentLocale(locale: ShowcaseLocale) {
  if (typeof document === 'undefined') {
    return;
  }
  document.documentElement.lang = locale;
  document.documentElement.dir = getShowcaseLocaleDirection(locale);
}

export function provideShowcaseLocale() {
  const locale = ref<ShowcaseLocale>(readStoredLocale());

  watch(
    locale,
    (next) => {
      setShowcaseI18nLocale(next);
      localStorage.setItem(STORAGE_KEY, next);
      applyDocumentLocale(next);
    },
    { immediate: true },
  );

  provide(showcaseI18nKey, locale);

  function setLocale(next: ShowcaseLocale) {
    locale.value = next;
  }

  const context: ShowcaseLocaleContext = {
    locale,
    setLocale,
  };

  provide(showcaseLocaleKey, context);
  return context;
}

export function useShowcaseLocale() {
  const context = inject(showcaseLocaleKey);
  if (!context) {
    throw new Error('useShowcaseLocale must be used within ShowcaseLayout');
  }
  return context;
}
