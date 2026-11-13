import { useCallback, useMemo, useRef, useState, type ComponentRef } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewProps } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { EgEdsAnimaLayoutContent } from '../../../shared/motion/EgEdsAnimaLayoutContent.js';
import { triggerGlassPressHaptic } from '../../../atoms/glass/glassPressHaptic.js';
import { getThemeColors, mobileTheme } from '../../../theme/index.js';
import { useEgTabSwipeGesture } from '../_shared/useEgTabSwipeGesture.js';
import { egTabLabelTypography } from '../_shared/egTabTypography.js';
import { useEgSlideSegmentIndicator } from '../_shared/useEgSlideSegmentIndicator.js';
import type { EgTabProps } from './EgTab.types.js';

const spacing = mobileTheme.spacing;
const TAB_GAP = spacing['spacing-5'] as number;
/** Figma Tabs · 文案与指示线间距 spacing-2 (8px)。 */
const LABEL_INDICATOR_GAP = spacing['spacing-2'] as number;
/** Figma · Tab 条与正文区间距 spacing-5 (20px)。 */
const TAB_BODY_GAP = spacing['spacing-5'] as number;
const INDICATOR_HEIGHT = 2;

function resolveSelectedIndex(items: EgTabProps['items'], selectedId: string | undefined): number {
  if (selectedId == null) {
    return 0;
  }
  const index = items.findIndex((item) => item.id === selectedId);
  return index >= 0 ? index : 0;
}

export function EgTab(props: EgTabProps & Pick<ViewProps, 'style'>) {
  const {
    items,
    selectedId: selectedIdProp,
    defaultSelectedId,
    onSelect,
    mode = 'light',
    testID,
    style,
    accessibilityLabel = 'Tabs',
    swipeToSwitch = true,
    children,
    contentKey: contentKeyProp,
    onContentSwitchStart,
  } = props;

  const colors = getThemeColors(mode);
  const firstId = items[0]?.id;
  const [uncontrolledId, setUncontrolledId] = useState(
    () => defaultSelectedId ?? firstId ?? '',
  );

  const selectedId = selectedIdProp ?? uncontrolledId;
  const selectedIndex = useMemo(
    () => resolveSelectedIndex(items, selectedId),
    [items, selectedId],
  );

  const tabRowRef = useRef<ComponentRef<typeof View>>(null);
  const tabCellRefs = useRef<(ComponentRef<typeof View> | null)[]>([]);
  const {
    indicatorStyle,
    measureSegmentInContainer,
    snapToIndex,
    thumbReadyRef,
    indicatorX,
    indicatorWidth,
    layoutsShared,
  } = useEgSlideSegmentIndicator(items.length, selectedIndex, {
    measureContainerRef: tabRowRef,
  });

  const selectIndex = useCallback(
    (index: number) => {
      const item = items[index];
      if (item == null || item.disabled) {
        return;
      }
      if (selectedIdProp == null) {
        setUncontrolledId(item.id);
      }
      onSelect?.(item.id, index);
    },
    [items, onSelect, selectedIdProp],
  );

  const swipeGesture = useEgTabSwipeGesture({
    items,
    selectedIndex,
    disabled: items.every((item) => item.disabled),
    swipeEnabled: swipeToSwitch,
    layoutsShared,
    indicatorX,
    indicatorWidth,
    snapToIndex,
    selectIndex,
  });

  const onTabPress = useCallback(
    (index: number) => {
      const item = items[index];
      if (item == null || item.disabled) {
        return;
      }
      if (index === selectedIndex) {
        return;
      }
      if (selectedIdProp == null) {
        setUncontrolledId(item.id);
      }
      if (thumbReadyRef.current) {
        snapToIndex(index, true);
        triggerGlassPressHaptic();
      }
      onSelect?.(item.id, index);
    },
    [items, onSelect, selectedIdProp, selectedIndex, snapToIndex, thumbReadyRef],
  );

  if (items.length === 0) {
    return (
      <View
        testID={testID ?? 'tab-tabs'}
        style={style}
        accessibilityLabel={accessibilityLabel}
      />
    );
  }

  return (
    <GestureDetector gesture={swipeGesture}>
      <View
        testID={testID ?? 'tab-tabs'}
        style={[styles.swipeCapture, style]}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="tablist"
        collapsable={false}
      >
        <View ref={tabRowRef} style={styles.row} collapsable={false}>
      {items.map((item, index) => {
        const selected = index === selectedIndex;
        return (
          <View
            key={item.id}
            ref={(node) => {
              tabCellRefs.current[index] = node;
            }}
            style={[styles.tabCell, index > 0 ? { marginLeft: TAB_GAP } : null]}
            onLayout={(event) => {
              const { x, width } = event.nativeEvent.layout;
              measureSegmentInContainer(index, tabCellRefs.current[index], x, width);
            }}
          >
            <Pressable
              onPress={() => onTabPress(index)}
              disabled={item.disabled}
              accessibilityRole="tab"
              accessibilityState={{ selected, disabled: item.disabled }}
              style={styles.tabPress}
            >
              <Text
                style={[
                  egTabLabelTypography(),
                  {
                    color: selected
                      ? (colors['text-base-primary'] as string)
                      : (colors['text-base-secondary'] as string),
                    marginBottom: LABEL_INDICATOR_GAP,
                  },
                ]}
              >
                {item.label}
              </Text>
              <View style={styles.indicatorSlot} />
            </Pressable>
          </View>
        );
      })}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.slidingIndicator,
          { backgroundColor: colors['text-brand'] as string },
          indicatorStyle,
        ]}
      />
        </View>
        {children != null ? (
          <EgEdsAnimaLayoutContent
            contentKey={contentKeyProp ?? selectedId}
            onSwitchStart={onContentSwitchStart}
            style={styles.body}
          >
            {children}
          </EgEdsAnimaLayoutContent>
        ) : null}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  swipeCapture: {
    alignSelf: 'stretch',
    width: '100%',
    paddingVertical: spacing['spacing-4'] as number,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: 'relative',
  },
  tabCell: {
    alignSelf: 'flex-start',
  },
  tabPress: {
    alignItems: 'center',
  },
  indicatorSlot: {
    height: INDICATOR_HEIGHT,
    alignSelf: 'stretch',
  },
  slidingIndicator: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: INDICATOR_HEIGHT,
  },
  body: {
    alignSelf: 'stretch',
    width: '100%',
    marginTop: TAB_BODY_GAP,
  },
});
