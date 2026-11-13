import { useCallback, useState } from 'react';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import {
  glassPressScaleInSpringConfig,
  pressScaleOutSpringConfig,
  tapPressScaleInSpringConfig,
} from './pressScaleSpring.js';
import {
  motionGlassPressScale,
  motionPressScale,
  type MotionPressIntensity,
  type MotionPressScaleDirection,
} from './themeScalars.js';

export type MotionPressRecipe = 'tap' | 'glass';

export type UseMotionPressScaleOptions = {
  /** @default 'tap' */
  pressRecipe?: MotionPressRecipe;
  /** @default 'sm' */
  pressIntensity?: MotionPressIntensity;
  /** @default 'up' */
  pressScaleDirection?: MotionPressScaleDirection;
};

/** Reanimated scale 点按 — `EgEdsAnimaPress` / 业务自定义布局（如主页快捷入口圆 tile）共用。 */
export function useMotionPressScale(options: UseMotionPressScaleOptions = {}) {
  const { pressRecipe = 'tap', pressIntensity = 'sm', pressScaleDirection = 'up' } = options;
  const [pressing, setPressing] = useState(false);
  const scale = useSharedValue(1);

  const activeScale =
    pressRecipe === 'glass'
      ? motionGlassPressScale(pressIntensity, pressScaleDirection)
      : motionPressScale(pressIntensity, pressScaleDirection);
  const pressInSpring =
    pressRecipe === 'glass' ? glassPressScaleInSpringConfig : tapPressScaleInSpringConfig;

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scale.value }],
    }),
    [scale],
  );

  const onPressIn = useCallback(() => {
    setPressing(true);
    scale.value = withSpring(activeScale, pressInSpring);
  }, [activeScale, pressInSpring, scale]);

  const onPressOut = useCallback(() => {
    setPressing(false);
    scale.value = withSpring(1, pressScaleOutSpringConfig);
  }, [scale]);

  return { animatedStyle, onPressIn, onPressOut, pressing, activeScale };
}
