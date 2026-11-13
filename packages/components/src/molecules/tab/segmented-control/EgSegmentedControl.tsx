import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewProps } from 'react-native';
import Animated from 'react-native-reanimated';

import { triggerGlassPressHaptic } from '../../../atoms/glass/glassPressHaptic.js';
import { getThemeColors, mobileTheme } from '../../../theme/index.js';
import {
  egSegmentedControlSegmentMinHeight,
  egSegmentedControlSegmentPadding,
  egSegmentedControlTrackMinHeight,
  egSegmentedControlTrackPadding,
} from '../_shared/egSegmentedControlMetrics.js';
import { egSegmentedControlLabelTypography } from '../_shared/egTabTypography.js';
import { useEgSlideSegmentIndicator } from '../_shared/useEgSlideSegmentIndicator.js';
import type { EgSegmentedControlProps } from './EgSegmentedControl.types.js';
import { normalizeEgSegmentedControlSegments } from './EgSegmentedControl.types.js';

const radiusFull = mobileTheme.spacing['radius-full'] as number;

export function EgSegmentedControl(props: EgSegmentedControlProps & Pick<ViewProps, 'style'>) {
  const {
    segments: segmentsProp,
    selectedIndex: selectedIndexProp,
    defaultSelectedIndex = 0,
    onSelect,
    size = 'md',
    mode = 'light',
    testID,
    style,
    accessibilityLabel = 'Segmented Control',
  } = props;

  const colors = getThemeColors(mode);
  const segments = useMemo(
    () => normalizeEgSegmentedControlSegments(segmentsProp),
    [segmentsProp],
  );
  const [uncontrolledIndex, setUncontrolledIndex] = useState(defaultSelectedIndex);

  const selectedIndex = selectedIndexProp ?? uncontrolledIndex;
  const clampedIndex = Math.min(Math.max(selectedIndex, 0), Math.max(segments.length - 1, 0));

  const trackInset = egSegmentedControlTrackPadding();
  const trackMinHeight = egSegmentedControlTrackMinHeight(size);
  const segmentMinHeight = egSegmentedControlSegmentMinHeight(size);
  const segmentPad = egSegmentedControlSegmentPadding(size);

  const { indicatorStyle, onSegmentLayout, snapToIndex, thumbReadyRef } = useEgSlideSegmentIndicator(
    segments.length,
    clampedIndex,
  );

  const onSegmentPress = useCallback(
    (index: number) => {
      const segment = segments[index];
      if (segment == null || segment.disabled) {
        return;
      }
      if (index === clampedIndex) {
        return;
      }
      if (selectedIndexProp == null) {
        setUncontrolledIndex(index);
      }
      if (thumbReadyRef.current) {
        snapToIndex(index, true);
        triggerGlassPressHaptic();
      }
      onSelect?.(index, segment);
    },
    [clampedIndex, onSelect, segments, selectedIndexProp, snapToIndex, thumbReadyRef],
  );

  if (segments.length === 0) {
    return (
      <View
        testID={testID ?? 'tab-segmented-control'}
        style={style}
        accessibilityLabel={accessibilityLabel}
      />
    );
  }

  return (
    <View
      testID={testID ?? 'tab-segmented-control'}
      style={[
        styles.track,
        {
          borderRadius: radiusFull,
          backgroundColor: colors['material-card-moderate'] as string,
          padding: trackInset,
          minHeight: trackMinHeight,
        },
        style,
      ]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="tablist"
      collapsable={false}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.pill,
          {
            top: trackInset,
            bottom: trackInset,
            left: trackInset,
            borderRadius: radiusFull,
            backgroundColor: colors['material-face-primary'] as string,
          },
          indicatorStyle,
        ]}
      />
      {segments.map((segment, index) => {
        const selected = index === clampedIndex;
        return (
          <View
            key={segment.id}
            style={[styles.segment, { minHeight: segmentMinHeight }]}
            onLayout={onSegmentLayout(index)}
          >
            <Pressable
              onPress={() => onSegmentPress(index)}
              disabled={segment.disabled}
              accessibilityRole="tab"
              accessibilityState={{ selected, disabled: segment.disabled }}
              style={[styles.segmentPress, segmentPad, { minHeight: segmentMinHeight }]}
            >
              <Text
                style={[
                  egSegmentedControlLabelTypography(),
                  {
                    color: selected
                      ? (colors['text-base-primary'] as string)
                      : (colors['text-base-secondary'] as string),
                  },
                ]}
              >
                {segment.label}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    position: 'relative',
  },
  pill: {
    position: 'absolute',
  },
  segment: {
    flexShrink: 0,
    zIndex: 1,
  },
  segmentPress: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
