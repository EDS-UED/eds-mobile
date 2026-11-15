export const EG_HORIZONTAL_SEGMENT_SWIPE_COMMIT_DISTANCE = 48;
export const EG_HORIZONTAL_SEGMENT_SWIPE_ACTIVE_OFFSET_X = 20;
export const EG_HORIZONTAL_SEGMENT_SWIPE_FAIL_OFFSET_Y = 12;
/** 快速甩动（Fling）· 水平速度阈值 (px/s)。 */
export const EG_HORIZONTAL_SEGMENT_FLING_VELOCITY_X = 450;

/**
 * 左右滑切下一分段方向 · Swipe 位移达标或 Fling 速度达标则切 adjacent。
 * @returns `-1` 上一项 · `1` 下一项 · `0` 不切
 */
export function resolveHorizontalSegmentSwipeStep(
  translationX: number,
  velocityX: number,
): -1 | 0 | 1 {
  if (
    translationX <= -EG_HORIZONTAL_SEGMENT_SWIPE_COMMIT_DISTANCE ||
    velocityX <= -EG_HORIZONTAL_SEGMENT_FLING_VELOCITY_X
  ) {
    return 1;
  }
  if (
    translationX >= EG_HORIZONTAL_SEGMENT_SWIPE_COMMIT_DISTANCE ||
    velocityX >= EG_HORIZONTAL_SEGMENT_FLING_VELOCITY_X
  ) {
    return -1;
  }
  return 0;
}

export function adjacentEnabledSegmentIndex(
  length: number,
  fromIndex: number,
  direction: -1 | 1,
  isEnabled: (index: number) => boolean,
): number | null {
  let index = fromIndex;
  for (let step = 0; step < length; step += 1) {
    index += direction;
    if (index < 0 || index >= length) {
      return null;
    }
    if (isEnabled(index)) {
      return index;
    }
  }
  return null;
}