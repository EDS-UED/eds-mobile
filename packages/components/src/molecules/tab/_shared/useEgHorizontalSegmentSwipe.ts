import { useCallback, useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';

import {
  adjacentEnabledSegmentIndex,
  EG_HORIZONTAL_SEGMENT_SWIPE_ACTIVE_OFFSET_X,
  EG_HORIZONTAL_SEGMENT_SWIPE_FAIL_OFFSET_Y,
  resolveHorizontalSegmentSwipeStep,
} from './egHorizontalSegmentSwipeCommit.js';

/** 左右滑切分段 · Swipe / Fling · `EgTabBlock` / `EgTab` 正文与整区。 */
export function useEgHorizontalSegmentSwipe<T extends string>(
  segments: readonly T[],
  selectedId: T,
  onSelect: (id: T) => void,
  options?: { enabled?: boolean; isSegmentEnabled?: (index: number) => boolean },
) {
  const selectedIndex = segments.indexOf(selectedId);
  const enabled = options?.enabled ?? segments.length > 1;
  const isSegmentEnabled = options?.isSegmentEnabled;

  const commitSwipe = useCallback(
    (translationX: number, velocityX: number) => {
      if (selectedIndex < 0) {
        return;
      }
      const step = resolveHorizontalSegmentSwipeStep(translationX, velocityX);
      if (step === 0) {
        return;
      }
      const canSelect = isSegmentEnabled ?? (() => true);
      const targetIndex = adjacentEnabledSegmentIndex(
        segments.length,
        selectedIndex,
        step,
        canSelect,
      );
      if (targetIndex == null) {
        return;
      }
      onSelect(segments[targetIndex]!);
    },
    [isSegmentEnabled, onSelect, segments, selectedIndex],
  );

  return useMemo(
    () =>
      Gesture.Pan()
        .enabled(enabled)
        .activeOffsetX([
          -EG_HORIZONTAL_SEGMENT_SWIPE_ACTIVE_OFFSET_X,
          EG_HORIZONTAL_SEGMENT_SWIPE_ACTIVE_OFFSET_X,
        ])
        .failOffsetY([-EG_HORIZONTAL_SEGMENT_SWIPE_FAIL_OFFSET_Y, EG_HORIZONTAL_SEGMENT_SWIPE_FAIL_OFFSET_Y])
        .cancelsTouchesInView(false)
        .onEnd((event) => {
          'worklet';
          scheduleOnRN(commitSwipe, event.translationX, event.velocityX);
        }),
    [commitSwipe, enabled],
  );
}
