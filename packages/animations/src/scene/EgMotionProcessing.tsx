import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { sceneStatusWarning } from './sceneColors.js';
import { rotateAroundBottomWorklet } from './rotateAroundAnchor.js';
import {
  MOTION_PROCESSING_DEFAULT_SIZE,
  MOTION_PROCESSING_LONG_ROTATE_MS,
  MOTION_PROCESSING_SHORT_INITIAL_DEG,
  MOTION_PROCESSING_SHORT_ROTATE_MS,
  MOTION_PROCESSING_STROKE,
} from './sceneTiming.js';

export type EgMotionProcessingProps = {
  /** 为 true 时双轴旋转；false 静止。 */
  active?: boolean;
  size?: number;
  stroke?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function EgMotionProcessing({
  active = true,
  size = MOTION_PROCESSING_DEFAULT_SIZE,
  stroke = MOTION_PROCESSING_STROKE,
  color = sceneStatusWarning(),
  style,
  testID = 'eg-motion-processing',
}: EgMotionProcessingProps) {
  const reduceMotion = useReducedMotion();
  const longRotation = useSharedValue(0);
  const shortRotation = useSharedValue(0);

  const pivot = (size * 3) / 26;
  const longHeight = (size * 24) / 26;
  const shortHeight = (size * 20) / 26;
  const pivotTop = size / 2 - pivot / 2;
  const pivotLeft = size / 2 - pivot / 2;
  const handLeft = size / 2 - stroke / 2;
  const handBottom = size / 2;

  useEffect(() => {
    if (!active || reduceMotion) {
      longRotation.value = withTiming(0, { duration: 0 });
      shortRotation.value = withTiming(0, { duration: 0 });
      return;
    }
    longRotation.value = withRepeat(
      withTiming(360, { duration: MOTION_PROCESSING_LONG_ROTATE_MS, easing: Easing.linear }),
      -1,
      false,
    );
    shortRotation.value = withRepeat(
      withTiming(360, { duration: MOTION_PROCESSING_SHORT_ROTATE_MS, easing: Easing.linear }),
      -1,
      false,
    );
  }, [active, longRotation, reduceMotion, shortRotation]);

  const longStyle = useAnimatedStyle(() => ({
    transform: rotateAroundBottomWorklet(longRotation.value, longHeight),
  }));

  const shortStyle = useAnimatedStyle(() => ({
    transform: rotateAroundBottomWorklet(
      shortRotation.value + MOTION_PROCESSING_SHORT_INITIAL_DEG,
      shortHeight,
    ),
  }));

  return (
    <View
      accessibilityLabel={active ? '处理中' : '处理'}
      accessibilityRole="image"
      accessibilityState={{ busy: active }}
      testID={testID}
      style={[styles.root, { width: size, height: size, overflow: 'hidden' }, style]}
    >
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          zIndex: 1,
          top: pivotTop,
          left: pivotLeft,
          width: pivot,
          height: pivot,
          borderRadius: pivot / 2,
          backgroundColor: color,
        }}
      />
      <Animated.View
        style={[
          styles.hand,
          longStyle,
          {
            left: handLeft,
            bottom: handBottom,
            width: stroke,
            height: longHeight,
            backgroundColor: color,
            borderRadius: stroke,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.hand,
          shortStyle,
          {
            left: handLeft,
            bottom: handBottom,
            width: stroke,
            height: shortHeight,
            backgroundColor: color,
            borderRadius: stroke,
            opacity: 0.55,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
  },
  hand: {
    position: 'absolute',
  },
});