import { useCallback, useEffect, useRef, type ComponentRef, type MutableRefObject, type RefObject } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { snapSlideIndicatorX, type SlideTrackSegmentLayout } from '../../../shared/slideTrackIndicator.js';

function layoutsReady(layouts: SlideTrackSegmentLayout[], count: number): boolean {
  for (let i = 0; i < count; i += 1) {
    const layout = layouts[i];
    if (layout == null || layout.width <= 0) {
      return false;
    }
  }
  return count > 0;
}

function syncLayoutsShared(
  layoutsRef: MutableRefObject<SlideTrackSegmentLayout[]>,
  layoutsShared: { value: SlideTrackSegmentLayout[] },
  count: number,
): void {
  const slice = layoutsRef.current.slice(0, count);
  layoutsShared.value = slice;
}

type MeasurableLayoutNode = {
  measureLayout: (
    relativeToNativeNode: unknown,
    onSuccess: (x: number, y: number, width: number, height: number) => void,
    onFail?: () => void,
  ) => void;
};

type UseEgSlideSegmentIndicatorOptions = {
  /** 指示器定位相对容器（如 EgTab `row`）· 避免 margin 导致 x 偏移。 */
  measureContainerRef?: RefObject<ComponentRef<typeof View> | null>;
};

/** 水平段选中 · 指示器弹簧滑到 layout[index]（Tabs 下划线 · Segmented 胶囊）。 */
export function useEgSlideSegmentIndicator(
  segmentCount: number,
  selectedIndex: number,
  options?: UseEgSlideSegmentIndicatorOptions,
) {
  const measureContainerRef = options?.measureContainerRef;
  const layoutsRef = useRef<SlideTrackSegmentLayout[]>([]);
  const layoutsShared = useSharedValue<SlideTrackSegmentLayout[]>([]);
  const thumbReadyRef = useRef(false);
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const snapToIndex = useCallback(
    (index: number, animated: boolean) => {
      snapSlideIndicatorX(index, layoutsRef.current, indicatorX, indicatorWidth, animated);
    },
    [indicatorWidth, indicatorX],
  );

  useEffect(() => {
    if (!thumbReadyRef.current) {
      return;
    }
    snapToIndex(selectedIndex, true);
  }, [selectedIndex, snapToIndex]);

  const commitSegmentLayout = useCallback(
    (index: number, x: number, width: number) => {
      layoutsRef.current[index] = { x, width };
      syncLayoutsShared(layoutsRef, layoutsShared, segmentCount);
      if (!layoutsReady(layoutsRef.current, segmentCount)) {
        return;
      }
      if (!thumbReadyRef.current) {
        snapToIndex(selectedIndex, false);
        thumbReadyRef.current = true;
        return;
      }
      if (index === selectedIndex) {
        snapToIndex(selectedIndex, true);
      }
    },
    [layoutsShared, segmentCount, selectedIndex, snapToIndex],
  );

  const reportSegmentLayout = useCallback(
    (index: number, x: number, width: number) => {
      commitSegmentLayout(index, x, width);
    },
    [commitSegmentLayout],
  );

  const onSegmentLayout = useCallback(
    (index: number) => (event: LayoutChangeEvent) => {
      reportSegmentLayout(index, event.nativeEvent.layout.x, event.nativeEvent.layout.width);
    },
    [reportSegmentLayout],
  );

  const measureSegmentInContainer = useCallback(
    (index: number, cellRef: ComponentRef<typeof View> | null, fallbackX: number, width: number) => {
      const container = measureContainerRef?.current as MeasurableLayoutNode | null | undefined;
      const cell = cellRef as MeasurableLayoutNode | null;
      if (container && cell && typeof cell.measureLayout === 'function') {
        cell.measureLayout(
          container,
          (x: number) => {
            reportSegmentLayout(index, x, width);
          },
          () => {
            reportSegmentLayout(index, fallbackX, width);
          },
        );
        return;
      }
      reportSegmentLayout(index, fallbackX, width);
    },
    [measureContainerRef, reportSegmentLayout],
  );

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
    opacity: indicatorWidth.value > 0 ? 1 : 0,
  }));

  return {
    indicatorStyle,
    onSegmentLayout,
    measureSegmentInContainer,
    snapToIndex,
    thumbReadyRef,
    indicatorX,
    indicatorWidth,
    layoutsShared,
  };
}
