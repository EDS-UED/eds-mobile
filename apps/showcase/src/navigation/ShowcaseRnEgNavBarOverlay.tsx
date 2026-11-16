import { EgNavBar, type EgNavBarAction, type ThemeMode } from '@eds/mobile-components';
import type { SharedValue } from 'react-native-reanimated';

type ShowcaseRnEgNavBarOverlayProps = {
  title: string;
  mode: ThemeMode;
  scrollOffset: SharedValue<number>;
  showTitle?: boolean;
  showLeft?: boolean;
  showRight?: boolean;
  right?: EgNavBarAction;
  onBack?: () => void;
};

/**
 * RN 栈页顶栏 — 与 `ShowcaseNavBarDemoView` 同构：`headerShown: false` + 浮层 `EgNavBar`
 *（RN 栏页面栈 scroll edge 缺省 `soft` · 非 Stack `header`）。
 * 仅 iOS ≤25 / Android；iOS 26+ 系统栏 `useEgNavBarScroll`（静止 hidden · 滚入 soft）。
 */
export function ShowcaseRnEgNavBarOverlay({
  title,
  mode,
  scrollOffset,
  showTitle = true,
  showLeft = false,
  showRight = false,
  right,
  onBack,
}: ShowcaseRnEgNavBarOverlayProps) {
  return (
    <EgNavBar
      title={title}
      mode={mode}
      showLeft={showLeft}
      showRight={showRight}
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
      right={right}
    />
  );
}