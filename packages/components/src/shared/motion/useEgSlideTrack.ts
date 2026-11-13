import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { triggerGlassPressHaptic } from '../../atoms/glass/glassPressHaptic.js';
import { hitTestTabBarIndex } from '../../organisms/tab-bar/_shared/tabBarHitTest.js';
import { glassPressScaleInSpringConfig, pressScaleOutSpringConfig } from '../pressScaleSpring.js';
import { slideCommitSpringConfig } from '../slideMotion.js';
import {
  followSlideIndicatorX,
  snapSlideIndicatorX,
  snapSlideIndicatorXWorklet,
  type SlideTrackSegmentLayout,
} from '../slideTrackIndicator.js';
import { motionGlassPressScale } from '../themeScalars.js';

const TRACK_PRESS_SCALE = motionGlassPressScale('sm');

/** 横向位移超过该值才进入跟手；否则按点击处理（松手弹簧滑入）。 */
const DRAG_FOLLOW_THRESHOLD = 8;

/**
 * 滑块距目标小于该值视为视觉落位，此时才回调 `onSelect`。
 * 业务侧 `onSelect` 常触发页面切换（挂载整棵视图树），与弹簧前半程同帧会掉帧。
 */
const COMMIT_ARRIVAL_PX = 1;

export type EgSlideTrackOptions = {
  /** 段数（与 `onSegmentLayout(index)` 挂载的段一致）。 */
  count: number;
  /** 当前选中段（受控）。 */
  selectedIndex: number;
  /** 滑块落位到新段后回调（标签高亮与触感在松手时已即时生效）。 */
  onSelect: (index: number) => void;
  disabled?: boolean;
  /** 按下整条缩放（glass press · sm）。默认 true。 */
  pressScale?: boolean;
  /** 拖动时滑块跟手；关闭后只在松手位置弹簧滑入。默认 true。 */
  followDrag?: boolean;
  haptic?: boolean;
};

function allSegmentsMeasured(layouts: SlideTrackSegmentLayout[], count: number): boolean {
  if (count <= 0) {
    return false;
  }
  for (let i = 0; i < count; i += 1) {
    const layout = layouts[i];
    if (layout == null || layout.width <= 0) {
      return false;
    }
  }
  return true;
}

/**
 * 水平滑选 track · `motion-slide`：
 * 点按整条缩放 + 滑块跟手 + 点击 / 松手 `slide-commit` 弹簧滑入，落位后再提交选中。
 * 用法：`GestureDetector gesture={gesture}` 包 track（`Animated.View style={trackAnimatedStyle}`），
 * 滑块 `Animated.View style={indicatorStyle}`，每段 `onLayout={onSegmentLayout(i)}`（x 相对 track）。
 */
