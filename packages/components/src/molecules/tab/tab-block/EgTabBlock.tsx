import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type ScrollViewProps,
  type ViewProps,
} from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { getNativeLinearGradient } from '../../../atoms/glass/nativeLinearGradient.js';
import { EgEdsAnimaLayoutContent } from '../../../shared/motion/EgEdsAnimaLayoutContent.js';
import { getThemeColors } from '../../../theme/index.js';
import {
  EG_TAB_BLOCK_CHIP_INNER_GAP,
  EG_TAB_BLOCK_CHIP_PADDING_HORIZONTAL,
  EG_TAB_BLOCK_CHIP_PADDING_VERTICAL,
  EG_TAB_BLOCK_BODY_GAP,
  EG_TAB_BLOCK_CHIP_RADIUS,
  EG_TAB_BLOCK_EDGE_FADE_SCREEN_INSET,
  EG_TAB_BLOCK_EDGE_FADE_WIDTH,
  EG_TAB_BLOCK_LIST_COMMIT_DELAY_MS,
  EG_TAB_BLOCK_SCENE_CONTENT_INSET,
  EG_TAB_BLOCK_TAB_GAP,
} from '../_shared/egTabBlockMetrics.js';
import { useEgHorizontalSegmentSwipe } from '../_shared/useEgHorizontalSegmentSwipe.js';
import {
  EG_TAB_BLOCK_EDGE_FADE_LOCATIONS,
  egTabBlockPageBackgroundFadeStops,
} from '../_shared/egTabBlockEdgeFade.js';
import { egTabBlockChipLabelTypography } from '../_shared/egTabBlockChipTypography.js';
import { useEgSlideSegmentIndicator } from '../_shared/useEgSlideSegmentIndicator.js';
import type { EgTabBlockItem, EgTabBlockProps } from './EgTabBlock.types.js';

function formatTabBlockCount(count: number) {
  return count >= 100 ? '99+' : String(count);
}

type TabBlockChipProps = {
  item: EgTabBlockItem;
  selected: boolean;
  onPress: () => void;
  colors: ReturnType<typeof getThemeColors>;
};

const TabBlockChip = memo(function TabBlockChip({
  item,
  selected,
  onPress,
  colors,
}: TabBlockChipProps) {
  const count = item.count ?? 0;
  const showCount = count > 0;
  const badgeLabel = formatTabBlockCount(count);
  const labelColor = selected
    ? (colors['text-same-white'] as string)
    : (colors['text-base-primary'] as string);
  const countColor = selected
    ? (colors['text-same-white'] as string)
    : (colors['status-danger'] as string);

  return (
    <Pressable
      onPress={onPress}
      disabled={item.disabled}
      accessibilityRole="tab"
      accessibilityState={{ selected, disabled: item.disabled }}
      accessibilityLabel={showCount ? `${item.label} ${badgeLabel}` : item.label}
      style={({ pressed }) => [
        styles.chip,
        {
          gap: EG_TAB_BLOCK_CHIP_INNER_GAP,
          paddingHorizontal: EG_TAB_BLOCK_CHIP_PADDING_HORIZONTAL,
          paddingVertical: EG_TAB_BLOCK_CHIP_PADDING_VERTICAL,
          borderRadius: EG_TAB_BLOCK_CHIP_RADIUS,
          backgroundColor: selected
            ? 'transparent'
            : (colors['material-card-deep'] as string),
          opacity: pressed ? 0.88 : 1,
        },
      ]}
    >
      <Text style={[egTabBlockChipLabelTypography(selected), { color: labelColor }]}>
        {item.label}
      </Text>
      {showCount ? (
        <Text style={[egTabBlockChipLabelTypography(selected), { color: countColor }]}>
          {badgeLabel}
        </Text>
      ) : null}
    </Pressable>
  );
});

function resolveSelectedIndex(items: EgTabBlockItem[], selectedId: string): number {
  const index = items.findIndex((item) => item.id === selectedId);
  return index >= 0 ? index : 0;
}

