import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';
import { EdsSansText } from '../../../shared/EdsSansText.js';
import Animated from 'react-native-reanimated';

import { triggerGlassPressHaptic } from '../../../atoms/glass/glassPressHaptic.js';
import { getThemeColors, mobileTheme } from '../../../theme/index.js';
import {
  egSegmentedControlSegmentMinHeight,
  egSegmentedControlSegmentPadding,
  egSegmentedControlTrackMinHeight,
  egSegmentedControlTrackPadding,
} from '../_shared/egSegmentedControlMetrics.js';
import {
  egSegmentedControlLabelTypography,
  egSegmentedControlLabelWeight,
} from '../_shared/egTabTypography.js';
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
    size = 'lg',
    widthMode = 'hug',
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

  const isFillWidth = widthMode === 'fill';

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
        isFillWidth ? styles.trackFill : styles.trackHug,
        {
          borderRadius: radiusFull,
          backgroundColor: colors['material-card-moderate'] as string,
          paddingVertical: trackInset,
          paddingHorizontal: trackInset,
          minHeight: trackMinHeight,
        },
        style,
      ]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="tablist"
      collapsable={false}
    >
      <View
        style={[
          styles.row,
          isFillWidth ? styles.rowFill : styles.rowHug,
          { minHeight: segmentMinHeight },
        ]}
        collapsable={false}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pill,
            {
              top: 0,
              bottom: 0,
              left: 0,
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
              style={[
                styles.segment,
                isFillWidth ? styles.segmentFill : null,
                { minHeight: segmentMinHeight },
              ]}
              onLayout={onSegmentLayout(index)}
            >
              <Pressable
                onPress={() => onSegmentPress(index)}
                disabled={segment.disabled}
                accessibilityRole="tab"
                accessibilityState={{ selected, disabled: segment.disabled }}
                style={[
                  styles.segmentPress,
                  isFillWidth ? styles.segmentPressFill : null,
                  segmentPad,
                  { minHeight: segmentMinHeight },
                ]}
              >
                <EdsSansText
                  weight={egSegmentedControlLabelWeight()}
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
                </EdsSansText>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    alignSelf: 'flex-start',
  },
  trackHug: {
    alignSelf: 'flex-start',
  },
  trackFill: {
    alignSelf: 'stretch',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  rowHug: {
    alignSelf: 'flex-start',
  },
  rowFill: {
    alignSelf: 'stretch',
    width: '100%',
  },
  pill: {
    position: 'absolute',
  },
  segment: {
    flexShrink: 0,
    zIndex: 1,
  },
  segmentFill: {
    flex: 1,
    flexBasis: 0,
  },
  segmentPress: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentPressFill: {
    alignSelf: 'stretch',
    width: '100%',
  },
});
