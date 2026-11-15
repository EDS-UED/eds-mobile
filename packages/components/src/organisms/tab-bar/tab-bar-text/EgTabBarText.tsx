import type { ViewProps } from 'react-native';

import type { EgTabBarTextProps } from './EgTabBarText.types.js';
import { buildEgTabBarTextItems } from './egTabBarTextPreset.js';
import { EgTabBarRn } from '../tab-bar/EgTabBarRn.js';

/**
 * TabBar · 纯文本项（无 icon）· Typography Body Small Heavy · 文案居中。
 * RN：与 EgTabBar 同壳/轨道/玻璃，仅无 icon、文案 body-medium-heavy（17 / 600）。iOS 26+ 根布局用 `EgTabBarNativeLayout` `itemPresentation="text"`。
 */
export function EgTabBarText(props: EgTabBarTextProps & Pick<ViewProps, 'style'>) {
  const { items: itemsProp, tabCount = 3, testID = 'tab-bar-text', ...rest } = props;
  const items = itemsProp ?? buildEgTabBarTextItems(tabCount);

  return (
    <EgTabBarRn
      {...rest}
      testID={testID}
      items={items}
      itemPresentation="text"
    />
  );
}