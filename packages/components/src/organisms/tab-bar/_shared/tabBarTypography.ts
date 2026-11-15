import type { TextStyle } from 'react-native';
import { presetBodyMediumHeavy } from '../../../shared/typographyStyles.js';
import { mobileTheme } from '../../../theme/index.js';
import { edsFontStyle } from '../../../shared/fontFamily.js';

const BODY_MEDIUM_HEAVY = presetBodyMediumHeavy();

const base = mobileTheme.typography.base;

export function tabBarLabelTypography(selected: boolean): TextStyle {
  const weightKey = selected ? 'weight-semibold' : 'weight-medium';
  return {
    fontSize: base['size-bar'] as number,
    lineHeight: base['line-height-bar'] as number,
    ...edsFontStyle(String(base[weightKey]) as TextStyle['fontWeight']),
  };
}

/**
 * EgTabBarText · iOS 26+ NativeTabs — `typography-body-medium-heavy`（17 · 600）。
 * 勿绑 `EDSText-*`（底栏中文会 □）；由 UIKit 系统 sans 渲染。
 */
export function tabBarTextNativeLabelStyle(): Pick<TextStyle, 'fontSize' | 'fontWeight'> {
  return {
    fontSize: BODY_MEDIUM_HEAVY.fontSize,
    fontWeight: '600',
  };
}

/** RN EgTabBarText — `typography-body-medium-heavy`（17 · 600）；flex 居中，不做 translate 上移。 */
export function tabBarTextLabelTypography(): TextStyle {
  return {
    ...BODY_MEDIUM_HEAVY,
    width: '100%',
    textAlign: 'center',
  };
}