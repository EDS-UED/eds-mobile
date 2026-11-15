import { GlassBlurBackdrop } from '@eds/mobile-components/glass';
import type { ReactNode } from 'react';
import { Platform, StyleSheet } from 'react-native';

/**
 * Android — 页面滚动内容作 `EgNavBar` 毛玻璃（BlurGlass）采样源。
 * 顶栏须为本组件兄弟节点（BlurView 不可位于自身 target 内）。iOS 原样返回 children。
 */
export function ShowcaseNavBlurBackdrop({ children }: { children: ReactNode }) {
  if (Platform.OS !== 'android') {
    return <>{children}</>;
  }
  return (
    <GlassBlurBackdrop style={styles.fill}>
      {children}
    </GlassBlurBackdrop>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});