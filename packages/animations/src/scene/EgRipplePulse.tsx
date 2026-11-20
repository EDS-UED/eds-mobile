import { useEffect } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { sceneMaterialBrand } from './sceneColors.js';
import {
  RIPPLE_PULSE_DEFAULT_SIZE,
  RIPPLE_PULSE_DURATION_MS,
  RIPPLE_PULSE_END_SCALE,
  RIPPLE_PULSE_STAGGER_MS,
  RIPPLE_PULSE_START_SCALE,
  RIPPLE_PULSE_STROKE,
} from './sceneTiming.js';

export type EgRipplePulseProps = {
  active?: boolean;
  size?: number;
  stroke?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

type RippleWaveProps = {
  index: number;
  active: boolean;
  inset: number;
  stroke: number;
  color: string;
  reduceMotion: boolean;
};

function RippleWave({ index, active, inset, stroke, color, reduceMotion }: RippleWaveProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!active || reduceMotion) {
      progress.value = 0;
      return;
    }
    progress.value = withDelay(
      index * RIPPLE_PULSE_STAGGER_MS,
      withRepeat(
        withTiming(1, {
          duration: RIPPLE_PULSE_DURATION_MS,
          easing: Easing.out(Easing.ease),
        }),
        -1,
        false,
      ),
    );
  }, [active, index, progress, reduceMotion]);

  const waveStyle = useAnimatedStyle(() => {
    'worklet';
    const t = progress.value;
    const scale = RIPPLE_PULSE_START_SCALE + (RIPPLE_PULSE_END_SCALE - RIPPLE_PULSE_START_SCALE) * t;
    const opacity = t <= 0.5 ? t * 2 : (1 - t) * 2;
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wave,
        waveStyle,
        {
          top: inset,
          left: inset,
          right: inset,
          bottom: inset,
          borderWidth: stroke,
          borderColor: color,
        },
      ]}
    />
  );
}

export function EgRipplePulse({
  active = true,
  size = RIPPLE_PULSE_DEFAULT_SIZE,
  stroke = RIPPLE_PULSE_STROKE,
  color = sceneMaterialBrand(),
  style,
  testID = 'eg-ripple-pulse',
}: EgRipplePulseProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const inset = ((1 - 1 / RIPPLE_PULSE_END_SCALE) / 2) * size;

  return (
    <Animated.View
      accessibilityLabel={active ? '加载中' : '加载'}
      accessibilityRole="image"
      accessibilityState={{ busy: active }}
      testID={testID}
      style={[styles.root, { width: size, height: size }, style]}
    >
      {[0, 1, 2].map((index) => (
        <RippleWave
          key={index}
          index={index}
          active={active}
          inset={inset}
          stroke={stroke}
          color={color}
          reduceMotion={reduceMotion}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
  },
  wave: {
    position: 'absolute',
    borderRadius: 9999,
  },
});