import type { ViewStyle } from 'react-native';

import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

/**
 * 组件 / 令牌 / 动效详情 —「预览」内容区（`DocSection previewScreenFrame` 内层）。
 * 最小高度 120px · 左右 `previewContentPadding`（spacing-5 · 20px）· 不加额外上下 padding。
 */
export const showcaseComponentPreviewContentStyle: ViewStyle = {
  alignSelf: 'stretch',
  width: '100%',
  minHeight: 120,
  paddingHorizontal: theme.layout.previewContentPadding,
  alignItems: 'center',
  justifyContent: 'center',
};