import { useEffect, useMemo } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { sceneStatusSuccess } from './sceneColors.js';
import {
  DONE_TICK_DRAW_MS,
  DONE_TICK_PATH,
  DONE_TICK_SIZE,
  DONE_TICK_VIEWBOX,
} from './sceneTiming.js';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export type EgDoneTickProps = {
  color?: string;
  /** 描边动画延迟（ms）· 默认 0。 */
  delayMs?: number;
  size?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function EgDoneTick({
  color = sceneStatusSuccess(),
  delayMs = 0,
  size = DONE_TICK_SIZE,
  style,
  testID = 'eg-done-tick',
}: EgDoneTickProps) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      progress.value = 1;
      return;
    }
    const drawEasing = Easing.bezier(0.4, 0, 0.2, 1);
    progress.value = withDelay(
      delayMs,
      withSequence(
        withTiming(0.8182, { duration: DONE_TICK_DRAW_MS * 0.8182, easing: drawEasing }),
        withTiming(1, { duration: DONE_TICK_DRAW_MS * 0.1818, easing: drawEasing }),
      ),
    );
  }, [delayMs, progress, reduceMotion]);

  const animatedProps = useAnimatedProps(() => {
    'worklet';
    const t = progress.value;
    let dashArray = '0 100';
    let dashOffset = 0;
    if (t <= 0.8182) {
      const local = t / 0.8182;
      dashArray = `${68.5 * local} 100`;
      dashOffset = -21.7 * local;
    } else {
      const local = (t - 0.8182) / (1 - 0.8182);
      dashArray = `${68.5 + (70 - 68.5) * local} 100`;
      dashOffset = -21.7 + (-20 + 21.7) * local;
    }
    return {
      strokeDasharray: dashArray,
      strokeDashoffset: dashOffset,
    };
  });

  const pathProps = useMemo(
    () => ({
      d: DONE_TICK_PATH,
      fill: 'none' as const,
      stroke: color,
      strokeWidth: 6.865,
      strokeLinecap: 'round' as const,
      strokeLinejoin: 'round' as const,
    }),
    [color],
  );

  return (
    <Animated.View
      accessibilityLabel="成功"
      accessibilityRole="image"
      testID={testID}
      style={[styles.root, { width: size, height: size }, style]}
    >
      <Svg width="100%" height="100%" viewBox={`0 0 ${DONE_TICK_VIEWBOX} ${DONE_TICK_VIEWBOX}`}>
        <AnimatedPath animatedProps={animatedProps} {...pathProps} />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});