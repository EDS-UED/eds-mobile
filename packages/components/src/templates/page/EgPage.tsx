import type { ComponentProps } from 'react';
import { useCallback } from 'react';
import { ScrollView, type StyleProp, type ViewStyle } from 'react-native';

import { useEgNavBarScroll } from '../../organisms/tab-bar/nav-bar/useEgNavBarScroll.js';
import { getThemeColors } from '../../theme/index.js';
import {
  EG_PAGE_CONTENT_PADDING_BOTTOM,
  EG_PAGE_CONTENT_PADDING_HORIZONTAL,
  EG_PAGE_CONTENT_PADDING_TOP,
  resolveEgPageScrollContentStyle,
  resolveEgPageScrollPaddingTop,
} from '../_shared/egPageContentLayout.js';
import type { EgPageProps } from './EgPage.types.js';

/**
 * Templates · 页面本体（motion-page 叠在导航栈上，业务只维护本组件内的内容）。
 *
 * 默认边距：左右 spacing-5 · 顶 lg 12px（+ 顶栏占位）· 底 spacing-10 40px。
 * 业务传 `contentPadding*` 或 `contentContainerStyle` 时以业务为准（后者同键后写覆盖）。
 */
export function EgPage({
  mode = 'light',
  children,
  style,
  contentContainerStyle,
  topInset = 0,
  scrollTopInset,
  contentInsetAdjustmentBehavior = 'automatic',
  nativeScrollEdge = true,
  onScroll,
  scrollEventThrottle,
  scrollViewRef,
  contentPaddingHorizontal,
  contentPaddingTop,
  contentPaddingBottom,
  ...rest
}: EgPageProps) {
  const colors = getThemeColors(mode);
  const navScroll = useEgNavBarScroll({ nativeScrollEdge });
  const handleScroll = useCallback(
    (event: Parameters<NonNullable<EgPageProps['onScroll']>>[0]) => {
      navScroll.onScroll(event);
      onScroll?.(event);
    },
    [navScroll.onScroll, onScroll],
  );
  const resolvedTop =
    contentPaddingTop ?? EG_PAGE_CONTENT_PADDING_TOP;
  const paddingTop = resolveEgPageScrollPaddingTop({
    contentInsetAdjustmentBehavior,
    topInset,
    scrollTopInset,
    contentPaddingTop: resolvedTop,
  });

  const rootStyle = [
    { flex: 1, backgroundColor: colors['box-page'] as string },
    style,
  ] as StyleProp<ViewStyle>;
  const contentStyle = [
    resolveEgPageScrollContentStyle({
      contentPaddingHorizontal:
        contentPaddingHorizontal ?? EG_PAGE_CONTENT_PADDING_HORIZONTAL,
      contentPaddingBottom: contentPaddingBottom ?? EG_PAGE_CONTENT_PADDING_BOTTOM,
    }),
    { paddingTop },
    contentContainerStyle,
  ] as StyleProp<ViewStyle>;

  return (
    <ScrollView
      ref={scrollViewRef as ComponentProps<typeof ScrollView>['ref']}
      style={rootStyle}
      contentContainerStyle={contentStyle}
      contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
      onScroll={handleScroll}
      scrollEventThrottle={scrollEventThrottle ?? navScroll.scrollEventThrottle}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}