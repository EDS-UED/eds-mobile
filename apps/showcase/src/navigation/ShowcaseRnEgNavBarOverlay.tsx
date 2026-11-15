import { EgNavBar, type ThemeMode } from '@eds/mobile-components';
import type { SharedValue } from 'react-native-reanimated';

type ShowcaseRnEgNavBarOverlayProps = {
  title: string;
  mode: ThemeMode;
  scrollOffset: SharedValue<number>;
  showTitle?: boolean;
  showLeft?: boolean;
  onBack?: () => void;
};

/**
 * RN 栈页顶栏 — 与 `ShowcaseNavBarDemoView` 同构：`headerShown: false` + 浮层 `EgNavBar`
 *（RN 栏缺省 scroll edge `hard` · module 底线 · 非 Stack `header`）。
 * 仅 iOS ≤25 / Android；iOS 26+ 系统栏仍走 EgNavBar 缺省（hidden → soft）。
 */
export function ShowcaseRnEgNavBarOverlay({
  title,
  mode,
  scrollOffset,
  showTitle = true,
  showLeft = false,
  onBack,
}: ShowcaseRnEgNavBarOverlayProps) {
  return (
    <EgNavBar
      title={title}
      mode={mode}
      showLeft={showLeft}
      showRight={false}
      showTitle={showTitle}
      background="auto"
      scrollOffset={scrollOffset}
      left={
        showLeft && onBack
          ? {
              kind: 'icon',
              icon: 'eds-arrow-left-ios',
              accessibilityLabel: '返回',
              onPress: onBack,
            }
          : undefined
      }
    />
  );
}