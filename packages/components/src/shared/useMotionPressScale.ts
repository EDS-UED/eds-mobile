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
  /** @default true — `false` 时仅跟踪 `pressing`，不做 scale（如 EgLinkButton 下划线反馈）。 */
  enabled?: boolean;
};

/** Reanimated scale 点按 — `EgEdsAnimaPress` / 业务自定义布局（如主页快捷入口圆 tile）共用。 */
export function useMotionPressScale(options: UseMotionPressScaleOptions = {}) {
  const { pressRecipe = 'tap', pressIntensity = 'sm', pressScaleDirection = 'up', enabled = true } =
    options;
  const [pressing, setPressing] = useState(false);
  const scale = useSharedValue(1);

  const activeScale =
    pressRecipe === 'glass'
      ? motionGlassPressScale(pressIntensity, pressScaleDirection)
      : motionPressScale(pressIntensity, pressScaleDirection);
  const pressInSpring =
    pressRecipe === 'glass' ? glassPressScaleInSpringConfig : tapPressScaleInSpringConfig;

  const animatedStyle = useAnimatedStyle(() => {
    if (!enabled) {
      return {};
    }
    return {
      transform: [{ scale: scale.value }],
    };
  }, [enabled, scale]);

  const onPressIn = useCallback(() => {
    setPressing(true);
    if (enabled) {
      scale.value = withSpring(activeScale, pressInSpring);
    }
  }, [activeScale, enabled, pressInSpring, scale]);

  const onPressOut = useCallback(() => {
    setPressing(false);
    if (enabled) {
      scale.value = withSpring(1, pressScaleOutSpringConfig);
    }
  }, [enabled, scale]);

  return { animatedStyle, onPressIn, onPressOut, pressing, activeScale };
}
