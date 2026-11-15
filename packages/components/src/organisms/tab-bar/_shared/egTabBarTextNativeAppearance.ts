import {
  createScrollEdgeAppearanceFromOptions,
  createStandardAppearanceFromOptions,
} from 'expo-router/build/native-tabs/appearance.ios.js';

import { TAB_BAR_TEXT_NATIVE_TITLE_OFFSET_Y } from './tabBarMetrics.js';
import { tabBarTextNativeLabelStyle } from './tabBarTypography.js';

function egTabBarTextNativeTabAppearanceOptions() {
  const labelStyle = tabBarTextNativeLabelStyle();
  const titlePositionAdjustment = { vertical: TAB_BAR_TEXT_NATIVE_TITLE_OFFSET_Y };
  return {
    labelStyle,
    selectedLabelStyle: labelStyle,
    titlePositionAdjustment,
    selectedTitlePositionAdjustment: titlePositionAdjustment,
  };
}

/**
 * iOS 26+ 纯文案 Tab：`unstable_nativeProps` 覆盖 `standardAppearance` 时须走 Expo 转换链，
 * 才能把 `labelStyle`（17 · 600）写成 `tabBarItemTitleFontSize` / `FontWeight`。
 */
type EgTabBarTextNativeTriggerProps = {
  unstable_nativeProps: Record<string, unknown>;
};

export function egTabBarTextNativeTriggerProps(): EgTabBarTextNativeTriggerProps {
  const options = egTabBarTextNativeTabAppearanceOptions() as never;
  return {
    unstable_nativeProps: {
      ios: {
        standardAppearance: createStandardAppearanceFromOptions(options),
        scrollEdgeAppearance: createScrollEdgeAppearanceFromOptions(options),
      },
    },
  };
}