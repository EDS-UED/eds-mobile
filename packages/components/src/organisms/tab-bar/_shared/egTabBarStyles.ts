import { StyleSheet } from 'react-native';

import {
  TAB_BAR_INNER_PADDING,
  TAB_BAR_ITEM_OVERLAP,
  TAB_BAR_PILL_RADIUS,
  TAB_BAR_SHELL_PADDING_H,
  TAB_BAR_SHELL_PADDING_TOP,
} from './tabBarMetrics.js';

export const egTabBarStyles = StyleSheet.create({
  shell: {
    paddingHorizontal: TAB_BAR_SHELL_PADDING_H,
    paddingTop: TAB_BAR_SHELL_PADDING_TOP,
    alignSelf: 'stretch' as const,
  },
  interaction: {
    alignSelf: 'stretch' as const,
  },
  glass: {
    alignSelf: 'stretch' as const,
    borderRadius: TAB_BAR_PILL_RADIUS,
  },
  track: {
    flexDirection: 'row' as const,
    alignItems: 'stretch' as const,
    padding: TAB_BAR_INNER_PADDING,
    position: 'relative',
  },
  selectionPill: {
    position: 'absolute',
    top: TAB_BAR_INNER_PADDING,
    bottom: TAB_BAR_INNER_PADDING,
    left: 0,
    borderRadius: TAB_BAR_PILL_RADIUS,
    zIndex: 0,
  },
  itemOverlap: {
    marginRight: -TAB_BAR_ITEM_OVERLAP,
  },
});
