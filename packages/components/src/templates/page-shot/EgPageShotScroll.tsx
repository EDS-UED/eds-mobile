import type { ComponentRef, ReactNode, Ref } from 'react';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  ScrollView as RnScrollView,
  type LayoutChangeEvent,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector, ScrollView as GhsScrollView } from 'react-native-gesture-handler';
import { useAnimatedReaction, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { useEgPageShotPullBridge } from '../../shared/motion/egPageShotInteraction.js';
import { useEgNavBarScroll } from '../../organisms/tab-bar/nav-bar/useEgNavBarScroll.js';
import {
  EG_PAGE_SHOT_SCROLL_LEAVE_TOP_Y,
  resolveEgPageShotScrollBounces,
  resolveEgPageShotVerticalBounce,
} from './egPageShotScrollBounces.js';

/** 停顶 Fling 关页 · 与 `EgEdsAnimaPageShot` `PULL_FLING_VELOCITY_Y` 一致。 */
const SCROLL_FLING_DISMISS_VELOCITY_Y = 520;

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
  type ScrollViewNative = ComponentRef<typeof RnScrollView> & {
    setNativeProps?: (props: { showsVerticalScrollIndicator?: boolean }) => void;
  };
  const scrollRef = useRef<ScrollViewNative | null>(null);
  const scrollOffsetYRef = useRef(0);
  const [gesturesReady, setGesturesReady] = useState(false);
  const [scrollLocked, setScrollLocked] = useState(false);

  const applyScrollOffset = useCallback((y: number) => {
    const clamped = Math.max(0, y);
    if (Math.abs(scrollOffsetYRef.current - clamped) < 0.5) return;
    (scrollRef.current as { scrollTo?: (options: { y: number; animated?: boolean }) => void } | null)?.scrollTo?.({
      y: clamped,
      animated: false,
    });
    scrollOffsetYRef.current = clamped;
    if (pullBridge) pullBridge.scrollOffsetYSv.value = clamped;
  }, [pullBridge]);

  const applyScrollIndicator = useCallback(
    (closing: boolean) => {
      scrollRef.current?.setNativeProps?.({
        showsVerticalScrollIndicator: indicatorUnlessClosing && !closing,
      });
    },
    [indicatorUnlessClosing],
  );

  useAnimatedReaction(
    () => pullBridge?.openSettledSv.value ?? false,
    (settled, prev) => {
      if (settled === prev) return;
      scheduleOnRN(setGesturesReady, settled);
    },
    [pullBridge],
  );

  useAnimatedReaction(
    () => (pullBridge ? pullBridge.closingSv.value : false),
    (closing, prev) => {
      if (prev !== null && closing === prev) return;
      scheduleOnRN(applyScrollIndicator, closing);
      scheduleOnRN(setScrollLocked, closing);
    },
    [pullBridge, applyScrollIndicator],
  );

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
      scheduleOnRN(applyScrollOffset, fromY * ratio);
    },
    [pullBridge, applyScrollOffset],
  );

  const [scrollMetrics, setScrollMetrics] = useState({ contentHeight: 0, layoutHeight: 0 });
  const [verticalBounce, setVerticalBounce] = useState(false);

  const syncScrollChrome = useCallback(
    (y: number) => {
      scrollOffsetYRef.current = y;
      if (pullBridge) pullBridge.scrollOffsetYSv.value = y;
      if (!pullBridge) return;
      const atTop = y <= EG_PAGE_SHOT_SCROLL_LEAVE_TOP_Y;
      pullBridge.scrollAtTopSv.value = atTop;
      if (!gesturesReady) return;
      const nextBounce = resolveEgPageShotVerticalBounce(
        scrollBounces,
        y,
        scrollMetrics.contentHeight,
        scrollMetrics.layoutHeight,
      );
      setVerticalBounce((prev) => (prev === nextBounce ? prev : nextBounce));
    },
    [gesturesReady, pullBridge, scrollBounces, scrollMetrics.contentHeight, scrollMetrics.layoutHeight],
  );

  const handleContentSizeChange = useCallback(
    (_w: number, h: number) => {
      setScrollMetrics((prev) => (prev.contentHeight === h ? prev : { ...prev, contentHeight: h }));
    },
    [],
  );

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const h = event.nativeEvent.layout.height;
      setScrollMetrics((prev) => (prev.layoutHeight === h ? prev : { ...prev, layoutHeight: h }));
      onLayoutProp?.(event);
    },
    [onLayoutProp],
  );

  const handleContentSizeChangeWrapped = useCallback(
    (w: number, h: number) => {
      handleContentSizeChange(w, h);
      onContentSizeChangeProp?.(w, h);
    },
    [handleContentSizeChange, onContentSizeChangeProp],
  );

  type ScrollEvent = Parameters<NonNullable<ScrollViewProps['onScroll']>>[0];

  const handleScroll = useCallback(
    (event: ScrollEvent) => {
      navScroll.onScroll(event);
      onScrollProp?.(event);
      if (!pullBridge) return;
      syncScrollChrome(event.nativeEvent.contentOffset.y);
    },
    [navScroll.onScroll, onScrollProp, pullBridge, syncScrollChrome],
  );

  const handleScrollEndDrag = useCallback(
    (event: ScrollEvent) => {
      const y = event.nativeEvent.contentOffset.y;
      syncScrollChrome(y);
      if (!pullBridge) return;
      const native = event.nativeEvent as {
        contentOffset: { y: number };
        velocity?: { y: number };
      };
      const velocityY = native.velocity?.y ?? 0;
      if (y <= EG_PAGE_SHOT_SCROLL_LEAVE_TOP_Y && velocityY > SCROLL_FLING_DISMISS_VELOCITY_Y) {
        pullBridge.onFlingDismissAtTop(velocityY);
      }
    },
    [pullBridge, syncScrollChrome],
  );

  const handleMomentumScrollEnd = useCallback(
    (event: ScrollEvent) => {
      syncScrollChrome(event.nativeEvent.contentOffset.y);
    },
    [syncScrollChrome],
  );

  const bounces = pullBridge
    ? gesturesReady
      ? verticalBounce
      : false
    : resolveEgPageShotScrollBounces(scrollBounces, !navScroll.scrollEdgeActive, false);

  const scrollProps = {
    style: [{ flex: 1, backgroundColor: 'transparent' }, style] as StyleProp<ViewStyle>,
    contentContainerStyle,
    contentInsetAdjustmentBehavior: 'never' as const,
    bounces,
    alwaysBounceVertical: false,
    ...(Platform.OS === 'android'
      ? { overScrollMode: (bounces ? 'always' : 'never') as 'always' | 'never' }
      : null),
    onLayout: handleLayout,
    onContentSizeChange: handleContentSizeChangeWrapped,
    onScroll: handleScroll,
    onScrollEndDrag: handleScrollEndDrag,
    onMomentumScrollEnd: handleMomentumScrollEnd,
    scrollEventThrottle: scrollEventThrottleProp ?? navScroll.scrollEventThrottle,
    keyboardShouldPersistTaps: 'handled' as const,
    ...scrollRest,
    scrollEnabled: scrollLocked ? false : (scrollEnabledProp ?? true),
    showsVerticalScrollIndicator: indicatorUnlessClosing,
  } as ScrollViewProps;

  const { ref: _scrollRef, ...scrollPropsWithoutRef } = scrollProps;

  const presentationSession = pullBridge?.chromeSession ?? -1;
  useLayoutEffect(() => {
    if (!pullBridge) return;
    scrollOffsetYRef.current = 0;
    pullBridge.scrollOffsetYSv.value = 0;
  }, [pullBridge, presentationSession]);

  const scrollGestures = useMemo(() => {
    if (!pullBridge) return null;
    return gesturesReady
      ? Gesture.Simultaneous(pullBridge.scrollNative, pullBridge.scrollDismissDown)
      : pullBridge.scrollNative;
  }, [gesturesReady, pullBridge]);

  const scrollBody = (
    <RnScrollView
      ref={scrollRef as Ref<{ scrollTo: (options: { y: number; animated?: boolean }) => void }>}
      {...scrollPropsWithoutRef}
    >
      {children}
    </RnScrollView>
  );

  if (!pullBridge || !scrollGestures) {
    return scrollBody;
  }

  return <GestureDetector gesture={scrollGestures}>{scrollBody}</GestureDetector>;
}