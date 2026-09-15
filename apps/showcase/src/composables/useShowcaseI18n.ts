import { inject, watch, type InjectionKey, type Ref } from 'vue';
import {
  createShowcaseI18nRegistry,
  getShowcaseI18nRegistry,
} from '@/data/i18n/showcaseI18nRegistry';
import type { ShowcaseI18nRegistry, ShowcaseLocale } from '@/data/i18n/types';
import { DEFAULT_SHOWCASE_LOCALE } from '@/data/i18n/showcaseI18nText';

export const showcaseI18nKey: InjectionKey<Ref<ShowcaseLocale>> = Symbol('showcaseI18nLocale');

export function useShowcaseI18n() {
  const injectedLocale = inject(showcaseI18nKey, null);
  const registry = getShowcaseI18nRegistry();

  if (injectedLocale) {
    watch(
      injectedLocale,
      (nextLocale) => {
        registry.setLocale(nextLocale);
      },
      { immediate: true },
    );
  }

  return registry satisfies ShowcaseI18nRegistry;
}

export function createShowcaseI18nProvider(locale: ShowcaseLocale = DEFAULT_SHOWCASE_LOCALE) {
  return createShowcaseI18nRegistry(locale);
}
