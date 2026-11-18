import {
  EgNavBar,
  type EgNavBarAction,
  type EgNavBarScrollEdgeEffect,
  type ThemeMode,
} from '@eds/mobile-components';
import type { ReactNode } from 'react';
import type { SharedValue } from 'react-native-reanimated';

type ShowcaseRnEgNavBarOverlayProps = {
  title: string;
  mode: ThemeMode;
  scrollOffset: SharedValue<number>;
  /** 滚入栏下后替换文字标题（如分段控制器）。 */
  titleContent?: ReactNode;
  showTitle?: boolean;
  showLeft?: boolean;
  showRight?: boolean;
  right?: EgNavBarAction;
  chromeContext?: 'stack' | 'overlay';
  scrollEdgeEffect?: EgNavBarScrollEdgeEffect;
  /** 仅显式联调 — 默认 iOS 26+ 走系统栏 hidden/soft，勿在 showcase 内页默认开启。 */
  forceRnOnIos26?: boolean;
  onBack?: () => void;
};

/**
 * RN 栈页顶栏 — `headerShown: false` + 浮层 `EgNavBar`。
 * iOS 26+ 内层默认系统 `UINavigationBar`；本浮层仅 Android · iOS ≤25（或 `forceRnOnIos26` 联调）。
 */
export function ShowcaseRnEgNavBarOverlay({
  title,
  mode,
  scrollOffset,
  titleContent,
  /** 内页默认 `true`；Tab 首页传 `scrollEdgeActive` 滚动后再显现。 */
  showTitle = true,
  showLeft = false,
  showRight = false,
  right,
  chromeContext = 'stack',
  scrollEdgeEffect,
  forceRnOnIos26 = false,
  onBack,
}: ShowcaseRnEgNavBarOverlayProps) {
  return (
    <EgNavBar
      title={title}
      titleContent={titleContent}
      mode={mode}
      chromeContext={chromeContext}
      forceRnImplementation={forceRnOnIos26}
      scrollEdgeEffect={scrollEdgeEffect}
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