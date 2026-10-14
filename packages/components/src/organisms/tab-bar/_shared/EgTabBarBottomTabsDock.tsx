import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, ViewStyle } from 'react-native';

type EgTabBarBottomTabsDockProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

/**
 * Bottom Tabs / Expo Router `tabBar` 根容器 — 贴屏幕下沿，勿再包一层 bottom padding（safe area 在 EgTabBar 内）。
 */
export function EgTabBarBottomTabsDock({ children, style }: EgTabBarBottomTabsDockProps) {
  return (
    <View pointerEvents="box-none" style={StyleSheet.flatten([styles.dock, style])}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    overflow: 'visible',
    zIndex: 100,
  },
});
