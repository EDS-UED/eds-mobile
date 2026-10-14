import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { resolveMotionRecipe } from '@eds/mobile-animations';

import { resolveColor } from '../../../shared/resolveColor.js';
import { getThemeColors, resolveThemeMode, type ThemeMode } from '../../../theme/index.js';
import type { EgTabBarItemData, EgTabBarProps } from '../tab-bar/EgTabBar.types.js';
import type { TabBarItemLayout } from './tabBarHitTest.js';
import { useEgTabBarTrackInteraction } from './useEgTabBarTrackInteraction.js';

const navigationMotion = resolveMotionRecipe('navigation');

export function normalizeTabIndex(value: number | string | undefined, fallback: number): number {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

export const DEFAULT_TAB_BAR_ITEMS: EgTabBarItemData[] = [
  { key: '1', label: 'Label' },
  { key: '2', label: 'Label' },
  { key: '3', label: 'Label' },
  { key: '4', label: 'Label' },
  { key: '5', label: 'Label' },
];

export function useEgTabBarController(props: EgTabBarProps) {
  const {
    items: itemsProp,
    selectedIndex: selectedIndexProp,
    defaultSelectedIndex: defaultSelectedIndexProp = 0,
    onSelectedIndexChange,
    disabled = false,
    mode: modeProp,
  } = props;

  const mode: ThemeMode = modeProp ?? resolveThemeMode(undefined);
  const colors = getThemeColors(mode);
  const items = itemsProp ?? DEFAULT_TAB_BAR_ITEMS;

  const defaultSelectedIndex = normalizeTabIndex(defaultSelectedIndexProp, 0);
  const [internalIndex, setInternalIndex] = useState(defaultSelectedIndex);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const selectedIndex = normalizeTabIndex(selectedIndexProp ?? internalIndex, defaultSelectedIndex);
  const displayedIndex =
    pendingIndex ?? normalizeTabIndex(selectedIndexProp ?? internalIndex, defaultSelectedIndex);

  useEffect(() => {
    if (selectedIndexProp === undefined) {
      setInternalIndex(defaultSelectedIndex);
      setPendingIndex(null);
    }
  }, [defaultSelectedIndex, selectedIndexProp]);

  useEffect(() => {
    if (selectedIndexProp !== undefined && pendingIndex !== null && selectedIndexProp === pendingIndex) {
      setPendingIndex(null);
    }
  }, [pendingIndex, selectedIndexProp]);

  const itemLayouts = useRef<TabBarItemLayout[]>([]);
  const layoutsShared = useSharedValue<TabBarItemLayout[]>([]);
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const selectionFill = useMemo(
    () => resolveColor(colors, 'event-focus'),
    [colors],
  );

  const moveIndicator = useCallback(
    (index: number, animated: boolean) => {
      const layout = itemLayouts.current[index];
      if (!layout) return;
      if (animated) {
        indicatorX.value = withSpring(layout.x, navigationMotion.springConfig);
        indicatorWidth.value = withSpring(layout.width, navigationMotion.springConfig);
      } else {
        indicatorX.value = layout.x;
        indicatorWidth.value = layout.width;
      }
    },
    [indicatorWidth, indicatorX],
  );

  useEffect(() => {
    moveIndicator(displayedIndex, true);
  }, [displayedIndex, moveIndicator]);

  const indicatorStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: indicatorX.value }],
      width: indicatorWidth.value,
    }),
    [indicatorX, indicatorWidth],
  );

  const selectIndex = useCallback(
    (index: number) => {
      if (disabled || index < 0 || index >= items.length) return;
      onSelectedIndexChange?.(index);
      if (selectedIndexProp === undefined) {
        setInternalIndex(index);
        setPendingIndex(null);
      } else {
        setPendingIndex(index);
      }
    },
    [disabled, items.length, onSelectedIndexChange, selectedIndexProp],
  );

  const onItemLayout = useCallback(
    (index: number) => (event: LayoutChangeEvent) => {
      const { x, width } = event.nativeEvent.layout;
      itemLayouts.current[index] = { x, width };
      layoutsShared.value = itemLayouts.current.slice();
      if (index === displayedIndex) {
        moveIndicator(index, indicatorWidth.value > 0);
      }
    },
    [displayedIndex, indicatorWidth, layoutsShared, moveIndicator],
  );

  const { barAnimatedStyle, gesture, previewIndex } = useEgTabBarTrackInteraction({
    disabled,
    layoutsShared,
    indicatorX,
    indicatorWidth,
    selectIndex,
    haptic: !disabled,
  });

  const visualSelectedIndex = previewIndex ?? displayedIndex;

  return {
    mode,
    items,
    selectedIndex,
    visualSelectedIndex,
    disabled,
    selectionFill,
    indicatorStyle,
    barAnimatedStyle,
    gesture,
    selectIndex,
    onItemLayout,
  };
}
