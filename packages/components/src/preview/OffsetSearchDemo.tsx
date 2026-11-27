import { EdsSemanticAnima } from '@eds/mobile-animations';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutRectangle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { cloneSpringConfig } from '../shared/slideMotion.js';
import { getThemeColors, mobileTheme, type ThemeMode } from '../theme/index.js';

const offsetSpring = cloneSpringConfig(EdsSemanticAnima('offset').springConfig);

/** 演示球 · 大于 icon 档以便看清位移（`spacing-10` 40px）。 */
const BALL_SIZE = mobileTheme.spacing['spacing-10'] as number;
/** 纵向要有可走距离；`spacing-20` 扣内边距后刚好被球占满，上下位移为 0。 */
const STAGE_MIN_HEIGHT = (mobileTheme.spacing['spacing-20'] as number) * 3;
const STAGE_PADDING = mobileTheme.spacing['spacing-5'] as number;

/** 触发器起始位 — 刻意偏离左上角，演示「任意触发点 → 同一落位」。 */
const TRIGGER_X_RATIO = 0.38;
const TRIGGER_Y_RATIO = 0.52;

export type OffsetSearchDemoAxis = 'horizontal' | 'vertical' | 'trigger';

type OffsetSearchDemoProps = {
  mode: ThemeMode;
  axis?: OffsetSearchDemoAxis;
};

/**
 * motion-offset · 落点回弹用 `EdsSemanticAnima('offset').springConfig`。
 * 默认左上角；点按移至对侧边缘。触发器模式：任意起点 → 同一终点。
 */
export function OffsetSearchDemo({ mode, axis = 'horizontal' }: OffsetSearchDemoProps) {
  const colors = getThemeColors(mode);
  const [atFinal, setAtFinal] = useState(false);
  const [stage, setStage] = useState<LayoutRectangle | null>(null);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  /** 运动中合成单层，避免圆角视图在位移路径上留下上一帧。 */
  const raster = useSharedValue(false);
  const skipMotion = useRef(true);

  const travel = useMemo(() => {
    const innerW = Math.max(0, (stage?.width ?? 0) - STAGE_PADDING * 2);
    const innerH = Math.max(0, (stage?.height ?? STAGE_MIN_HEIGHT) - STAGE_PADDING * 2);
    const maxX = Math.max(0, innerW - BALL_SIZE);
    const maxY = Math.max(0, innerH - BALL_SIZE);
    return {
      startX: 0,
      startY: 0,
      finalX: maxX,
      finalY: maxY,
      triggerX: maxX * TRIGGER_X_RATIO,
      triggerY: maxY * TRIGGER_Y_RATIO,
    };
  }, [stage?.height, stage?.width]);

  const start = useMemo(() => {
    if (axis === 'vertical') {
      return { x: travel.startX, y: travel.startY };
    }
    if (axis === 'trigger') {
      return { x: travel.triggerX, y: travel.triggerY };
    }
    return { x: travel.startX, y: travel.startY };
  }, [axis, travel.finalX, travel.finalY, travel.startX, travel.startY, travel.triggerX, travel.triggerY]);

  const final = useMemo(() => {
    if (axis === 'vertical') {
      return { x: travel.startX, y: travel.finalY };
    }
    return { x: travel.finalX, y: travel.startY };
  }, [axis, travel.finalX, travel.finalY, travel.startX, travel.startY]);

  useEffect(() => {
    skipMotion.current = true;
    setAtFinal(false);
    raster.value = false;
    translateX.value = start.x;
    translateY.value = start.y;
  }, [axis, raster, start.x, start.y, translateX, translateY]);

  useEffect(() => {
    if (skipMotion.current) {
      skipMotion.current = false;
      return;
    }
    const to = atFinal ? final : start;
    raster.value = true;
    translateX.value = withSpring(to.x, offsetSpring, (finished) => {
      if (finished) raster.value = false;
    });
    translateY.value = withSpring(to.y, offsetSpring);
  }, [atFinal, final.x, final.y, raster, start.x, start.y, translateX, translateY]);

  const ballStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    shouldRasterizeIOS: raster.value,
    renderToHardwareTextureAndroid: raster.value,
  }));

  const ballColor = colors['material-brand'] as string;

  return (
    <View style={styles.root}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="切换 offset 位移"
        onPress={() => setAtFinal((value) => !value)}
        style={styles.pressable}
      >
        <View
          onLayout={(event) => setStage(event.nativeEvent.layout)}
          style={styles.stage}
        >
          <Animated.View
            collapsable={false}
            style={[
              styles.ball,
              {
                width: BALL_SIZE,
                height: BALL_SIZE,
                borderRadius: BALL_SIZE / 2,
                backgroundColor: ballColor,
              },
              ballStyle,
            ]}
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    alignSelf: 'stretch',
  },
  pressable: {
    alignSelf: 'stretch',
  },
  stage: {
    alignSelf: 'stretch',
    minHeight: STAGE_MIN_HEIGHT,
    padding: STAGE_PADDING,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  ball: {
    position: 'relative',
    overflow: 'hidden',
  },
});