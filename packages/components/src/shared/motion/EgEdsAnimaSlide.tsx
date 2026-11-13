import { StyleSheet, Text, View, type ViewProps } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { getThemeColors, mobileTheme, type ThemeMode } from '../../theme/index.js';
import { edsFontStyle } from '../fontFamily.js';
import { useEgSlideTrack } from './useEgSlideTrack.js';

export type EgEdsAnimaSlideItem = { id: string; label: string };

export type EgEdsAnimaSlideProps = Pick<ViewProps, 'style' | 'testID'> & {
  mode: ThemeMode;
  items: EgEdsAnimaSlideItem[];
  selectedId: string;
  /** 滑块落位到新段后回调。 */
  onSelect: (id: string) => void;
  /** 按下整条缩放。默认 true。 */
  pressScale?: boolean;
  /** 拖动时滑块（胶囊）跟手；关闭后只在松手位置弹簧滑入。默认 true。 */
  followDrag?: boolean;
  disabled?: boolean;
  haptic?: boolean;
};

const radiusMd = mobileTheme.spacing['radius-md'] as number;
const spacing = mobileTheme.spacing as Record<string, number>;

/**
 * motion-slide · EdsSemanticAnima('slide')
 * 点按整条缩放 + 滑块跟手 + 点击 / 松手弹簧滑入（与 EgTabBar 同一实现）。
 */
export function EgEdsAnimaSlide({
  mode,
  items,
  selectedId,
  onSelect,
  pressScale = true,
  followDrag = true,
  disabled,
  haptic,
  style,
  testID,
}: EgEdsAnimaSlideProps) {
  const colors = getThemeColors(mode);
  const selectedIndex = Math.max(
    0,
    items.findIndex((item) => item.id === selectedId),
  );
  const { gesture, trackAnimatedStyle, indicatorStyle, onSegmentLayout, previewIndex } = useEgSlideTrack({
    count: items.length,
    selectedIndex,
    onSelect: (index) => {
      const item = items[index];
      if (item) onSelect(item.id);
    },
    pressScale,
    followDrag,
    disabled,
    haptic,
  });
  const activeIndex = previewIndex ?? selectedIndex;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        testID={testID}
        style={[
          styles.track,
          {
            backgroundColor: colors['material-card-moderate'] as string,
            borderColor: colors['stroke-divider-shallow'] as string,
          },
          style,
          trackAnimatedStyle,
        ]}
        accessibilityRole="tablist"
        collapsable={false}
      >
        <Animated.View
          pointerEvents="none"
          style={[styles.pill, { backgroundColor: colors['event-focus'] as string }, indicatorStyle]}
        />
        {items.map((item, index) => (
          <View
            key={item.id}
            style={styles.segment}
            onLayout={onSegmentLayout(index)}
            pointerEvents="none"
            accessibilityRole="tab"
            accessibilityState={{ selected: index === selectedIndex }}
          >
            <Text
              style={[
                styles.segmentLabel,
                {
                  color:
                    index === activeIndex
                      ? (colors['text-base-primary'] as string)
                      : (colors['text-base-secondary'] as string),
                },
              ]}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radiusMd,
    borderCurve: 'continuous',
    padding: spacing['spacing-1'] ?? 4,
    position: 'relative',
  },
  pill: {
    position: 'absolute',
    top: spacing['spacing-1'] ?? 4,
    bottom: spacing['spacing-1'] ?? 4,
    left: 0,
    borderRadius: radiusMd,
    borderCurve: 'continuous',
  },
  segment: {
    flex: 1,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  segmentLabel: {
    ...edsFontStyle('600'),
    fontSize: 15,
  },
});
