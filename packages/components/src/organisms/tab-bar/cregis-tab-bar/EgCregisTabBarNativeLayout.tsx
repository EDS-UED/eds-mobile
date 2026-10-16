import { getThemeColors, resolveThemeMode, type ThemeMode } from '../../../theme/index.js';
import { egTabBarNativeActiveTintColor } from '../_shared/tabBarSelectionAccent.js';
import { EgTabBarNativeLayout } from '../tab-bar/EgTabBarNativeLayout.js';
import type { EgTabBarNativeLayoutProps } from '../tab-bar/EgTabBarNativeLayout.types.js';
import { CREGIS_TAB_BAR_NATIVE_TABS } from './cregisTabBarNativePreset.js';

export type EgCregisTabBarNativeLayoutProps = Omit<EgTabBarNativeLayoutProps, 'tabs'> & {
  /** 默认 `CREGIS_TAB_BAR_NATIVE_TABS`（Cregis 四项） */
  tabs?: EgTabBarNativeLayoutProps['tabs'];
};

/**
 * iOS 26+ — Apply_TabBar@Cregis 原生栈。
 * 须在 Expo Router 根 `_layout` 与文件路由并列；系统承担 Tab 条材质、动效与交互。
 */
export function EgCregisTabBarNativeLayout({
  tabs = CREGIS_TAB_BAR_NATIVE_TABS,
  mode: modeProp,
  tintColor: tintColorProp,
  ...rest
}: EgCregisTabBarNativeLayoutProps) {
  const mode: ThemeMode = modeProp ?? resolveThemeMode(undefined);
  const colors = getThemeColors(mode);
  const tintColor =
    tintColorProp ?? egTabBarNativeActiveTintColor(colors, 'decor');

  return (
    <EgTabBarNativeLayout tabs={tabs} mode={mode} tintColor={tintColor} {...rest} />
  );
}
