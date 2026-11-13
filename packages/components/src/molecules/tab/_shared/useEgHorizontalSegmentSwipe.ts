import { useCallback, useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';

const SWIPE_COMMIT_DISTANCE = 48;
const SWIPE_ACTIVE_OFFSET_X = 20;
/** 纵向先于横向阈值判失败 — 外层 ScrollView 才能接管上下滚动。 */
const SWIPE_FAIL_OFFSET_Y = 12;

/** 正文区域左右滑切分段 · 与 `EgTabBlock` / `EgTab` 配合（不跟手拖指示器）。 */
export function useEgHorizontalSegmentSwipe<T extends string>(
  segments: readonly T[],
  selectedId: T,
  onSelect: (id: T) => void,
) {
  const selectedIndex = segments.indexOf(selectedId);

  const commitSwipe = useCallback(
    (translationX: number) => {
      if (selectedIndex < 0) {
        return;
      }
      if (translationX <= -SWIPE_COMMIT_DISTANCE && selectedIndex < segments.length - 1) {
        onSelect(segments[selectedIndex + 1]!);
        return;
      }
      if (translationX >= SWIPE_COMMIT_DISTANCE && selectedIndex > 0) {
        onSelect(segments[selectedIndex - 1]!);
      }
    },
    [onSelect, segments, selectedIndex],
  );

  return useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-SWIPE_ACTIVE_OFFSET_X, SWIPE_ACTIVE_OFFSET_X])
        .failOffsetY([-SWIPE_FAIL_OFFSET_Y, SWIPE_FAIL_OFFSET_Y])
        .cancelsTouchesInView(false)
        .onEnd((event) => {
          'worklet';
          scheduleOnRN(commitSwipe, event.translationX);
        }),
    [commitSwipe],
  );
}
