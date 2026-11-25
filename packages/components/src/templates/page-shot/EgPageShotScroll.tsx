import type { ReactNode } from 'react';
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import {
  Platform,
  ScrollView as RnScrollView,
  type LayoutChangeEvent,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, {
  runOnJS,
  scrollTo,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

const AnimatedScrollView = Reanimated.createAnimatedComponent(RnScrollView);

import { useEgPageShotPullBridge } from '../../shared/motion/egPageShotInteraction.js';
import { useEgNavBarScroll } from '../../organisms/tab-bar/nav-bar/useEgNavBarScroll.js';
import {
  EG_PAGE_SHOT_DISMISS_TOP_Y,
  EG_PAGE_SHOT_SCROLL_LEAVE_TOP_Y,
  resolveEgPageShotScrollBounces,
  resolveEgPageShotVerticalBounce,
} from './egPageShotScrollBounces.js';

export type EgPageShotScrollProps = Omit<ScrollViewProps, 'bounces' | 'overScrollMode'> & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
  /** 与 `EgPage.nativeScrollEdge` 同义 · 默认 `false`（弹层浮栏）。 */
  nativeScrollEdge?: boolean;
  /** 离顶后可底弹 · 默认 `true`；有下拉桥时停顶区关 `bounces`（无整轴「仅底弹」API）。 */
  scrollBounces?: boolean;
};

/**
 * `EgPageShot` 自定义滚动区 — 停顶区无顶弹；离顶且可滚时开 `bounces`（到底底弹）；停顶下拉由壳 Pan。
 * 滚动 / 收回插值走 UI 线程，避免 `scrollTo` 与 `bounces` 在 JS 帧上抖动。
 */
export function EgPageShotScroll({
  children,
  style,
  contentContainerStyle,
  scrollBounces = true,
  nativeScrollEdge = false,
  onLayout: onLayoutProp,
  onScroll: onScrollProp,
  scrollEventThrottle: scrollEventThrottleProp,
  ref: _ref,
  ...rest
}: EgPageShotScrollProps) {
  const {
    onContentSizeChange: onContentSizeChangeProp,
    showsVerticalScrollIndicator: showsVerticalScrollIndicatorProp,
    scrollEnabled: scrollEnabledProp,
    ...scrollRest
  } = rest;
  const navScroll = useEgNavBarScroll({ nativeScrollEdge });
  const pullBridge = useEgPageShotPullBridge();
  const indicatorUnlessClosing = showsVerticalScrollIndicatorProp ?? true;

  const scrollBouncesFlag = useSharedValue(scrollBounces);
  scrollBouncesFlag.value = scrollBounces;
  const scrollEnabledUser = useSharedValue(scrollEnabledProp ?? true);
  scrollEnabledUser.value = scrollEnabledProp ?? true;
  const showIndicatorDefault = useSharedValue(indicatorUnlessClosing);
  showIndicatorDefault.value = indicatorUnlessClosing;

  const animatedScrollRef = useAnimatedRef<{ scrollTo?: (options: { y: number; animated?: boolean }) => void }>();
  const scrollOffsetYRef = useRef(0);
  const contentHeightSv = useSharedValue(0);
  const layoutHeightSv = useSharedValue(0);
  const closeSyncLastYSv = useSharedValue(-1);

  useAnimatedReaction(
    () => {
      if (!pullBridge?.closingSv.value || !pullBridge.closeScrollArmedSv.value) return -1;
      return pullBridge.pageShotProgressSv.value;
    },
    (p) => {
      if (p < 0 || !pullBridge) return;
      const fromY = pullBridge.closeScrollStartYSv.value;
      if (fromY <= 0) return;
      const start = pullBridge.closeProgressStartSv.value;
      const ratio = Math.min(1, Math.max(0, p / start));
      const targetY = fromY * ratio;
      if (Math.abs(targetY - closeSyncLastYSv.value) < 0.5) return;
      closeSyncLastYSv.value = targetY;
      scrollTo(animatedScrollRef, 0, targetY, false);
      pullBridge.scrollOffsetYSv.value = targetY;
    },
    [pullBridge],
  );

  const handleContentSizeChange = useCallback(
    (w: number, h: number) => {
      contentHeightSv.value = h;
      onContentSizeChangeProp?.(w, h);
    },
    [contentHeightSv, onContentSizeChangeProp],
  );

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      layoutHeightSv.value = event.nativeEvent.layout.height;
      onLayoutProp?.(event);
    },
    [layoutHeightSv, onLayoutProp],
  );

  type ScrollEvent = Parameters<NonNullable<ScrollViewProps['onScroll']>>[0];

  const reportScrollOffset = useCallback(
    (x: number, y: number) => {
      scrollOffsetYRef.current = y;
      const event = { nativeEvent: { contentOffset: { x, y } } } as ScrollEvent;
      navScroll.onScroll(event);
      onScrollProp?.(event);
    },
    [navScroll.onScroll, onScrollProp],
  );

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        const { x, y } = event.contentOffset;
        if (pullBridge) {
          pullBridge.scrollOffsetYSv.value = y;
          pullBridge.scrollAtTopSv.value = y <= EG_PAGE_SHOT_DISMISS_TOP_Y;
        }
        runOnJS(reportScrollOffset)(x, y);
      },
    },
    [pullBridge, reportScrollOffset],
  );

  const staticBounces = resolveEgPageShotScrollBounces(
    scrollBounces,
    !navScroll.scrollEdgeActive,
    false,
  );

  const animatedScrollProps = useAnimatedProps<Record<string, unknown>>(() => {
    'worklet';
    if (!pullBridge) {
      return Platform.OS === 'android'
        ? { overScrollMode: (staticBounces ? 'always' : 'never') as 'always' | 'never' }
        : { bounces: staticBounces };
    }
    const settled = pullBridge.openSettledSv.value;
    const y = pullBridge.scrollOffsetYSv.value;
    const bounceOn =
      settled &&
      resolveEgPageShotVerticalBounce(
        scrollBouncesFlag.value,
        y,
        contentHeightSv.value,
        layoutHeightSv.value,
      );
    const scrollOn = settled && !pullBridge.closingSv.value && scrollEnabledUser.value;
    const showIndicator = showIndicatorDefault.value && !pullBridge.closingSv.value;
    const chrome = {
      scrollEnabled: scrollOn,
      showsVerticalScrollIndicator: showIndicator,
    };
    if (Platform.OS === 'android') {
      return {
        ...chrome,
        overScrollMode: (bounceOn ? 'always' : 'never') as 'always' | 'never',
      };
    }
    return {
      ...chrome,
      bounces: bounceOn,
    };
  });

  const handlePlainScroll = useCallback(
    (event: ScrollEvent) => {
      navScroll.onScroll(event);
      onScrollProp?.(event);
    },
    [navScroll.onScroll, onScrollProp],
  );

  const scrollProps = {
    style: [{ flex: 1, backgroundColor: 'transparent' }, style] as StyleProp<ViewStyle>,
    contentContainerStyle,
    contentInsetAdjustmentBehavior: 'never' as const,
    alwaysBounceVertical: false,
    onLayout: handleLayout,
    onContentSizeChange: handleContentSizeChange,
    scrollEventThrottle: scrollEventThrottleProp ?? navScroll.scrollEventThrottle,
    keyboardShouldPersistTaps: 'handled' as const,
    ...scrollRest,
    ...(pullBridge
      ? { scrollEnabled: scrollEnabledProp ?? true, showsVerticalScrollIndicator: indicatorUnlessClosing }
      : {
          onScroll: handlePlainScroll,
          scrollEnabled: scrollEnabledProp ?? true,
          showsVerticalScrollIndicator: indicatorUnlessClosing,
          ...(Platform.OS === 'android'
            ? { overScrollMode: (staticBounces ? 'always' : 'never') as 'always' | 'never' }
            : { bounces: staticBounces }),
        }),
  } as ScrollViewProps;

  const presentationSession = pullBridge?.chromeSession ?? -1;
  useLayoutEffect(() => {
    if (!pullBridge) return;
    scrollOffsetYRef.current = 0;
    pullBridge.scrollOffsetYSv.value = 0;
    pullBridge.scrollAtTopSv.value = true;
    closeSyncLastYSv.value = -1;
  }, [closeSyncLastYSv, pullBridge, presentationSession]);

  const scrollGestures = useMemo(() => {
    if (!pullBridge) return null;
    return Gesture.Simultaneous(pullBridge.scrollNative, pullBridge.scrollDismissDown);
  }, [pullBridge]);

  const scrollBody = pullBridge ? (
    <AnimatedScrollView
      ref={animatedScrollRef as never}
      animatedProps={animatedScrollProps}
      onScroll={scrollHandler}
      {...scrollProps}
    >
      {children}
    </AnimatedScrollView>
  ) : (
    <RnScrollView {...scrollProps}>{children}</RnScrollView>
  );

  if (!pullBridge || !scrollGestures) {
    return scrollBody;
  }

  return <GestureDetector gesture={scrollGestures}>{scrollBody}</GestureDetector>;
}