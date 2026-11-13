import type { ViewProps } from 'react-native';

import { EgTabBar } from '../tab-bar/EgTabBar.js';
import { CREGIS_TAB_BAR_ITEMS } from './cregisTabBarPreset.js';
import type { EgCregisTabBarProps } from './EgCregisTabBar.types.js';

/**
 * Apply_TabBar@Cregis — `EgTabBar` + Cregis 四项。
 * iOS 26+ 不绘制，根 `_layout` 用 `EgCregisTabBarNativeLayout`。
 */
export function EgCregisTabBar(props: EgCregisTabBarProps & Pick<ViewProps, 'style'>) {
  const { items = CREGIS_TAB_BAR_ITEMS, testID = 'tab-bar-cregis', ...rest } = props;

  return (
    <EgTabBar {...rest} testID={testID} items={items} selectionAccent="brand" />
  );
}
