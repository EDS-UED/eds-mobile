import { StyleSheet } from 'react-native';

import { mobileTheme } from '../../theme/index.js';

const spacing = mobileTheme.spacing as Record<string, number>;

/** 内容距屏幕左右 · spacing-5（20px）。 */
export const EG_PAGE_CONTENT_PADDING_HORIZONTAL = spacing['spacing-5'] ?? 20;
/** 默认内容距导航（栏底 / 系统避让后）· lg · 12px。 */
export const EG_PAGE_CONTENT_PADDING_TOP = spacing['spacing-3'] ?? 12;
/** 内容距屏幕底 · spacing-10（40px）。 */
export const EG_PAGE_CONTENT_PADDING_BOTTOM = spacing['spacing-10'] ?? 40;

/** Showcase / 业务「顶边距」档位 · 仅指导航占位之后的 content paddingTop。 */
export const EG_PAGE_CONTENT_PADDING_TOP_PRESETS = {
  xs: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
} as const;

export type EgPageContentPaddingTopPreset = keyof typeof EG_PAGE_CONTENT_PADDING_TOP_PRESETS;

export function resolveEgPageContentPaddingTopFromPreset(
  preset: EgPageContentPaddingTopPreset | 'custom',
  customPx?: number,
): number {
  if (preset === 'custom') {
    const n = Number(customPx);
    return Number.isFinite(n) && n >= 0 ? n : EG_PAGE_CONTENT_PADDING_TOP_PRESETS.lg;
  }
  return EG_PAGE_CONTENT_PADDING_TOP_PRESETS[preset] ?? EG_PAGE_CONTENT_PADDING_TOP_PRESETS.lg;
}

export function resolveEgPageScrollPaddingTop({
  contentInsetAdjustmentBehavior,
  topInset = 0,
  scrollTopInset,
  contentPaddingTop = EG_PAGE_CONTENT_PADDING_TOP,
}: {
  contentInsetAdjustmentBehavior: 'automatic' | 'never';
  topInset?: number;
  /** 顶栏占位（`egNavBarScrollContentReserve` 或 `EgPageShot` api）；不含内容顶距。 */
  scrollTopInset?: number;
  /** 业务覆盖 · 未传则用默认 lg（12px）。 */
  contentPaddingTop?: number;
}): number {
  if (contentInsetAdjustmentBehavior === 'automatic') {
    return contentPaddingTop;
  }
  const navReserve = scrollTopInset ?? (topInset > 0 ? topInset : 0);
  return navReserve + contentPaddingTop;
}

export function resolveEgPageScrollContentStyle({
  contentPaddingHorizontal = EG_PAGE_CONTENT_PADDING_HORIZONTAL,
  contentPaddingBottom = EG_PAGE_CONTENT_PADDING_BOTTOM,
}: {
  contentPaddingHorizontal?: number;
  contentPaddingBottom?: number;
} = {}) {
  return {
    paddingHorizontal: contentPaddingHorizontal,
    paddingBottom: contentPaddingBottom,
  };
}

/** 静态默认 · 业务未覆盖时使用。 */
export const egPageScrollContentStyle = StyleSheet.create({
  base: resolveEgPageScrollContentStyle(),
});