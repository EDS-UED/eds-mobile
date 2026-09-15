import type { ShowcaseLocale } from './types';
import { toZhHant } from './toZhHant';

export function defineShowcaseI18nText(
  en: string,
  zhHans: string,
  zhHant?: string,
): import('./types').ShowcaseI18nText {
  return {
    en,
    'zh-Hans': zhHans,
    'zh-Hant': zhHant ?? toZhHant(zhHans),
  };
}

/** 英文组件名保留；简中 / 繁中可覆盖。 */
export function defineComponentName(
  en: string,
  zhHans?: string,
  zhHant?: string,
): import('./types').ShowcaseI18nText {
  const hans = zhHans ?? en;
  return defineShowcaseI18nText(en, hans, zhHant ?? (zhHans ? toZhHant(zhHans) : en));
}

export function mergeShowcaseI18nText(
  base: import('./types').ShowcaseI18nText,
  patch?: import('./types').ShowcaseI18nPartialText,
): import('./types').ShowcaseI18nText {
  if (!patch) return base;
  const zhHans = patch['zh-Hans'] ?? base['zh-Hans'];
  return {
    en: patch.en ?? base.en,
    'zh-Hans': zhHans,
    'zh-Hant': patch['zh-Hant'] ?? toZhHant(zhHans),
  };
}

export function resolveShowcaseI18nText(
  text: import('./types').ShowcaseI18nText | undefined,
  locale: ShowcaseLocale,
  fallback = '',
): string {
  if (!text) return fallback;
  return text[locale] || text['zh-Hans'] || text.en || fallback;
}

export const DEFAULT_SHOWCASE_LOCALE: ShowcaseLocale = 'zh-Hans';

export function isShowcaseLocale(value: string): value is ShowcaseLocale {
  return value === 'en' || value === 'zh-Hans' || value === 'zh-Hant';
}

/** 兼容 Desktop locale id 与旧 storage 值。 */
export function coerceShowcaseLocale(value: string): ShowcaseLocale {
  if (isShowcaseLocale(value)) return value;
  if (value === 'zh-CN' || value === 'zh') return 'zh-Hans';
  if (value === 'zh-TW' || value === 'zh-HK') return 'zh-Hant';
  if (value === 'en-US' || value.startsWith('en-')) return 'en';
  return DEFAULT_SHOWCASE_LOCALE;
}