export function EgTabBlock(props: EgTabBlockProps & Pick<ViewProps, 'style'>) {
  const {
    items,
    selectedId,
    onSelect,
    mode = 'light',
    parentContentInset = EG_TAB_BLOCK_SCENE_CONTENT_INSET,
    testID,
    style,
    accessibilityLabel = 'Tab block',
    children,
    contentKey: contentKeyProp,
    onContentSwitchStart,
    contentSwipeToSwitch: contentSwipeToSwitchProp,
  } = props;

  const contentSwipeToSwitch =
    contentSwipeToSwitchProp ?? (children != null ? true : false);

  const colors = getThemeColors(mode);
  const pageBg = colors['box-page'] as string;
  const fadeStops = useMemo(() => egTabBlockPageBackgroundFadeStops(pageBg), [pageBg]);
  const LinearGradient = getNativeLinearGradient();
  const bleedHorizontal = parentContentInset;

  const measuredLayoutsRef = useRef<Record<number, { x: number; width: number }>>({});
  const commitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabScrollRef = useRef<{ scrollTo?: (options: { x?: number; animated?: boolean }) => void } | null>(
    null,
  );
  const [tabTrackWidth, setTabTrackWidth] = useState(0);
  const [scrollContentWidth, setScrollContentWidth] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const scrollXRef = useRef(0);

  const propIndex = useMemo(() => resolveSelectedIndex(items, selectedId), [items, selectedId]);
  const [selectedIndex, setSelectedIndex] = useState(propIndex);

  useEffect(() => {
    if (commitTimerRef.current == null) {
      setSelectedIndex(propIndex);
    }
  }, [propIndex]);

  useEffect(
    () => () => {
      if (commitTimerRef.current != null) {
        clearTimeout(commitTimerRef.current);
      }
    },
    [],
  );

  const { indicatorStyle, onSegmentLayout } = useEgSlideSegmentIndicator(
    items.length,
    selectedIndex,
  );

  const selectIndex = useCallback(
    (index: number) => {
      const item = items[index];
      if (item == null || item.disabled) {
        return;
      }
      setSelectedIndex(index);
      if (commitTimerRef.current != null) {
        clearTimeout(commitTimerRef.current);
      }
      commitTimerRef.current = setTimeout(() => {
        commitTimerRef.current = null;
        if (item.id !== selectedId) {
          onSelect(item.id, index);
        }
      }, EG_TAB_BLOCK_LIST_COMMIT_DELAY_MS);
    },
    [items, onSelect, selectedId],
  );

  const reportSegmentLayout = useCallback(
    (index: number) => (event: LayoutChangeEvent) => {
      const { x, width } = event.nativeEvent.layout;
      const prev = measuredLayoutsRef.current[index];
      if (prev && prev.x === x && prev.width === width) {
        return;
      }
      measuredLayoutsRef.current[index] = { x, width };
      onSegmentLayout(index)(event);
    },
    [onSegmentLayout],
  );

  const scrollSelectedTabIntoView = useCallback(
    (index: number) => {
      const layout = measuredLayoutsRef.current[index];
      if (!layout || tabTrackWidth <= 0 || scrollContentWidth <= tabTrackWidth) {
        return;
      }
      const chipLeft = parentContentInset + layout.x;
      const chipCenter = chipLeft + layout.width / 2;
      const maxScroll = Math.max(0, scrollContentWidth - tabTrackWidth);
      const targetX = Math.min(maxScroll, Math.max(0, chipCenter - tabTrackWidth / 2));
      tabScrollRef.current?.scrollTo?.({ x: targetX, animated: true });
    },
    [parentContentInset, scrollContentWidth, tabTrackWidth],
  );

  const onTabPress = useCallback(
    (index: number) => {
      scrollSelectedTabIntoView(index);
      if (index === selectedIndex) {
        return;
      }
      selectIndex(index);
    },
    [scrollSelectedTabIntoView, selectIndex, selectedIndex],
  );

  const segmentIds = useMemo(() => items.map((item) => item.id), [items]);

  const onContentSwipeSelect = useCallback(
    (id: string) => {
      const index = items.findIndex((item) => item.id === id);
      if (index < 0) {
        return;
      }
      const item = items[index];
      if (item?.disabled) {
        return;
      }
      if (commitTimerRef.current != null) {
        clearTimeout(commitTimerRef.current);
        commitTimerRef.current = null;
      }
      setSelectedIndex(index);
      scrollSelectedTabIntoView(index);
      if (id !== selectedId) {
        onSelect(id, index);
      }
    },
    [items, onSelect, scrollSelectedTabIntoView, selectedId],
  );

  const segmentSwipeGesture = useEgHorizontalSegmentSwipe(
    segmentIds,
    selectedId,
    onContentSwipeSelect,
  );

  useEffect(() => {
    scrollSelectedTabIntoView(selectedIndex);
  }, [scrollSelectedTabIntoView, selectedIndex]);

  const onTabScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { x: number } } }) => {
      const x = event.nativeEvent.contentOffset.x;
      scrollXRef.current = x;
      setScrollX(x);
    },
    [],
  );

  const showLeftEdgeFade = scrollX > 2;
  const showRightEdgeFade =
    scrollContentWidth > tabTrackWidth + 2 && scrollX + tabTrackWidth < scrollContentWidth - 2;

  if (items.length === 0) {
    return (
      <View testID={testID ?? 'tab-block'} style={style} accessibilityLabel={accessibilityLabel} />
    );
  }

  const body =
    children != null ? (
      <EgEdsAnimaLayoutContent
        contentKey={contentKeyProp ?? selectedId}
        onSwitchStart={onContentSwitchStart}
        style={styles.body}
      >
        {children}
      </EgEdsAnimaLayoutContent>
    ) : null;

  const bodyWrapped =
    body != null && contentSwipeToSwitch ? (
      <GestureDetector gesture={segmentSwipeGesture}>
        <View collapsable={false} style={styles.bodyGestureHost}>
          {body}
        </View>
      </GestureDetector>
    ) : (
      body
    );

  return (
    <View
      testID={testID ?? 'tab-block'}
      accessibilityLabel={accessibilityLabel}
      style={[styles.shell, style]}
    >
    <View
      accessibilityRole="tablist"
      style={[styles.root, { marginHorizontal: -bleedHorizontal }]}
    >
      <ScrollView
        ref={(node) => {
          tabScrollRef.current = node as typeof tabScrollRef.current;
        }}
        {...({
          horizontal: true,
          nestedScrollEnabled: true,
          showsHorizontalScrollIndicator: false,
          keyboardShouldPersistTaps: 'handled',
          onScroll: onTabScroll,
          scrollEventThrottle: 16,
          onLayout: (event: LayoutChangeEvent) =>
            setTabTrackWidth(event.nativeEvent.layout.width),
          onContentSizeChange: (width: number) => setScrollContentWidth(width),
          contentContainerStyle: { paddingHorizontal: parentContentInset },
        } as ScrollViewProps)}
      >
        <View collapsable={false} style={[styles.row, { gap: EG_TAB_BLOCK_TAB_GAP }]}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.indicator,
              {
                borderRadius: EG_TAB_BLOCK_CHIP_RADIUS,
                backgroundColor: colors['material-decor'] as string,
              },
              indicatorStyle,
            ]}
          />
          {items.map((item, index) => (
            <View key={item.id} style={styles.cell} onLayout={reportSegmentLayout(index)}>
              <TabBlockChip
                item={item}
                selected={index === selectedIndex}
                colors={colors}
                onPress={() => onTabPress(index)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
      {LinearGradient && showLeftEdgeFade ? (
        <LinearGradient
          pointerEvents="none"
          colors={fadeStops}
          locations={[...EG_TAB_BLOCK_EDGE_FADE_LOCATIONS]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[
            styles.edgeFade,
            { left: EG_TAB_BLOCK_EDGE_FADE_SCREEN_INSET, width: EG_TAB_BLOCK_EDGE_FADE_WIDTH },
          ]}
        />
      ) : null}
      {LinearGradient && showRightEdgeFade ? (
        <LinearGradient
          pointerEvents="none"
          colors={[fadeStops[2], fadeStops[1], fadeStops[0]]}
          locations={[...EG_TAB_BLOCK_EDGE_FADE_LOCATIONS]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[
            styles.edgeFade,
            { right: EG_TAB_BLOCK_EDGE_FADE_SCREEN_INSET, width: EG_TAB_BLOCK_EDGE_FADE_WIDTH },
          ]}
        />
      ) : null}
    </View>
    {bodyWrapped}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { alignSelf: 'stretch', width: '100%', flexGrow: 1 },
  root: { alignSelf: 'stretch', position: 'relative' },
  body: {
    alignSelf: 'stretch',
    width: '100%',
    flexGrow: 1,
    marginTop: EG_TAB_BLOCK_BODY_GAP,
  },
  bodyGestureHost: {
    alignSelf: 'stretch',
    width: '100%',
    flexGrow: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
  cell: { zIndex: 1, alignSelf: 'flex-start' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexGrow: 0,
    flexShrink: 0,
    overflow: 'visible',
  },
  indicator: { position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 0 },
  edgeFade: { position: 'absolute', top: 0, bottom: 0, zIndex: 2 },
});
