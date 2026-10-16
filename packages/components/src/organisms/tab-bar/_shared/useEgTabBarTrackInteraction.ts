import { useCallback, useMemo, useState } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { triggerGlassPressHaptic } from '../../../atoms/glass/glassPressHaptic.js';
import {
  glassPressScaleInSpringConfig,
  navigationSpringConfig,
  pressScaleOutSpringConfig,
} from '../../../shared/pressScaleSpring.js';
import { motionGlassPressScale } from '../../../shared/themeScalars.js';
import { hitTestTabBarIndex, layoutForTabIndex, type TabBarItemLayout } from './tabBarHitTest.js';

/** 整条 TabBar 按下 · md（无单 item scale）。 */
const barPressScale = motionGlassPressScale('sm');

type SharedNumber = ReturnType<typeof useSharedValue<number>>;

function snapTabBarIndicator(
  index: number,
  layouts: TabBarItemLayout[],
  indicatorX: SharedNumber,
  indicatorWidth: SharedNumber,
  animated: boolean,
): void {
  'worklet';
  const layout = layoutForTabIndex(layouts, index);
  if (!layout) {
    return;
  }
  if (animated) {
    indicatorX.value = withSpring(layout.x, navigationSpringConfig);
    indicatorWidth.value = withSpring(layout.width, navigationSpringConfig);
  } else {
    indicatorX.value = layout.x;
    indicatorWidth.value = layout.width;
  }
}

type UseEgTabBarTrackInteractionOptions = {
  disabled: boolean;
  layoutsShared: ReturnType<typeof useSharedValue<TabBarItemLayout[]>>;
  indicatorX: SharedNumber;
  indicatorWidth: SharedNumber;
  selectIndex: (index: number) => void;
  haptic?: boolean;
};

export function useEgTabBarTrackInteraction({
  disabled,
  layoutsShared,
  indicatorX,
  indicatorWidth,
  selectIndex,
  haptic = true,
}: UseEgTabBarTrackInteractionOptions) {
  const barScale = useSharedValue(1);
  const dragIndex = useSharedValue(-1);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const barAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: barScale.value }],
    }),
    [barScale],
  );

  const commitIndex = useCallback(
    (index: number) => {
      setPreviewIndex(null);
      if (index >= 0) {
        selectIndex(index);
      }
    },
    [selectIndex],
  );

  const setPreview = useCallback((index: number) => {
    setPreviewIndex(index);
  }, []);

  const fireHaptic = useCallback(() => {
    if (haptic) {
      triggerGlassPressHaptic();
    }
  }, [haptic]);

  const gesture = useMemo(() => {
    return Gesture.Pan()
      .enabled(!disabled)
      .minDistance(0)
      .onBegin((event) => {
        'worklet';
        barScale.value = withSpring(barPressScale, glassPressScaleInSpringConfig);
        const index = hitTestTabBarIndex(event.x, layoutsShared.value);
        if (index < 0) {
          return;
        }
        dragIndex.value = index;
        snapTabBarIndicator(index, layoutsShared.value, indicatorX, indicatorWidth, false);
        scheduleOnRN(setPreview, index);
        scheduleOnRN(fireHaptic);
      })
      .onUpdate((event) => {
        'worklet';
        const index = hitTestTabBarIndex(event.x, layoutsShared.value);
        if (index < 0 || index === dragIndex.value) {
          return;
        }
        dragIndex.value = index;
        snapTabBarIndicator(index, layoutsShared.value, indicatorX, indicatorWidth, false);
        scheduleOnRN(setPreview, index);
        scheduleOnRN(fireHaptic);
      })
      .onFinalize(() => {
        'worklet';
        barScale.value = withSpring(1, pressScaleOutSpringConfig);
        const index = dragIndex.value;
        dragIndex.value = -1;
        if (index >= 0) {
          snapTabBarIndicator(index, layoutsShared.value, indicatorX, indicatorWidth, true);
        }
        scheduleOnRN(commitIndex, index);
      });
  }, [
    barScale,
    commitIndex,
    disabled,
    dragIndex,
    fireHaptic,
    indicatorWidth,
    indicatorX,
    layoutsShared,
    setPreview,
  ]);

  return {
    barAnimatedStyle,
    gesture,
    previewIndex,
  };
};
