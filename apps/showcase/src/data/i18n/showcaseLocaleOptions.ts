import { getShowcaseLocaleMeta, SHOWCASE_LOCALE_ORDER } from './showcaseLocaleCatalog';

/** 侧栏语言下拉 — 固定顺序。 */
export const SHOWCASE_LOCALE_OPTIONS = SHOWCASE_LOCALE_ORDER.map((id) => getShowcaseLocaleMeta(id));
