import { useCallback, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import {
  PAGE_OVERSHOOT_BLEED_RATIO,
  pageBackSpringConfig,
  pageDimOpacity,
  pageParallaxRatio,
  pagePushSpringConfig,
  pageShouldCommitBack,
} from './pageMotion.js';

export type PageProgress = { value: number };

const REDUCED_FADE_MS = 180;
const EDGE_SWIPE_WIDTH = 24;
export const PAGE_STACK_MAX_DEPTH = 3;

/**
 * motion-page 页面栈 · 每层独立进入进度（1 = 在位），出栈完成后再移除，移除不触发其他层跳帧。
 * `enters[i]` 驱动第 i 个推入页；被覆盖页由上一层进度推导视差与压暗。
 * `leaves[i]` = 第 i 层离场中（返回 / 侧滑）：被覆盖页改为整屏同速推回，入场仍为视差。
 */
export function usePageStack(reduceMotion: boolean) {
  const [stack, setStack] = useState<string[]>([]);
  const enter0 = useSharedValue(0);
  const enter1 = useSharedValue(0);
  const enter2 = useSharedValue(0);
  const none = useSharedValue(0);
  const enters: PageProgress[] = [enter0, enter1, enter2];
  const leave0 = useSharedValue(0);
  const leave1 = useSharedValue(0);
  const leave2 = useSharedValue(0);
  const leaves: PageProgress[] = [leave0, leave1, leave2];

  const removeTop = useCallback(() => setStack((prev) => prev.slice(0, -1)), []);

  /** 复位（侧滑取消）落位后再撤离场标记：此刻下层页已被盖住，切回视差不可见。 */
  const animateIn = (sv: PageProgress, velocity = 0, leaving?: PageProgress) => {
    const done = (finished?: boolean) => {
      'worklet';
      if (finished && leaving) leaving.value = 0;
    };
    sv.value = reduceMotion
      ? withTiming(1, { duration: REDUCED_FADE_MS }, done)
      : withSpring(1, { ...pagePushSpringConfig, velocity }, done);
  };

  const animateOut = (sv: PageProgress, leaving: PageProgress, velocity = 0) => {
    leaving.value = 1;
    const done = (finished?: boolean) => {
      'worklet';
      if (finished) scheduleOnRN(removeTop);
    };
    sv.value = reduceMotion
      ? withTiming(0, { duration: REDUCED_FADE_MS }, done)
      : withSpring(0, { ...pageBackSpringConfig, velocity }, done);
  };

  const push = (key: string) => {
    const depth = stack.length;
    if (depth >= PAGE_STACK_MAX_DEPTH) return;
    const sv = enters[depth]!;
    sv.value = 0;
    leaves[depth]!.value = 0;
    setStack((prev) => [...prev, key]);
    animateIn(sv);
  };

  const back = () => {
    if (stack.length === 0) return;
    animateOut(enters[stack.length - 1]!, leaves[stack.length - 1]!);
  };

  const finishSwipe = (commit: boolean, velocity: number) => {
    if (stack.length === 0) return;
    const index = stack.length - 1;
    const sv = enters[index]!;
    if (commit) animateOut(sv, leaves[index]!, velocity);
    else animateIn(sv, velocity, leaves[index]!);
  };

  /** 无动画清空（外层容器已收起时）。 */
  const reset = () => {
    for (const sv of [...enters, ...leaves]) sv.value = 0;
    setStack([]);
  };

  /** 第 `index` 层（-1 = 栈底页）被上一层覆盖的进度。 */
  const coverOf = (index: number): PageProgress =>
    index + 1 < stack.length ? enters[index + 1]! : none;
  /** 覆盖第 `index` 层的上一层是否离场中。 */
  const coverLeavingOf = (index: number): PageProgress =>
    index + 1 < stack.length ? leaves[index + 1]! : none;

  return { stack, enters, leaves, push, back, finishSwipe, reset, coverOf, coverLeavingOf, base: none };
}

/**
 * 页面栈单层 · 自右推入（`enter`）+ 被覆盖时视差左移压暗（`cover`）· 上层离场（`coverLeaving`）时整屏同速推回 · 左缘侧滑跟手。
 * 两侧外扩背景（bleed）覆盖 spring 过冲。
 */
export function PageStackLayer({
  enter,
  cover,
  coverLeaving,
  leaving,
  width,
  isTop,
  edgeSwipe,
  reduceMotion,
  background,
  dimColor,
  onSwipeEnd,
  children,
}: {
  enter: PageProgress | 'static';
  cover: PageProgress;
  coverLeaving: PageProgress;
  /** 本层离场标记（侧滑跟手期间置 1）。 */
  leaving: PageProgress | null;
  width: number;
  isTop: boolean;
  edgeSwipe: boolean;
  reduceMotion: boolean;
  background: string;
  dimColor: string;
  onSwipeEnd: (commit: boolean, velocity: number) => void;
  children: ReactNode;
}) {
  const bleed = width * PAGE_OVERSHOOT_BLEED_RATIO;
  const progress = enter === 'static' ? null : enter;

  const layerStyle = useAnimatedStyle(() => {
    const value = progress ? progress.value : 1;
    if (reduceMotion) {
      return { opacity: value, transform: [{ translateX: 0 }] };
    }
    return {
      opacity: 1,
      transform: [
        {
          translateX:
            (1 - value) * width -
            cover.value * width * (pageParallaxRatio + (1 - pageParallaxRatio) * coverLeaving.value),
        },
      ],
    };
  });
  const dimStyle = useAnimatedStyle(() => ({
    opacity: reduceMotion ? 0 : Math.min(1, Math.max(0, cover.value)) * pageDimOpacity,
  }));

  const swipe = Gesture.Pan()
    .enabled(isTop && edgeSwipe && progress !== null && !reduceMotion)
    .hitSlop({ left: 0, width: EDGE_SWIPE_WIDTH })
    .activeOffsetX(10)
    .failOffsetY([-12, 12])
    .onStart(() => {
      if (leaving) leaving.value = 1;
    })
    .onUpdate((event) => {
      if (progress) progress.value = 1 - Math.max(0, event.translationX) / width;
    })
    .onEnd((event) => {
      scheduleOnRN(
        onSwipeEnd,
        pageShouldCommitBack(event.translationX, event.velocityX, width),
        -event.velocityX / width,
      );
    });

  return (
    <GestureDetector gesture={swipe}>
      <Animated.View pointerEvents={isTop ? 'auto' : 'none'} style={[styles.layer, layerStyle]}>
        <View
          pointerEvents="none"
          style={[styles.edge, { left: -bleed, right: -bleed, backgroundColor: background }]}
        />
        {children}
        <Animated.View
          pointerEvents="none"
          style={[styles.edge, { left: -bleed, right: -bleed, backgroundColor: dimColor }, dimStyle]}
        />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
  },
  edge: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
});
