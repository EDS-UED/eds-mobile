import { useCallback, useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const SWIPE_COMMIT_DISTANCE = 48;
const SWIPE_ACTIVE_OFFSET_X = 20;
const SWIPE_FAIL_OFFSET_Y = 28;

/** 正文区域左右滑切分段 · 与 `EgTabBlock` / `EgTab` 配合（不跟手拖指示器）。 */
export function useEgHorizontalSegmentSwipe<T extends string>(
  segments: readonly T[],
  selectedId: T,
  onSelect: (id: T) => void,
) {
  const selectedIndex = segments.indexOf(selectedId);
  const touchOriginX = useSharedValue(0);
  const touchOriginY = useSharedValue(0);

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
        .manualActivation(true)
        .cancelsTouchesInView(false)
        .onTouchesDown((event) => {
          'worklet';
          const touch = event.allTouches[0];
          if (touch != null) {
            touchOriginX.value = touch.x;
            touchOriginY.value = touch.y;
          }
        })
        .onTouchesMove((event, state) => {
          'worklet';
          const touch = event.allTouches[0];
          if (touch == null) {
            return;
          }
          const dx = touch.x - touchOriginX.value;
          const dy = touch.y - touchOriginY.value;
          if (Math.abs(dy) > SWIPE_FAIL_OFFSET_Y) {
            state.fail();
            return;
          }
          if (Math.abs(dx) > SWIPE_ACTIVE_OFFSET_X) {
            state.activate();
          }
        })
        .onEnd((event) => {
          'worklet';
          scheduleOnRN(commitSwipe, event.translationX);
        }),
    [commitSwipe, touchOriginX, touchOriginY],
  );
}
