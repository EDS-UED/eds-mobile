import { useCallback, useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { triggerGlassPressHaptic } from '../../../atoms/glass/glassPressHaptic.js';
import { followSlideIndicatorX, type SlideTrackSegmentLayout } from '../../../shared/slideTrackIndicator.js';
import { hitTestTabBarIndex } from '../../../organisms/tab-bar/_shared/tabBarHitTest.js';
import type { EgTabItem } from '../tab/EgTab.types.js';

const SWIPE_COMMIT_DISTANCE = 48;

type SharedNumber = ReturnType<typeof useSharedValue<number>>;
type LayoutsShared = ReturnType<typeof useSharedValue<SlideTrackSegmentLayout[]>>;

function adjacentEnabledIndex(items: EgTabItem[], from: number, direction: -1 | 1): number {
  let index = from;
  for (let step = 0; step < items.length; step += 1) {
    index += direction;
    if (index < 0 || index >= items.length) {
      return from;
    }
    if (!items[index]?.disabled) {
      return index;
    }
  }
  return from;
}

type UseEgTabSwipeGestureOptions = {
  items: EgTabItem[];
  selectedIndex: number;
  disabled: boolean;
  swipeEnabled: boolean;
  layoutsShared: LayoutsShared;
  indicatorX: SharedNumber;
  indicatorWidth: SharedNumber;
  snapToIndex: (index: number, animated: boolean) => void;
  selectIndex: (index: number) => void;
};

/** Tabs 行内 / 全宽区域水平滑 · 跟手下划线 + 左右甩动切 Tab。 */
export function useEgTabSwipeGesture({
  items,
  selectedIndex,
  disabled,
  swipeEnabled,
  layoutsShared,
  indicatorX,
  indicatorWidth,
  snapToIndex,
  selectIndex,
}: UseEgTabSwipeGestureOptions) {
  const finalizePan = useCallback(
    (translationX: number, pointerX: number) => {
      const layouts = layoutsShared.value;
      let index = hitTestTabBarIndex(pointerX, layouts);
      if (Math.abs(translationX) >= SWIPE_COMMIT_DISTANCE) {
        const direction = translationX < 0 ? 1 : -1;
        index = adjacentEnabledIndex(items, selectedIndex, direction);
      }
      if (index < 0 || index >= items.length || items[index]?.disabled) {
        snapToIndex(selectedIndex, true);
        return;
      }
      snapToIndex(index, true);
      if (index !== selectedIndex) {
        selectIndex(index);
        triggerGlassPressHaptic();
      }
    },
    [items, layoutsShared, selectIndex, selectedIndex, snapToIndex],
  );

  const gesture = useMemo(() => {
    return Gesture.Pan()
      .enabled(!disabled && swipeEnabled && items.length > 1)
      .activeOffsetX([-16, 16])
      .failOffsetY([-24, 24])
      .onUpdate((event) => {
        'worklet';
        followSlideIndicatorX(event.x, layoutsShared.value, indicatorX, indicatorWidth);
      })
      .onEnd((event) => {
        'worklet';
        scheduleOnRN(finalizePan, event.translationX, event.x);
      });
  }, [
    disabled,
    finalizePan,
    indicatorWidth,
    indicatorX,
    items.length,
    layoutsShared,
    swipeEnabled,
  ]);

  return gesture;
}
