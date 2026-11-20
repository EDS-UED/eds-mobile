import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { sceneMaterialBrand } from './sceneColors.js';
import {
  VERIFY_RING_DEFAULT_SIZE,
  VERIFY_RING_DOT_COUNT,
  VERIFY_RING_DOT_IDLE_OPACITY,
  VERIFY_RING_DOT_SIZE,
  VERIFY_RING_DOT_STEP_DEG,
} from './sceneTiming.js';
import { startVerifyRingDotPulse } from './verifyRingDotPulse.js';

export type EgVerifyRingDotsProps = {
  /** 为 true 时点阵追光；false 时 36 点静止。 */
  active?: boolean;
  /** 外环直径（px）· 默认 74。 */
  ringSize?: number;
  /** 追光色 · `--material-brand-primary`。 */
  color?: string;
  /** 静止态点色 · `--material-brand-tertiary`。 */
  idleColor?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

function VerifyRingDot({
  index,
  active,
  radius,
  activeColor,
  idleColor,
  reduceMotion,
}: {
  index: number;
  active: boolean;
  radius: number;
  activeColor: string;
  idleColor: string;
  reduceMotion: boolean;
}) {
  const opacity = useSharedValue(VERIFY_RING_DOT_IDLE_OPACITY);
  const dotColor = active && !reduceMotion ? activeColor : idleColor;

  useEffect(() => {
    if (!active || reduceMotion) {
      opacity.value = withTiming(VERIFY_RING_DOT_IDLE_OPACITY, { duration: 0 });
      return;
    }
    opacity.value = startVerifyRingDotPulse(index);
  }, [active, index, opacity, reduceMotion]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const angleDeg = index * VERIFY_RING_DOT_STEP_DEG;
  const translateY = -((radius - VERIFY_RING_DOT_SIZE) / 2);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.dot,
        dotStyle,
        {
          backgroundColor: dotColor,
          transform: [
            { translateX: -VERIFY_RING_DOT_SIZE / 2 },
            { translateY: -VERIFY_RING_DOT_SIZE / 2 },
            { rotate: `${angleDeg}deg` },
            { translateY },
          ],
        },
      ]}
    />
  );
}

export function EgVerifyRingDots({
  active = false,
  ringSize = VERIFY_RING_DEFAULT_SIZE,
  color = sceneMaterialBrand(),
  idleColor = color,
  style,
  testID = 'eg-verify-ring-dots',
}: EgVerifyRingDotsProps) {
  const reduceMotion = useReducedMotion();
  const dots = Array.from({ length: VERIFY_RING_DOT_COUNT }, (_, index) => index);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      testID={testID}
      style={[styles.root, { width: ringSize, height: ringSize }, style]}
    >
      {dots.map((index) => (
        <VerifyRingDot
          key={index}
          index={index}
          active={active}
          radius={ringSize}
          activeColor={color}
          idleColor={idleColor}
          reduceMotion={reduceMotion ?? false}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    overflow: 'visible',
  },
  dot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: VERIFY_RING_DOT_SIZE,
    height: VERIFY_RING_DOT_SIZE,
    borderRadius: VERIFY_RING_DOT_SIZE / 2,
  },
});