export function useEgSlideTrack({
  count,
  selectedIndex,
  onSelect,
  disabled = false,
  pressScale = true,
  followDrag = true,
  haptic = true,
}: EgSlideTrackOptions) {
  const layoutsRef = useRef<SlideTrackSegmentLayout[]>([]);
  const placedRef = useRef(false);
  const layoutsShared = useSharedValue<SlideTrackSegmentLayout[]>([]);
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const trackScale = useSharedValue(1);
  const dragIndex = useSharedValue(-1);
  const dragging = useSharedValue(false);
  /** 滑块当前弹向的段；与受控 `selectedIndex` 相同时 JS 侧不再重起弹簧。 */
  const targetIndex = useSharedValue(selectedIndex);
  const selectedShared = useSharedValue(selectedIndex);
  /** 已松手、等滑块落位后提交的段；-1 表示无。 */
  const pendingCommit = useSharedValue(-1);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const selectedIndexRef = useRef(selectedIndex);
  selectedIndexRef.current = selectedIndex;
  const hapticRef = useRef(haptic);
  hapticRef.current = haptic;

  const snapTo = useCallback(
    (index: number, animated: boolean) => {
      targetIndex.value = index;
      snapSlideIndicatorX(index, layoutsRef.current, indicatorX, indicatorWidth, animated);
    },
    [indicatorWidth, indicatorX, targetIndex],
  );

  useEffect(() => {
    selectedShared.value = selectedIndex;
    if (placedRef.current && targetIndex.value !== selectedIndex && pendingCommit.value < 0) {
      snapTo(selectedIndex, true);
    }
  }, [pendingCommit, selectedIndex, selectedShared, snapTo, targetIndex]);

  const onSegmentLayout = useCallback(
    (index: number) => (event: LayoutChangeEvent) => {
      const { x, width } = event.nativeEvent.layout;
      const prev = layoutsRef.current[index];
      if (prev != null && prev.x === x && prev.width === width) {
        return;
      }
      layoutsRef.current[index] = { x, width };
      if (!allSegmentsMeasured(layoutsRef.current, count)) {
        return;
      }
      layoutsShared.value = layoutsRef.current.slice(0, count);
      const current = selectedIndexRef.current;
      if (!placedRef.current) {
        placedRef.current = true;
        snapTo(current, false);
        return;
      }
      if (index === current) {
        snapTo(current, true);
      }
    },
    [count, layoutsShared, snapTo],
  );

  const fireHaptic = useCallback(() => {
    if (hapticRef.current) {
      triggerGlassPressHaptic();
    }
  }, []);

  const commit = useCallback((index: number) => {
    setPreviewIndex(null);
    if (index >= 0 && index !== selectedIndexRef.current) {
      onSelectRef.current(index);
    }
  }, []);

  useAnimatedReaction(
    () => {
      const index = pendingCommit.value;
      if (index < 0) {
        return -1;
      }
      const layout = layoutsShared.value[index];
      if (!layout) {
        return index;
      }
      const arrived =
        Math.abs(indicatorX.value - layout.x) < COMMIT_ARRIVAL_PX &&
        Math.abs(indicatorWidth.value - layout.width) < COMMIT_ARRIVAL_PX;
      return arrived ? index : -1;
    },
    (arrivedIndex) => {
      if (arrivedIndex >= 0 && pendingCommit.value === arrivedIndex) {
        pendingCommit.value = -1;
        scheduleOnRN(commit, arrivedIndex);
      }
    },
  );

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!disabled && count > 0)
        .minDistance(0)
        .onBegin((event) => {
          'worklet';
          if (pressScale) {
            trackScale.value = withSpring(TRACK_PRESS_SCALE, glassPressScaleInSpringConfig);
          }
          dragging.value = false;
          const index = hitTestTabBarIndex(event.x, layoutsShared.value);
          dragIndex.value = index;
          if (index >= 0) {
            scheduleOnRN(setPreviewIndex, index);
          }
        })
        .onUpdate((event) => {
          'worklet';
          if (followDrag) {
            if (!dragging.value) {
              if (Math.abs(event.translationX) < DRAG_FOLLOW_THRESHOLD) {
                return;
              }
              dragging.value = true;
            }
            followSlideIndicatorX(event.x, layoutsShared.value, indicatorX, indicatorWidth);
          }
          const index = hitTestTabBarIndex(event.x, layoutsShared.value);
          if (index < 0 || index === dragIndex.value) {
            return;
          }
          dragIndex.value = index;
          scheduleOnRN(setPreviewIndex, index);
          if (followDrag) {
            scheduleOnRN(fireHaptic);
          }
        })
        .onFinalize(() => {
          'worklet';
          if (pressScale) {
            trackScale.value = withSpring(1, pressScaleOutSpringConfig);
          }
          const index = dragIndex.value;
          dragIndex.value = -1;
          dragging.value = false;
          if (index < 0) {
            scheduleOnRN(commit, index);
            return;
          }
          targetIndex.value = index;
          snapSlideIndicatorXWorklet(
            index,
            layoutsShared.value,
            indicatorX,
            indicatorWidth,
            true,
            slideCommitSpringConfig,
          );
          if (index === selectedShared.value) {
            pendingCommit.value = -1;
            scheduleOnRN(commit, index);
            return;
          }
          scheduleOnRN(fireHaptic);
          pendingCommit.value = index;
        }),
    [
      commit,
      count,
      disabled,
      dragIndex,
      dragging,
      fireHaptic,
      followDrag,
      indicatorWidth,
      indicatorX,
      layoutsShared,
      pendingCommit,
      pressScale,
      selectedShared,
      targetIndex,
      trackScale,
    ],
  );

  const trackAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trackScale.value }],
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
    opacity: indicatorWidth.value > 0 ? 1 : 0,
  }));

  return {
    gesture,
    trackAnimatedStyle,
    indicatorStyle,
    onSegmentLayout,
    /** 按住 / 拖动 / 落位前命中的段（提交后为 null）— 用于标签即时高亮。 */
    previewIndex,
  };
}
