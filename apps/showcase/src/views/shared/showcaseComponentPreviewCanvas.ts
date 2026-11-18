import type { ViewStyle } from 'react-native';

import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

/**
 * 组件 / 令牌 / 动效详情 —「预览」内容区（`DocSection previewScreenFrame` 内层）。
 * 四周 `previewContentPadding`（spacing-5 · 20px）· 高度随内容 · 最小高度 120px。
 */
export const showcaseComponentPreviewContentStyle: ViewStyle = {
  alignSelf: 'stretch',
  width: '100%',
  minHeight: 120,
  padding: theme.layout.previewContentPadding,
  alignItems: 'center',
  justifyContent: 'center',
};

/** EgSwitch / EgDataList — 左对齐拉伸；居中会把轨宽收成「像 MD」。 */
export const showcaseTogglePreviewContentStyle: ViewStyle = {
  alignSelf: 'stretch',
  width: '100%',
  minHeight: 120,
  paddingHorizontal: theme.layout.previewContentPadding,
  paddingVertical: theme.layout.previewContentPadding,
  alignItems: 'stretch',
  justifyContent: 'flex-start',
};

/** EgDataList — 行须贴预览屏宽；勿用居中布局（否则收成「方块」）。 */
export const showcaseDataListPreviewContentStyle: ViewStyle = {
  alignSelf: 'stretch',
  width: '100%',
  minHeight: 120,
  paddingHorizontal: theme.layout.previewContentPadding,
  paddingVertical: theme.layout.previewContentPadding,
  alignItems: 'stretch',
  justifyContent: 'flex-start',
};