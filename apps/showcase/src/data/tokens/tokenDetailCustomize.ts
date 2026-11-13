import type { DocCustomizeControl } from '@/data/components';
import type { TokenEntry } from '@/data/tokens/tokenCatalogTypes';

const PRESS_INTENSITY_OPTIONS = [
  { label: 'xs', value: 'xs' },
  { label: 'sm', value: 'sm' },
  { label: 'md', value: 'md' },
  { label: 'lg', value: 'lg' },
] as const;

export function isMotionPressPreviewToken(
  categoryId: string,
  entry: Pick<TokenEntry, 'name' | 'layer'>,
): boolean {
  if (categoryId !== 'motion') {
    return false;
  }
  if (entry.name === 'motion-press' || entry.name === 'press') {
    return true;
  }
  if (entry.layer === 'base' && entry.name.startsWith('motion-scale-press-')) {
    return true;
  }
  return false;
}

export function isMotionSlidePreviewToken(
  categoryId: string,
  entry: Pick<TokenEntry, 'name' | 'layer'>,
): boolean {
  if (categoryId !== 'motion') {
    return false;
  }
  return entry.name === 'motion-slide' || entry.name === 'slide';
}

export function isMotionLayoutContentPreviewToken(
  categoryId: string,
  entry: Pick<TokenEntry, 'name' | 'layer'>,
): boolean {
  if (categoryId !== 'motion') {
    return false;
  }
  return (
    entry.layer === 'semantic' &&
    (entry.name === 'motion-layout-content' || entry.name === 'layout-content')
  );
}

export function isMotionMenuPreviewToken(
  categoryId: string,
  entry: Pick<TokenEntry, 'name' | 'layer'>,
): boolean {
  if (categoryId !== 'motion') {
    return false;
  }
  return (
    entry.name === 'motion-menu' ||
    entry.name === 'menu' ||
    entry.name === 'menu-dismiss'
  );
}

export function isMotionSheetsPreviewToken(
  categoryId: string,
  entry: Pick<TokenEntry, 'name' | 'layer'>,
): boolean {
  if (categoryId !== 'motion') {
    return false;
  }
  return (
    entry.name === 'motion-sheets' ||
    entry.name === 'sheets' ||
    entry.name === 'sheets-detent' ||
    entry.name === 'sheets-dismiss'
  );
}

export function isMotionPagePreviewToken(
  categoryId: string,
  entry: Pick<TokenEntry, 'name' | 'layer'>,
): boolean {
  if (categoryId !== 'motion') {
    return false;
  }
  return entry.name === 'motion-page' || entry.name === 'page' || entry.name === 'page-back';
}

export function isMotionPageShotPreviewToken(
  categoryId: string,
  entry: Pick<TokenEntry, 'name' | 'layer'>,
): boolean {
  if (categoryId !== 'motion') {
    return false;
  }
  return (
    entry.name === 'motion-page-shot' ||
    entry.name === 'page-shot' ||
    entry.name === 'page-shot-dismiss'
  );
}

export function resolveTokenDetailCustomizeControls(
  categoryId: string,
  entry: TokenEntry,
): DocCustomizeControl[] {
  if (isMotionSlidePreviewToken(categoryId, entry)) {
    return [
      { kind: 'boolean', key: 'slidePressScale', label: '点按缩放', row: 0 },
      { kind: 'boolean', key: 'slideFollowDrag', label: '胶囊跟手', row: 0 },
    ];
  }

  if (isMotionPagePreviewToken(categoryId, entry)) {
    return [
      { kind: 'heading', key: 'pageDirectionHeading', label: '方向' },
      {
        kind: 'boolean',
        key: 'pageHorizontal',
        label: '左右',
        exclusiveKeys: ['pageHorizontalReverse', 'pageVertical'],
      },
      {
        kind: 'boolean',
        key: 'pageHorizontalReverse',
        label: '右左',
        exclusiveKeys: ['pageHorizontal', 'pageVertical'],
      },
      {
        kind: 'boolean',
        key: 'pageVertical',
        label: '上下',
        exclusiveKeys: ['pageHorizontal', 'pageHorizontalReverse'],
      },
      { kind: 'heading', key: 'pageGestureHeading', label: '手势' },
      { kind: 'boolean', key: 'pageDragDismiss', label: '拖拽关闭' },
    ];
  }

  if (!isMotionPressPreviewToken(categoryId, entry)) {
    return [];
  }

  return [
    {
      kind: 'select',
      key: 'pressIntensity',
      label: '点按强度',
      options: PRESS_INTENSITY_OPTIONS.map((option) => ({
        label: option.label,
        value: option.value,
      })),
    },
    {
      kind: 'select',
      key: 'pressScaleDirection',
      label: '缩放方向',
      options: [
        { label: '放大', value: 'up' },
        { label: '缩小', value: 'down' },
      ],
    },
  ];
}

export type TokenDetailCustomizeState = {
  pressIntensity: 'xs' | 'sm' | 'md' | 'lg';
  pressScaleDirection: 'up' | 'down';
  slidePressScale: boolean;
  slideFollowDrag: boolean;
  pageHorizontal: boolean;
  pageHorizontalReverse: boolean;
  pageVertical: boolean;
  pageDragDismiss: boolean;
};

export function defaultTokenDetailCustomizeState(): TokenDetailCustomizeState {
  return {
    pressIntensity: 'sm',
    pressScaleDirection: 'up',
    slidePressScale: true,
    slideFollowDrag: true,
    pageHorizontal: true,
    pageHorizontalReverse: false,
    pageVertical: false,
    pageDragDismiss: true,
  };
}

const PAGE_DIRECTION_KEYS = ['pageHorizontal', 'pageHorizontalReverse', 'pageVertical'] as const;
type PageDirectionKey = (typeof PAGE_DIRECTION_KEYS)[number];

/** 页面方向：左右 / 右左 / 上下互斥且恒有一项开启（关掉当前项即回到左右）。 */
export function mergePageDirection(
  prev: TokenDetailCustomizeState,
  next: Record<string, unknown>,
): Pick<TokenDetailCustomizeState, PageDirectionKey> {
  const pick = (active: PageDirectionKey) =>
    Object.fromEntries(PAGE_DIRECTION_KEYS.map((key) => [key, key === active])) as Pick<
      TokenDetailCustomizeState,
      PageDirectionKey
    >;
  const turnedOn = PAGE_DIRECTION_KEYS.find((key) => next[key] === true && !prev[key]);
  if (turnedOn) return pick(turnedOn);
  const turnedOff = PAGE_DIRECTION_KEYS.find((key) => next[key] === false && prev[key]);
  if (turnedOff) return pick('pageHorizontal');
  return pick(PAGE_DIRECTION_KEYS.find((key) => prev[key]) ?? 'pageHorizontal');
}

/** 定制态 → `EgEdsAnimaPage({ direction })`。 */
export function pageDirectionOf(
  state: TokenDetailCustomizeState,
): 'horizontal' | 'horizontal-reverse' | 'vertical' {
  if (state.pageVertical) return 'vertical';
  return state.pageHorizontalReverse ? 'horizontal-reverse' : 'horizontal';
}
