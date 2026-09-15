import type { ShowcaseLocale } from './types';

export type ShowcaseLocaleMeta = {
  id: ShowcaseLocale;
  shortLabel: string;
  nativeLabel: string;
  direction: 'ltr' | 'rtl';
};

/** Mobile Showcase — en / 简中 / 繁中（与 types.SHOWCASE_LOCALES 一致）。 */
export const SHOWCASE_LOCALE_CATALOG: readonly ShowcaseLocaleMeta[] = [
  { id: 'zh-Hans', shortLabel: 'CN', nativeLabel: '简体中文', direction: 'ltr' },
  { id: 'en', shortLabel: 'EN', nativeLabel: 'English', direction: 'ltr' },
  { id: 'zh-Hant', shortLabel: 'TW', nativeLabel: '繁體中文', direction: 'ltr' },
] as const;

export const SHOWCASE_LOCALE_ORDER = SHOWCASE_LOCALE_CATALOG.map((entry) => entry.id);

const catalogById = Object.fromEntries(
  SHOWCASE_LOCALE_CATALOG.map((entry) => [entry.id, entry]),
) as Record<ShowcaseLocale, ShowcaseLocaleMeta>;

const SECONDARY_ZH: Record<ShowcaseLocale, string> = {
  'zh-Hans': '中文',
  en: '英语',
  'zh-Hant': '中文',
};

const SECONDARY_EN: Record<ShowcaseLocale, string> = {
  'zh-Hans': 'Simplified Chinese',
  en: 'English',
  'zh-Hant': 'Traditional Chinese',
};

export function getShowcaseLocaleMeta(id: ShowcaseLocale): ShowcaseLocaleMeta {
  return catalogById[id];
}

export function getShowcaseLocaleShortLabel(id: ShowcaseLocale): string {
  return getShowcaseLocaleMeta(id).shortLabel;
}

export function getShowcaseLocaleDirection(id: ShowcaseLocale): 'ltr' | 'rtl' {
  return getShowcaseLocaleMeta(id).direction;
}

export function getShowcaseLocaleSecondaryLabel(
  localeId: ShowcaseLocale,
  uiLocale: ShowcaseLocale,
): string {
  if (uiLocale === 'zh-Hans' || uiLocale === 'zh-Hant') {
    return SECONDARY_ZH[localeId];
  }
  return SECONDARY_EN[localeId];
}
