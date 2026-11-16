import type { ViewStyle } from 'react-native';

/**
 * 组件 / 令牌 / 动效详情 —「预览」内容区（`DocSection previewScreenFrame` 内层）。
 * 高度随内容，不设 minHeight / flexGrow。
 */
export const showcaseComponentPreviewContentStyle: ViewStyle = {
  alignSelf: 'stretch',
  width: '100%',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
};