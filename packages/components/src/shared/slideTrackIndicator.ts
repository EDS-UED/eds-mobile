import { withSpring } from 'react-native-reanimated';

import { slideCommitSpringConfig } from './slideMotion.js';

type SlideSpringConfig = NonNullable<Parameters<typeof withSpring>[1]>;

export type SlideTrackSegmentLayout = {
  x: number;
  width: number;
};

export type SlideTrackRowLayout = {
  y: number;
  height: number;
};

type SharedNumber = { value: number };

/** 水平跟手 · 指示器在相邻段之间连续滑动（iOS SegmentedControl 手感）。 */
export function followSlideIndicatorX(
  pointerX: number,
  layouts: SlideTrackSegmentLayout[],
  indicatorX: SharedNumber,
  indicatorWidth: SharedNumber,
): void {
  'worklet';
  if (layouts.length === 0) {
    return;
  }
  if (layouts.length === 1) {
    indicatorX.value = layouts[0].x;
    indicatorWidth.value = layouts[0].width;
    return;
  }

  const centers = layouts.map((layout) => layout.x + layout.width / 2);
  const first = layouts[0];
  const last = layouts[layouts.length - 1];

  if (pointerX <= centers[0]) {
    indicatorX.value = first.x;
    indicatorWidth.value = first.width;
    return;
  }
  if (pointerX >= centers[centers.length - 1]) {
    indicatorX.value = last.x;
    indicatorWidth.value = last.width;
    return;
  }

  for (let i = 0; i < centers.length - 1; i += 1) {
    const c0 = centers[i];
    const c1 = centers[i + 1];
    if (pointerX >= c0 && pointerX <= c1) {
      const t = c1 === c0 ? 0 : (pointerX - c0) / (c1 - c0);
      const l0 = layouts[i];
      const l1 = layouts[i + 1];
      indicatorX.value = l0.x + (l1.x - l0.x) * t;
      indicatorWidth.value = l0.width + (l1.width - l0.width) * t;
      return;
    }
  }
}

function applySnapSlideIndicatorX(
  index: number,
  layouts: SlideTrackSegmentLayout[],
  indicatorX: SharedNumber,
  indicatorWidth: SharedNumber,
  animated: boolean,
  springConfig: SlideSpringConfig,
): void {
  'worklet';
  const layout = layouts[index];
  if (!layout) {
    return;
  }
  if (animated) {
    indicatorX.value = withSpring(layout.x, springConfig);
    indicatorWidth.value = withSpring(layout.width, springConfig);
  } else {
    indicatorX.value = layout.x;
    indicatorWidth.value = layout.width;
  }
}

/** JS 线程（Tab 点击 · layout 回调）。 */
export function snapSlideIndicatorX(
  index: number,
  layouts: SlideTrackSegmentLayout[],
  indicatorX: SharedNumber,
  indicatorWidth: SharedNumber,
  animated: boolean,
  springConfig: SlideSpringConfig = slideCommitSpringConfig,
): void {
  applySnapSlideIndicatorX(index, layouts, indicatorX, indicatorWidth, animated, springConfig);
}

/** UI 线程（TabBar 滑动手势落位）。 */
export function snapSlideIndicatorXWorklet(
  index: number,
  layouts: SlideTrackSegmentLayout[],
  indicatorX: SharedNumber,
  indicatorWidth: SharedNumber,
  animated: boolean,
  springConfig: SlideSpringConfig = slideCommitSpringConfig,
): void {
  'worklet';
  applySnapSlideIndicatorX(index, layouts, indicatorX, indicatorWidth, animated, springConfig);
}

/** 垂直跟手 · Menu 行之间连续滑动。 */
export function followSlideIndicatorY(
  pointerY: number,
  layouts: SlideTrackRowLayout[],
  indicatorY: SharedNumber,
  indicatorHeight: SharedNumber,
): void {
  'worklet';
  if (layouts.length === 0) {
    return;
  }
  if (layouts.length === 1) {
    indicatorY.value = layouts[0].y;
    indicatorHeight.value = layouts[0].height;
    return;
  }

  const centers = layouts.map((layout) => layout.y + layout.height / 2);
  const first = layouts[0];
  const last = layouts[layouts.length - 1];

  if (pointerY <= centers[0]) {
    indicatorY.value = first.y;
    indicatorHeight.value = first.height;
    return;
  }
  if (pointerY >= centers[centers.length - 1]) {
    indicatorY.value = last.y;
    indicatorHeight.value = last.height;
    return;
  }

  for (let i = 0; i < centers.length - 1; i += 1) {
    const c0 = centers[i];
    const c1 = centers[i + 1];
    if (pointerY >= c0 && pointerY <= c1) {
      const t = c1 === c0 ? 0 : (pointerY - c0) / (c1 - c0);
      const l0 = layouts[i];
      const l1 = layouts[i + 1];
      indicatorY.value = l0.y + (l1.y - l0.y) * t;
      indicatorHeight.value = l0.height + (l1.height - l0.height) * t;
      return;
    }
  }
}

export function snapSlideIndicatorY(
  index: number,
  layouts: SlideTrackRowLayout[],
  indicatorY: SharedNumber,
  indicatorHeight: SharedNumber,
  animated: boolean,
  springConfig: SlideSpringConfig = slideCommitSpringConfig,
): void {
  'worklet';
  const layout = layouts[index];
  if (!layout) {
    return;
  }
  if (animated) {
    indicatorY.value = withSpring(layout.y, springConfig);
    indicatorHeight.value = withSpring(layout.height, springConfig);
  } else {
    indicatorY.value = layout.y;
    indicatorHeight.value = layout.height;
  }
}

export function snapSlideIndicatorToMenuItem(
  itemId: string,
  layouts: { itemId: string; y: number; height: number }[],
  indicatorY: SharedNumber,
  indicatorHeight: SharedNumber,
  animated: boolean,
  springConfig: SlideSpringConfig = slideCommitSpringConfig,
): void {
  'worklet';
  for (let i = 0; i < layouts.length; i += 1) {
    if (layouts[i].itemId === itemId) {
      snapSlideIndicatorY(i, layouts, indicatorY, indicatorHeight, animated, springConfig);
      return;
    }
  }
}
