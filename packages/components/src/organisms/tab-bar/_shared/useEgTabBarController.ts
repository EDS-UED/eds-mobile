import { useCallback, useEffect, useMemo, useState } from 'react';

import { resolveColor } from '../../../shared/resolveColor.js';
import { useEgSlideTrack } from '../../../shared/motion/useEgSlideTrack.js';
import { getThemeColors, resolveThemeMode, type ThemeMode } from '../../../theme/index.js';
import type { EgTabBarItemData, EgTabBarProps } from '../tab-bar/EgTabBar.types.js';

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
    pressScale = true,
    followDrag = true,
  } = props;

  const mode: ThemeMode = modeProp ?? resolveThemeMode(undefined);
  const colors = getThemeColors(mode);
  const items = itemsProp ?? DEFAULT_TAB_BAR_ITEMS;

  const defaultSelectedIndex = normalizeTabIndex(defaultSelectedIndexProp, 0);
  const [internalIndex, setInternalIndex] = useState(defaultSelectedIndex);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const selectedIndex = normalizeTabIndex(selectedIndexProp ?? internalIndex, defaultSelectedIndex);
  const committedIndex = pendingIndex ?? selectedIndex;

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

  const selectionFill = useMemo(
    () => resolveColor(colors, 'event-focus'),
    [colors],
  );

  const selectIndex = useCallback(
    (index: number) => {
      if (disabled || index < 0 || index >= items.length) return;
      if (index === selectedIndex && pendingIndex === null) {
        return;
      }
      onSelectedIndexChange?.(index);
      if (selectedIndexProp === undefined) {
        setInternalIndex(index);
        setPendingIndex(null);
      } else {
        setPendingIndex(index);
      }
    },
    [disabled, items.length, onSelectedIndexChange, pendingIndex, selectedIndex, selectedIndexProp],
  );

  const { gesture, trackAnimatedStyle, indicatorStyle, onSegmentLayout, previewIndex } = useEgSlideTrack({
    count: items.length,
    selectedIndex: committedIndex,
    onSelect: selectIndex,
    disabled,
    pressScale,
    followDrag,
    haptic: !disabled,
  });

  return {
    mode,
    items,
    selectedIndex,
    visualSelectedIndex: previewIndex ?? committedIndex,
    disabled,
    selectionFill,
    indicatorStyle,
    barAnimatedStyle: trackAnimatedStyle,
    gesture,
    selectIndex,
    onItemLayout: onSegmentLayout,
  };
}
